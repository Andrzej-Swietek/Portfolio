require('dotenv').config()
const express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  ejs = require('ejs'),
  cors = require('cors'),
  jsonFile = require('jsonfile');


// global storing project path
global.appRoot = path.resolve(__dirname);

// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express()


const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');


// enable CORS
app.use(cors());

app.use(passport.initialize({}));
app.use(passport.session({}));

class UserDB {
  data = {
    id: "xdddd",
    name: "test",
    password: "test"
  };

  constructor() {
  }

  findOne(dataXD, cb) {
    return cb(null, this.data)
  }

}

const exDB = new UserDB();

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  exDB.findOne({
    _id: id
  }, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'usernameXD',
    passwordField: 'passwordXD'
  },
  function (username, password, done) {
    exDB.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      if (user.password !== password) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property. Limited to 50mb for both form data and json
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))

// Static files access
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '/app/views')))

//webpack object stored
jsonFile.readFile('./public/build/webpack-manifest.json', (err, obj) => {
  if (err) return err;
  app.set('webpack', obj);
});

// For local, dynamic changes can be updated
if (process.env.NODE_ENV === 'local') {
  app.use(function (req, res, next) {
    if (req.method === 'GET') {
      jsonFile.readFile('./public/build/webpack-manifest.json', (err, obj) => {
        if (err) return err;
        app.set('webpack', obj);
        next();
      });
    } else next();
  })
}

// handles all api
app.use('/api', require('./app/router/api'));

// home page
app.get('/', (req, res, next) => {
  return res.render('index.ejs',
    {
      message: "You can access this site offline (Message from server - EJS data bindings)",
      webpack: req.app.get('webpack')
    });
});

// return storage page with webpack object
app.get('/storage', (req, res, next) => res.render('storage', {webpack: req.app.get('webpack')}));

// return pushnotification page with webpack object
app.get('/pushnotification', (req, res, next) => res.render('pushnotification', {webpack: req.app.get('webpack')}));

// return algorithm page with webpack object
app.get('/algorithms', (req, res, next) => res.render('algorithms', {webpack: req.app.get('webpack')}));

// return robotics page with webpack object
app.get('/robotics', (req, res, next) => res.render('robotics', {webpack: req.app.get('webpack')}));

// return projects page with webpack object
app.get('/projects', (req, res, next) => res.render('projects', {webpack: req.app.get('webpack')}));

app.get('/athena', (req, res, next) => res.render('athena', {webpack: req.app.get('webpack')}));


app.get('/loginForm', (req, res, next) => res.render('login', {webpack: req.app.get('webpack')}));

// route for user's dashboard
app.get('/dashboard', (req, res) => {



});

// route for user logout
app.get('/logout', (req, res) => {
  // if (req.session.user && req.cookies.user_sid) {
  //   res.clearCookie('user_sid');
  //   res.redirect('/');
  // } else {
  //   res.redirect('/login');
  // }
});


//includowanie mongusa i bazki

const atlasURI =
  'mongodb+srv://andrzej:andrzej_s@cluster0-zner5.mongodb.net/portfolioDB?retryWrites=true&w=majority';
mongoose.connect(atlasURI, {useNewUrlParser: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('połączono z bazą danych');
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('users', userSchema);

app.post('/login',
  passport.authenticate('local',{successRedirect: '/dashboard'}, {failureRedirect: '/login'}, function (req, res) {
    // req.user dane usera

  }));


const PORT = process.env.PORT || 3000;
// app listening to port 3000
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
