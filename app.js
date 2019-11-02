var express 		= require ("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose		= require("mongoose"),
	methodOverride 	= require("method-override"),
	expressSantizer	= require("express-sanitizer");


//	APP CONFIG
//mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSantizer());
app.use(methodOverride("_method"));

// m-lab config
let dev_db_url = 'mongodb://subhadeep:Qwerty!2@ds259410.mlab.com:59410/blogappdatabase';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// Requiring Blog model from models directory
const Blog = require('./models/blog.model');


//	MONGOOSE/MODEL CONFIG
//var blogSchema = new mongoose.Schema({
//	title: String,
//	image: String,
//	body: String,
//	created: {type: Date, default: Date.now}
//});
//var Blog = mongoose.model("Blog", blogSchema);


// DEFAULT BLOG 
// Blog.create({
// 	title: "Test Blog",
// 	image: "http://images.locanto.net/1887928991/Show-Quality-labrador-pups-in-low-price-palam-pet-shop_1.jpg",
// 	body: "HELLO THIS IS A BLOG POST!"	
// });

//	RESTful ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(error, blogs){
		if(error){
			console.log(error);
		}else{
			res.render("index", {blogs: blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
	//create blog (blog is having the data as an object because of the form having blog[title],  blog[name]...). In order to understand type console.log(req.body);
	//console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//console.log(req.body);
	Blog.create(req.body.blog, function(error, newBlog){
		if(error){
			res.render("new");
		}else{
			//then, redirect to the index
			console.log("One Blog Registered!");
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(error, foundBlog){
		if(error){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(error, foundBlog){
		if(error){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog){
		if(error){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, function(error){
		if(error){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	// redirect somewhere
});

app.listen(process.env.PORT, process.env.IP,function(){
	console.log("UNBLOGGED started at server " + process.env.PORT);
});
