import createError from "#root/lib/utils/createError.js";

const validate = (schema) => (req, _, next) => {
  const { error, value } = schema.validate(req.body || {}, { abortEarly: false });

  // if (error) return next(error.details.map((d) => d.message).join(", "), 400)
  if (error) return next(createError(error.details[0].message, 400));

  req.filteredBody = value;
  next();
};

export default validate;
