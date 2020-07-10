const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
    async createUser(req, res) {
        try {
            const { firstName, lastName, password, email } = req.body;
            const existenUser = await User.findOne({ email });

            if (!existenUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const userResponse = await User.create({
                    firstName: firstName,
                    lastName: lastName,
                    password: hashedPassword,
                    email: email,
                })
                return jwt.sign({user: userResponse},'secret', (err, token) => {
                    return res.json({
                        user: token,
                        user_id: userResponse._id
                    })
                }) 
            }
            return res.status(400).json({
                message:
                    "Email/user already exist!! do you want to loging instead? ",
            })
        } catch (error) {
            throw Error(`Error while registering a new user :${err}`);
        }
    },

    async getUserById(req, res) {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId);
            return res.json(user);
        } catch (error) {
            return res.status(400).json({
                message:
                    "User ID  does not exist, do you want to register instead?",
            });
        }
    },
};
