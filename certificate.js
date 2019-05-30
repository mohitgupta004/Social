const Validator = require('validator');
const isEmpty = require('./isempty');

module.exports = function validateCertificateInput(data) {
  let errors = {};

  data.description = !isEmpty(data.description)?data.description :'';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.issuer = !isEmpty(data.issuer) ? data.issuer : '';
  data.url = !isEmpty(data.url) ? data.url : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  data.licence_no = !isEmpty(data.licence_no) ? data.licence_no : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'name field is required';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'description field is required';
  }

  if (Validator.isEmpty(data.issuer)) {
    errors.issuer = 'issuer field is required';
  }

  if(!isEmpty(data.url)){
    if(!Validator.isURL(data.url)){
        errors.url = 'Not a Valid Url';
    }
}

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

    if (Validator.isEmpty(data.licence_no)) {
    errors.licence_no = 'Licence no is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
