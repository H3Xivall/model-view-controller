const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
require('dotenv').config();

const Sequelize = require('sequelize');
let sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            port: process.env.DB_PORT,
            logging: false,
        }
    );
}
// Execute the schema and seed the database with random data


async function seedDatabase() {
    try {
        await sequelize.authenticate();
        const schemaSQL = fs.readFileSync(path.join(__dirname, './schema/schema.sql'), 'utf8');
        await sequelize.query(schemaSQL);
        await require('./seeds/seeds.js')(sequelize);
        console.log('Database schema and seed data successfully loaded!');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDatabase();
