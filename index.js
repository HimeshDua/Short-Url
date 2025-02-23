const express = require('express');

const app = express();
const PORT = 8001;

const urlRoutes = require('./routes/url');
const { connectToMongoDB } = require('./connection');
const URL = require('./models/url');

const url = 'mongodb://localhost:27017/url-shortner';
connectToMongoDB(url)
  .then(() => console.log('MongoDB is Connected'))
  .catch((e) => console.log('MongoDB is having Issues', e));

app.use(express.json());

app.use('/url', urlRoutes);

app.use('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at localhost:${PORT}`));
