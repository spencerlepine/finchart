const joi = require('joi');

// Minimum eight and maximum 13 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
const AuthenticationRequestSchema = joi.object({
  username: joi.string().min(3).max(75).required(),
  password: joi
    .string()
    .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,13}$/))
    .min(3)
    .max(75)
    .required(),
});

module.exports = AuthenticationRequestSchema;
