const mongoose = require('mongoose');

// const User = require('./userModel');
// const validator = require('validator');

// Blog PostModel
// const BlogPostSchema = new mongoose.Schema({ title: { type:
// String, required: true },
// subtitle: { type: String },
// content: { type: String,required: true }, imageUrl: { type: String
// },
// author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// }, { timestamps: true });

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a name'],
      trim: true
    },
    subtitle: {
      type: String,
      default: 'Programming post',
      trim: true
    },
    content: {
      type: String,
      required: [true, 'A post must have a content'],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A post must have an author']
    }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
