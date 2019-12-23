const mongoose = require("../db/db");
//const crypto = require('crypto');
const bcrypt = require("bcrypt");
const schema = {
  login: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
    dropDups: true
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true
    //,select: false
  },
  fname: { type: mongoose.SchemaTypes.String, required: true },
  lname: { type: mongoose.SchemaTypes.String, required: true },
  mail: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
    dropDups: true
  },
  token: { type: mongoose.SchemaTypes.String, required: true },
  profil: {
    type: mongoose.SchemaTypes.String,
    default: "http://" + host + ":3000"
  },
  verified: { type: Number, default: 0 }
};
const collectionName = "users";
const userSchema = mongoose.Schema(schema);

userSchema.pre("save", function(next) {
  let user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    return next();
  });
});
userSchema.statics = {
  getUser(login) {
    return new Promise((resolve, reject) => {
      this.findOne({ login })
        .exec()
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  },
  authenticate(login, password) {
    return new Promise((resolve, reject) => {
      this.findOne({ login })
        .exec()
        .then(user => {
          if (user) {
            if (!user.verified)
              reject({
                error: "mail",
                msg: "Please Validate your account before !"
              });
            bcrypt.compare(password, user.password, (err, result) => {
              if (err || !result)
                reject({
                  error: "password",
                  msg: "Your password is incorrect !"
                });
              resolve(user);
            });
          } else
            reject({ error: "login", msg: "Your username is incorrect !" });
        });
    });
  },
  Validate(mail, token) {
    return new Promise((resolve, reject) => {
      this.findOne({ mail, token })
        .exec()
        .then(user => {
          if (user) {
            if (!user.verified) {
              this.findOneAndUpdate(
                { mail, token },
                { verified: 1 },
                { useFindAndModify: false }
              )
                .exec()
                .then(user => {
                  if (user) resolve("Verified");
                  else reject("Not verified");
                });
            } else reject("Already Verified");
          } else reject("Token or mail doesn't exist");
        });
    });
  }
};
const User = mongoose.model(collectionName, userSchema);
module.exports = User;
