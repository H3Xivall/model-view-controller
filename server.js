const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session.Store);
const path = require('path');
const sequelize = require('./db/connection');
const app = express();

// Set up view engine
app.set('view engine', 'handlebars');
app.engine('handlebars', require('express-handlebars').engine());

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up session
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    }, sequelize);

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}))