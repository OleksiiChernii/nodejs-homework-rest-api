const Joi = require("joi");

const ContactSchema = Joi.object().keys({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .required()
    .regex(/^\S+@\S+\.\S+$/),
  phone: Joi.string()
    .required()
});

const options = {
  abortEarly: false,
  allowUnknow: true,
  stripUnknown: false,
};

function validateCreateContact() {
  return (req, res, next) => {
    const { error, value } = Joi.object()
      .keys({ body: ContactSchema })
      .validate({ body: req.body }, options);
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: errorHandler(error) });
    }
    req.body = value.body;
    return next();
  };
}

const errorHandler = error => {
  const fields = error.details.map(({ context }) => context.key);
  return (
    "missing required " +
    (fields.length > 1 ? fields.join(", ") + " fields" : fields[0] + " field")
  );
};

const updateContactSchema = Joi.object().keys({
  params: Joi.object().keys({
    contactId: Joi.string().min(5).required(),
  }),
  body: Joi.object().required(),
});

function validateUpdateContact() {
  return (req, res, next) => {
    const { error, value } = updateContactSchema.validate(
      { params: req.params, body: req.body },
      options
    );
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: 'missing fields' });
    }
    req.body = value.body;
    req.params = value.params;
    return next();
  };
}

module.exports = { validateCreateContact, validateUpdateContact };
