const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const util = require('../util');

//Index
router.get('/', async function(req, res){
  let page = Math.max(1, parseInt(req.query.page));
  let limit = Math.max(1, parseInt(req.query.limit)); //한 페이지 당 표시되어야할 게시글 수
  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:10;

  const skip = (page-1)*limit; // ex) 3번째 페이지를 만들려면 DB에서 처음 20개의 게시글을 skip 하기 위함
  const count = await Post.countDocuments({});
  const maxPage = Math.ceil(count/limit);
  const posts = await Post.find({})
    .populate('author')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .exec();
    
  res.render('posts/index', {
    posts:posts,
    currentPage:page,
    maxPage:maxPage,
    limit:limit
  });
});


//New
router.get('/new', util.isLoggedin, function(req, res) {
  const post = req.flash('post')[0]||{};
  const errors = req.flash('errors')[0]||{};
  res.render('posts/new',{post:post, errors:errors});
});


//Create
router.post('/', util.isLoggedin, function(req, res) {
  req.body.author = req.user._id;
  Post.create(req.body, function (err, post){
    if (err) {
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts/new'+res.locals.getPostQueryString());
    }
    res.redirect('/posts'+res.locals.getPostQueryString(false, {page:1}));
  });
});


//Show
router.get('/:id', (req, res) => {
  Post.findOne({_id: req.params.id})
    .populate('author')
    .exec(function (err, post) {
    if (err) return res.json(err);
    res.render('posts/show', {post: post});
  });
});

//Edit
router.get('/:id/edit', util.isLoggedin, checkPermission, (req, res) => {
  const post = req.flash('post')[0];
  const errors = req.flash('errors')[0]||{};
  if(!post){
    Post.findOne({_id: req.params.id}, function (err, post) {
      if (err) return res.json(err);
      res.render('posts/edit', {post:post, errors:errors});
    });
  } else {
    post._id = req.params.id;
    res.render('posts/edit', {post:post, errors:errors});
  }
});

//Update
router.put('/:id', util.isLoggedin, checkPermission, (req, res) => {
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post) {
    if (err) {
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts/'+req.params.id+'/edit'+res.locals.getPostQueryString());
    }
    res.redirect('/posts/'+req.params.id+res.locals.getPostQueryString());
  });
});


//Destroy
router.delete('/:id', util.isLoggedin, checkPermission, function (req, res) {
  Post.deleteOne({_id: req.params.id}, function (err) {
    if (err) return res.json(err);
    res.redirect('/posts'+res.locals.getPostQueryString());
  });
});

module.exports = router;

//private function
function checkPermission(req, res, next){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    if(post.author != req.user.id) return util.noPermission(req,res);

    next();
  });
}