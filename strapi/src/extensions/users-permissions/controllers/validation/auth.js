"use strict";
const { yup, validateYupSchema } = require("@strapi/utils");
const callbackBodySchema = yup.object().shape({
  identifier: yup.string().required(),
  password: yup.string().required(),
});
const registerSchema = yup.object({
  email: yup.string().email().required(),
  username: yup.string().required(),
  password: yup.string().required(),
});
module.exports = {
  validateRegisterBody: validateYupSchema(registerSchema),
  validateCallbackBody: validateYupSchema(callbackBodySchema),
};
