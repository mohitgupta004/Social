const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills)?data.skills:'';

if(validator.isEmpty(data.status)){
    errors.status = 'Status is Required.'
}

if(validator.isEmpty(data.skills)){
    errors.skills = 'Skills is Required.'
}

if(!isEmpty(data.website)){
    if(!validator.isURL(data.website)){
        errors.website = 'Not a Valid Url';
    }
}

if(!isEmpty(data.youtube)){
    if(!validator.isURL(data.youtube)){
        errors.youtube = 'Not a Valid Url';
    }
}

if(!isEmpty(data.instagram)){
    if(!validator.isURL(data.instagram)){
        errors.instagram = 'Not a Valid Url';
    }
}

if(!isEmpty(data.facebook)){
    if(!validator.isURL(data.facebook)){
        errors.facebook = 'Not a Valid Url';
    }
}

if(!isEmpty(data.linkedin)){
    if(!validator.isURL(data.linkedin)){
        errors.linkedin = 'Not a Valid Url';
    }
}

if(!isEmpty(data.twitter)){
    if(!validator.isURL(data.twitter)){
        errors.twitter = 'Not a Valid Url';
    }
}
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
