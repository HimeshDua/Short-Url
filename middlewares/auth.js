const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next) {
  const token = req.cookies?.token;
  req.user = null;

  console.log('cookieee', token);

  if (!token) return next();

  const user = getUser(token);

  req.user = user;
  return next();
}

function restrictTo(roles) {
  return function (req, res, next) {
    if (!req.user) return res.redirect('/login');
    console.log('roles', req.user.role);

    if (!roles.includes(req.user.role)) return res.end('You Are Unauthorized');

    next();
  };
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};
