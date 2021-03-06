const validator = require('validator');
const isEmpty   = require('./isEmpty');

module.exports = function validateChangePassword(data){
    let errors = {};

    // Check If Field is Empty..........
    data.password = !isEmpty(data.password) ? data.password : '';
   // data.current = !isEmpty(data.current) ? data.current : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
      }
    
      if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters';
      }
    
      if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required';
      }
    
      if (!validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
      }
     return{
        errors,
        isValid:isEmpty(errors)
    }


}