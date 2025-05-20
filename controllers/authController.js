const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //1) Check if user exists && password is correct
    if (!email || !password) {
      return res.status(404).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    //2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }
    //3) If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.protect = async (req, res, next) => {
  //1) Getting token and check of it's there
  let token;

  //1) Get token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      //401 means unauthorized
      status: 'fail',
      message: 'You are not logged in! PLease log in to get access'
    });
  }
  // //2) Verification token
  // let decoded;
  // try {
  //   decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   req.User = decoded;
  //   next();
  // } catch (error) {
  //   return res.status(401).json({
  //     status: 'fail',
  //     message: 'Invalid or expired token. Please log in again'
  //   });
  // }

  // //3) Check if user still exists
  // let freshUser;
  // try {
  //   freshUser = await User.findById(decoded.id);
  //   if (!freshUser) {
  //     return res.status(401).json({
  //       status: 'fail',
  //       message: 'The user belonging to this token no longer exists'
  //     });
  //   }
  //   req.User = freshUser;
  //   next();
  // } catch (error) {
  //   return res.status(500).json({
  //     status: 'error',
  //     message: 'An error occurred while verifying the user',
  //     error: error.message
  //   });
  // }

  // //4) check if user changed password after the token was issued
  // if (freshUser.changedPasswordAfter(decoded.iat)) {
  //   return res.status(401).json({
  //     status: 'fail',
  //     message: 'User recently changed password! Please log in again'
  //   });
  // }
  // // 5) Grant access
  // try {
  //   req.User = freshUser;
  // } catch (error) {
  //   return res.status(401).json({
  //     status: 'fail',
  //     message: 'Invalid or expired token. Please log in again'
  //   });
  // }

  try {
    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.'
      });
    }

    // 5) Grant access protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

// controllers/authController.js
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
    httpOnly: true,
    sameSite: 'Strict', // or 'Lax' depending on your setup
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(200).json({ status: 'success' });
};
