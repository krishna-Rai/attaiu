const Joi = require('joi') 
const schemas = { 
  login: Joi.object({ 
    userName: Joi.string().required(),
    password: Joi.string().required() 
  }), 
  jsonpatch: Joi.object({
      json: Joi.object(),
      patch: Joi.object()
  }),
  query: Joi.object({
    url : Joi.string().required()
  })
  
}; 
module.exports = schemas;