const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const User = require("../service/schemas/users");
require("dotenv").config({ path: "../.env" });

const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email in use" });
    }
    const user = new User({ email, avatarURL: gravatar.url(email) });
    user.setPassword(password);
    const createdUser = await user.save();
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
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: "Email or password is wrong" });
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
    .catch((error) => console.error(error));
  const user = await User.findByIdAndUpdate(id, { avatarURL });

  return user
    ? res.status(200).json({ avatarURL })
    : res.status(409).json({ message: "Not authorized" });
};

module.exports = { register, login, logout, current, avatar };
