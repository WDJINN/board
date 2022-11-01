const util = {};
util.parseError = function(errors){
  const parsed ={};
  if(errors.name == 'ValidationError'){
    for(const name in errors.errors){
      const validationError = errors.errors[name];
      parsed[name] = {message:validationError.message};
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username')>0){
    parsed.username = {message:'This username already exists!'};
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else {
    req.flash('error',{login:'Please login first'});
    res.redirect('/login');
  }
}

util.noPermission = function(req, res){
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/login');
}

module.exports = util;