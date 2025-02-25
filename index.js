const express = require('express');
const path = require('path');

const app = express();
const PORT = 8001;

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const { connectToMongoDB } = require('./connection');
const URL = require('./models/url');

const url = 'mongodb://localhost:27017/url-shortner';
connectToMongoDB(url)
  .then(() => console.log('MongoDB is Connected'))
  .catch((e) => console.log('MongoDB is having Issues', e));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// app.get('/test', async (req, res) => {
//   const allUsers = await URL.find({});
//   return res.render('home', { urls: allUsers });
// });

app.use('/url', urlRoute);
app.use('/', staticRoute);

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
