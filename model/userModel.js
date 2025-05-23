// const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//const UserSchema = new mongoose.Schema({ username: { type: String,
// required: true, unique: true },
// email: {
// type: String,
//  required: true,
// unique:true
// },
// password: { type: String,required:true },
// },
// { timestamps: true });
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please tell us your name'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
      type: String,
      enum: ['user', 'author'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      require: [true, 'Please confirm your password'],
      validate: {
        //This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password; //eg. abc === abc
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
