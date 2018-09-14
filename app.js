//set all values
var express      = require("express"),
app              = express(),
expressSanitizer = require("express-sanitizer"),
mongoose         = require("mongoose"),
methodOverride   = require("method-override"),
body             = require("body-parser");
//to use the body parser for the post request
app.use(body.urlencoded({ extended: true }));
//use sanitizer
app.use(expressSanitizer());
//connect to campDB
mongoose.connect('mongodb://localhost:27017/blog_app',{ useNewUrlParser: true });
//to later use the css
app.use(express.static("public"));
//use method override
app.use(methodOverride('_method'));
//create schemas
var blogSchema = new mongoose.Schema({
  title   : String,
  img     : String,
  body    : String,
  created : {type: Date,default:Date.now}
});
// create MODEL
var Blog = mongoose.model('Blog',blogSchema);
//create blog
/*
Blog.create({
  title   : "first time here",
  img     : "https://techcrunch.com/wp-content/uploads/2015/04/codecode.jpg?w=730&crop=1",
  body    : "yes, its my first time hello"
},function(err,blog){
    if(err){}
    else{console.log("created " + blog)};
});
*/
//RESTFUL ROUTES
app.get('/',function(req,res){
   res.redirect('/blogs');  
});
//INDEX ROUTE
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){console.log(err);}
        else{
          res.render('index.ejs',{blogs:blogs}); 
        }
    });
});
//NEW ROUTE
app.get('/blogs/new',function(req,res){
    res.render('new.ejs'); 
});
//CREATE ROUTE
app.post('/blogs',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,blog){
       if(err){console.log("error");}
       else{
           console.log("blog added!");
           res.redirect('/blogs')
       }
    });
});
//SHOW ROUTE
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){console.log("error "+err);}
        else{
            res.render("show.ejs",{blog:blog});
        }
    });

});
//EDIT ROUTE
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){console.log("error "+err);}
        else{
            res.render("edit.ejs",{blog:blog});
        }
    });

});
//UPDATE ROUTE
app.put('/blogs/:id/',function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){console.log("error "+err);}
        else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });

});
//DESTROY ROUTE
app.delete('/blogs/:id/',function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,deletedBlog){
        if(err){console.log("error "+err);}
        else{
            res.redirect("/blogs");
        }
    });
});
//listen on port
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("server is up!"); 
});
