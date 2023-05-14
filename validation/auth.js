const Joi = require("joi");

const UserSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .regex(/^\S+@\S+\.\S+$/),
  password: Joi.string().min(5).required(),
});

const options = {
  abortEarly: false,
  allowUnknow: true,
  stripUnknown: false,
};

function validate() {
  return (req, res, next) => {
    const { error, value } = Joi.object()
      .keys({ body: UserSchema })
      .validate({ body: req.body }, options);

    if (typeof error !== "undefined") {
      return res.status(400).json({
        message: error.details.map(({ message }) => message).join(" ,"),
      });
    }
    req.body = value.body;
    return next();
  };
}

const validateVerify = async (req, res, next) => {
  const { error, value } = Joi.object()
    .keys({
      body: Joi.object().keys({
        email: Joi.string()
          .required()
          .regex(/^\S+@\S+\.\S+$/),
      }),
    })
    .validate({ body: req.body }, options);
  if (typeof error !== "undefined") {
    return res.status(400).json({ message: "missing required field email" });
  }
  req.body = value.body;
  return next();
};

module.exports = { validate, validateVerify };
