const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const User = require("../service/schemas/users");
const { v4: uuid } = require("uuid");
const sendgrid = require("@sendgrid/mail");
require("dotenv").config({ path: "../.env" });

sendgrid.setApiKey(process.env.API_KEY);

const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email in use" });
    }
    const verificationToken = uuid();
    const user = new User({
      email,
      avatarURL: gravatar.url(email),
      verificationToken,
    });
    user.setPassword(password);
    const createdUser = await user.save();
    const url = `/users/verify/${verificationToken}`;
    const text = `Please confirm your email, ${url}`;
    const html = `<p>Please confirm your email, <a>${url}</a></p>`;
    const message = {
      from: process.env.API_EMAIL,
      to: email,
      subject: "Confirm your email",
      text,
      html,
    };
    await sendgrid.send(message);
    return res.status(201).json({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
      },
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email, verify: true });
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!user.verify) {
      return res.status(401).json({ message: "User not verified" });
    }
    const token = jsonwebtoken.sign(
      { id: user._id, email },
      process.env.SECRET
    );
    return res.status(200).json({
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const logout = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { token: null },
      { new: true }
    );
    if (!user) {
      throw Error("Not authorized");
    }
    return res.status(204).end();
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

const current = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  return user
    ? res
        .status(200)
        .json({ email: user.email, subscription: user.subscription })
    : res.status(401).json({ message: "Not authorized" });
};

const avatar = async (req, res, next) => {
  const { id } = req.user;
  const { path, originalname } = req.file;
  const [name, ext] = originalname.split(".");
  const avatarURL = `/avatars/${name}-${id}.${ext}`;
  Jimp.read(path)
    .then((picture) => {
      return picture.resize(250, 250).write("public" + avatarURL);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
  const user = await User.findByIdAndUpdate(id, { avatarURL });

  return user
    ? res.status(200).json({ avatarURL })
    : res.status(409).json({ message: "Not authorized" });
};

const verifyToken = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (user.verify) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null }
  );
  return res.status(200).json({ message: "Verification successful" });
};

const verify = async (req, res, next) => {
  const { email } = req.body;
  try {
    const verificationToken = uuid();
    const user = await User.findOne({ email });
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    await User.findOneAndUpdate({ email }, { verificationToken });
    const url = `/users/verify/${verificationToken}`;
    const text = `Please confirm your email, ${url}`;
    const html = `<p>Please confirm your email, <a>${url}</a></p>`;
    const message = {
      from: process.env.API_EMAIL,
      to: email,
      subject: "Confirm your email",
      text,
      html,
    };
    await sendgrid.send(message);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
  next();
};

module.exports = {
  register,
  login,
  logout,
  current,
  avatar,
  verifyToken,
  verify,
};
