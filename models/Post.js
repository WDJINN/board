const mongoose = require('mongoose');
const User = require('./User');

//schema
const postSchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required!']},
  body:{type:String, required:[true, 'Body is required!']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
});

//model & export
const Post = mongoose.model('post', postSchema);

module.exports = Post;
