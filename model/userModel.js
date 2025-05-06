// const crypto = require('crypto');
// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// //const UserSchema = new mongoose.Schema({ username: { type: String,
// // required: true, unique: true },
// // email: {
// // type: String,
// //  required: true,
// // unique:true
// // },
// // password: { type: String,required:true },
// // },
// // { timestamps: true });
// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: [true, 'Please enter your username'],
//       unique: true
//     },
//     email: {
//       type: String,
//       required: [true, 'Please enter your email'],
//       unique: true,
//       lowercase: true,
//       validate: [validator.isEmail, 'Please provide a valid email']
//     },
//     photo: String,
//     role: {
//       type: String,
//       enum: ['user', 'author'],
//       default: 'user'
//     },
//     password: {
//       type: String,
//       required: [true, 'Please provide password'],
//       minlength: 8,
//       select: false
//     },
//     passwordConfirm: {
//       type: String,
//       require: [true, 'Please confirm your password'],
//       validate: {
//         //This only works on CREATE and SAVE!!!
//         validator: function(el) {
//           return el === this.password; //eg. abc === abc
//         },
//         message: 'Passwords are not the same!'
//       }
//     },
//     passwordChangedAt: Date,
//     passwordResetToken: String,
//     passwordResetExpires: Date,
//     active: {
//       type: Boolean,
//       default: true,
//       select: false
//     }
//   },
//   { timestamps: true }
// );

// const User = mongoose.model('User', userSchema);
// module.exports = User;
