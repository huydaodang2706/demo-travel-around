const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { use } = require("../routes/users");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
  language: {
    type: String,
    enum: ["JAPANESE", "ENGLISH", "VIETNAMESE"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// If user password is modified, middle ware will hash password and save
userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    // console.log('password changed')
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// userSchema.methods.comparePassword = async (plainPassword) => {
//   console.log(plainPassword)
//   console.log(this)
//   try {
//     isMatch = await bcrypt.compare(plainPassword, this.password);
//     return isMatch;
//   } catch (error) {
//     throw error;
//   }
// };

// //Gen token to push to Cookies for this session authenticate
// userSchema.methods.generateToken = async () => {
//     const user = this;
//     console.log("user", user._id);

//   try {
//     // console.log("userSchema", userSchema);
//     var token = await jwt.sign(user._id.toHexString(), "secret");
//     var oneHour = moment().add(1, "hour").valueOf();

//     user.tokenExp = oneHour;
//     user.token = token;

//     await user.save();
//     return user;
//   } catch (error) {
//     return error;
//   }
// };
userSchema.methods.comparePassword = function(plainPassword,cb){
  var user = this;
  console.log('user',user)
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
      if (err) return cb(err);
      cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function(cb) {
  var user = this;
  console.log('user',user)
  console.log('userSchema', userSchema)
  var token =  jwt.sign(user._id.toHexString(),'secret')
  var oneHour = moment().add(1, 'hour').valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user){
      if(err) return cb(err)
      cb(null, user);
  })
}

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token,'secret',function(err, decode){
      user.findOne({"_id":decode, "token":token}, function(err, user){
          if(err) return cb(err);
          cb(null, user);
      })
  })
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
