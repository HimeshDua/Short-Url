const {} = require('express');
const { nanoid } = require('nanoid');
const URL = require('../models/url');
const mongoose = require('mongoose');
async function handleGeneratNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(404).json({ error: 'URL is required' });
  const shortID = nanoid(6);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
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
