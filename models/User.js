const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            length: {
                arguments: [3, 20],
                msg: 'Username must be between 3 and 20 characters',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            length: {
                arguments: [6],
                msg: 'Password must be at least 6 characters',
            },
        },
    },
}, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
        },
    },
});

module.exports = User;