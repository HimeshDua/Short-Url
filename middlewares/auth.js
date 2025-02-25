const { getUser } = require('../service/auth');

async function restrictedTologgedinUserOnly(req, res, next) {
  const userId = req.cookies.uid;

  if (!userId) return res.redirect('/login');
  const user = getUser(userId);
  if (!user) return res.redirect('/login');

  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const userId = req.cookies.uid;

  const user = getUser(userId);

  req.user = user;
  next();
}

function checkSignup(req, res, next) {
  if (req.user._id) return res.render('home');
  next();
}

module.exports = {
  restrictedTologgedinUserOnly,
  checkAuth,
  checkSignup,
};
