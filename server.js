const express = require('express');
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const sequelize = require('./config/connection');
const apiRoutes = require('./controllers/api');
const homeRoutes = require('./controllers/homeRoutes');
const dashboardRoutes = require('./controllers/dashboardRoutes');
const userRoutes = require('./controllers/userRoutes');
const exphbs = require('express-handlebars');

// Load environment variables from .env file
dotenv.config();

seedDatabase();

//Create an instance of the Express application
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        // Set max 20 minutes
        maxAge: 20 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true,
    store: new sequelizeStore({
        db: sequelize
    })
}));

// Set up Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

// Set up routes
// app.use('/api', apiRoutes);
// app.use('/', homeRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/user', userRoutes);

// Connect to the database and sync models
async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log(`Database connection has been established successfully at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        // await seedDatabase();

        // Start the server
        const HOST = process.env.HOST || '0.0.0.0';
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://${HOST}:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

// Execute the schema and seed the database with random data
const seedDatabase = async () => {
    try {
        const schemaSQL = require('fs').readFileSync('./db/schema/schema.sql', 'utf8');
        await sequelize.query(schemaSQL);

        await require('./db/seeds/seeds.js')(sequelize);

        console.log('Database schema and seed data successfully loaded!');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

// Start the server

startServer();