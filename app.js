const express = require('express')
const app = express()
const mongoose = require("mongoose");
const passport = require("passport");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const methodOverride = require("method-override");
const flash = require("express-flash");
const connectDB = require('./config/connect')
const mainRoutes = require('./routes/main')
const gamesRoutes = require('./routes/games')
require("dotenv").config();
const port = process.env.PORT

// Passport config
//require("./config/passport")(passport);

//Connect To Database
connectDB(process.env.MONGO_URI)

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

app.use(session({
    secret: 'foo',
    resave:false,
    saveUninitialized: false    
  }));

/*
// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
*/

// Passport middleware
//app.use(passport.initialize());
//app.use(passport.session());
//Use flash messages for errors, info, ect...
//app.use(flash());

app.use("/", mainRoutes);
app.use("/games", gamesRoutes);

app.listen(port, () =>
console.log(`Server is listening on port ${port}...`)
);