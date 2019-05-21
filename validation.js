"use strict";

const joi = require('joi');

const fileSchema = joi.object({
  name: joi.string(),
  file: joi.string().default(joi.ref('name')),
  path: joi.string().default(`/home/${process.env.USER}`)
}).unknown();


const workSchema = joi.array().items(fileSchema);

module.exports = async function (app, obj) {
  if (!obj) obj = [];

  // validate the config object
  const validation = joi.validate(obj, workSchema);
  if (validation.error) {
    const errors = [];
    validation.error.details.forEach( detail => {
      errors.push(detail.message);
    });
    // process failed
    throw new Error(`http config validation error: ${errors.join(", ")}`);
  }

  return validation.value;
};
