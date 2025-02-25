const {} = require('express');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const User = require('../models/user');
const URL = require('../models/url');
async function handleGeneratNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(404).json({ error: 'URL is required' });
  const shortID = nanoid(8);

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render('home', { id: shortID });
  // return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  try {
    res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (e) {
    res.send(e);
    console.error(e);
  }
}

module.exports = {
  handleGeneratNewShortURL,
  handleGetAnalytics,
};
