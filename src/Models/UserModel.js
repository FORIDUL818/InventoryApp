const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => {
                let emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
                return emailRegex.test(v);
            },
            message: "Your email is not valid."
        }
    },
    password: {
        type: String,
        required: true,
        set: (value) => {
            return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
        }
    }
}, { versionKey: false, timestamps: true });

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
