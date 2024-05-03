const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./models/');

async function registerUser(userData) {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await User.create({
            username: userData.username,
            password: hashedPassword,
        });

        return newUser;
    } catch (err) {
        throw new Error('Error registering new user');
    }
}

async function loginUser(credentials) {
    try {
        const user = await User.findOne({
            where: {
                username: credentials.username
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }

        const token = jwt.sign({
            id: user.id
        },
        process.env.JWT_SECRET, {
            expiresIn: '20m'
        });

        return token;
    } catch (err) {
        throw new Error('Error logging in user');
    }
}

module.exports = {
    registerUser,
    loginUser
};