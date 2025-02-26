const jwt = require('jsonwebtoken');
const SECRET = 'Hems1122';

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    SECRET
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
