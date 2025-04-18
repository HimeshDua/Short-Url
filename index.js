const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connection');

const app = express();
const PORT = 8001 || 3000;

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const URL = require('./models/url');
const { restrictTo, checkForAuthentication } = require('./middlewares/auth');

connectToMongoDB('mongodb://localhost:27017/url-shortner')
  .then(() => console.log('MongoDB is Connected'))
  .catch((e) => console.log('MongoDB is having Issues', e));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use('/url', restrictTo(['NORMAL', 'ADMIN']), urlRoute);
app.use('/user', userRoute);
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
