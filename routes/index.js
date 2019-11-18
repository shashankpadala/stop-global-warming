var express = require('express');
var router = express.Router();

var userModule = require('../modules/user');
var userPost=require('../modules/post');
var bodyParser=require('body-parser');
var cookieparser=require('cookie-parser');
var urlencodedParser=bodyParser.urlencoded({extended:true});
var jwt= require('jsonwebtoken');
var datas=userModule.find({});
var pst=userPost.find({});
var post=[],mail=[];
var email;
/* GET home page. */
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'LoginToken');
  } catch(err) {
    res.redirect('/login')
  }
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function ckeckEmail(req,res,next){
    var email=req.body.uemail;
    var checkexitemail= userModule.findOne({email:email})
    checkexitemail.exec((err,data)=>{
        if(err) throw err;
        if(data)
            return res.render('register',{title: 'register',msg:'Email alreay present'});
        next();
    });
}
router.post('/post',urlencodedParser,function(req,res){
  var text=req.body.post;
  console.log(req.body.post+" skdjb"+email);
  var usePost=new userPost({
    post:text,
    email:email
  });
  usePost.save((err,doc)=>{
    if(err) throw err;
  });
  console.log(usePost);
  res.render('post',{title: 'post',msg:'Email alreay present'});
})
router.get('/', function(req, res, next) {
  pst.exec(function(err,result){
    if(err) throw err;
    
    result.forEach(function(data){
    post.push(data.post);
    
    mail.push(data.email);
    
    })
    for(var i=0;i<mail.length;i++){
        res.cookie("data"+i,post[i]+","+mail[i]);
        console.log(post[i]+" "+mail[i]);
    }
    res.render('homepage', { title: 'Homepage' });
})
   
  });
router.get('/login', function(req, res, next) {
  res.render('login',{title:'login'})
});
router.post('/login',urlencodedParser, function(req, res, next) {
  email=req.body.uemail;
  var password=req.body.upass;
  var checkEmail= userModule.findOne({email:email});
  if(checkEmail==null)
  res.render('login', { title: 'Login',msg:"Invalid Username and Password " });
  checkEmail.exec((err,data)=>{
    if(err)throw err;
    var getUserId=data._id;
    //var uname=data.username;
    var getPass=data.pass;
    console.log(data.pass+" "+password);
    if(password==getPass)
    { 
       var token = jwt.sign({ userId: getUserId }, 'LoginToken');
       localStorage.setItem('userToken', token);
     localStorage.setItem('login_name', email);
     res.cookie("name",data.username);
     res.cookie("email",data.email);
     res.cookie("phone",data.mobile);
     res.render('homepage', { title: 'homepage',msg:"Invalid Username and Password " });
    }else{
      res.render('login', { title: 'Login',msg:"Invalid Username and Password " });
    }
  }) ;
 
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register',msg:''});
});
router.post('/register',ckeckEmail,function(req, res, next) {
    var uname=req.body.uname;
    var unum=req.body.unum;
    var uemail=req.body.uemail;
    var upass=req.body.upass;
    var utype=req.body.utype;
    var ucpass=req.body.ucpass;

    if(upass!=ucpass)
    {
      res.render('register', { title: 'register', msg:'Password not matched' });
    }
    else{
    var userDetails = new userModule({
        username:uname,
        mobile:unum,
        email:uemail,
        pass:upass,
        tipe:utype
    });
    console.log(userDetails);
    userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('register', { title: 'register', msg:'User register Successfully' });
    })
  }
});

router.get('/profile', function(req, res, next) {
  var mpst=userPost.find({email:email});
  var mpost=[];
  mpst.exec(function(err,result){
    result.forEach(function(data){
        mpost.push(data.post);
    })
    for(var i=0;i<mpost.length;i++){
      res.cookie("mdata"+i,mpost[i]+","+" ");
    
      console.log(mpost[i]);
  }
  res.render('profile', { title: 'profile', msg:'User register Successfully' });
  })
  
});


router.get('/airpollution', function(req, res, next) {
    res.render('airpollution', { title: 'airpollution' });
  });
  
router.get('/forget', function(req, res, next) {
    res.render('forget', { title: 'forget' });
  });
router.get('/info', function(req, res, next) {
    res.render('info', { title: 'info' });
  });
  
router.get('/heading', function(req, res, next) {
    res.render('heading', { title: 'heading' });
  });
  
  
router.get('/landpollution', function(req, res, next) {
    res.render('landpollution', { title: 'landpollution' });
  });
  
router.get('/news', function(req, res, next) {
    res.render('news', { title: 'news' });
  });
  
router.get('/nextnews', function(req, res, next) {
    res.render('nextnews', { title: 'nextnews' });
  });
  
router.get('/pollution', function(req, res, next) {
    res.render('pollution', { title: 'pollution' });
  });
  router.get('/stories', function(req, res, next) {
      res.render('stories', { title: 'stories' });
    });
  router.get('/post', function(req, res, next) {
    res.render('post', { title: 'post' });
  });
    router.get('/types', function(req, res, next) {
        res.render('types', { title: 'types' });
      });
router.get('/waterpollution', function(req, res, next) {
    res.render('waterpollution', { title: 'waterpollution' });
  });
  router.get('/logout', function(req, res, next) {
    localStorage.removeItem('userToken');
   localStorage.removeItem('login_name');
    res.redirect('/login');
  });
module.exports = router;

