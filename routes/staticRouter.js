const express = require('express');
const URL = require('../models/url');
const router = express.Router();

router.get('/', async (req, res) => {
  const allUrl = await URL.find({});
  return res.render('home', {
    urls: allUrl,
  });
});

router.get('/login', (req, res) => {
  return res.render('login');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

module.exports = router;
