const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
// decode jwt
const ExtractJwt = require("passport-jwt").ExtractJwt;
// Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "CHATPETH"; // Secret key
const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromHeader("authorization"),
   secretOrKey: SECRET,
}


const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
	console.log("sub: " + payload.sub);
	
	// Implement Multiple Local User Authentication Strategies in Passport.js
	/*
	Use payload.sub as username to look at databases
	# SELECT * FROM Machines WHERE username=payload.sub;
	*/
   if(payload.sub === "super")
   {
	   UNAME = "Supervisor";
	   done(null, true);
   }
   
   else
   {
	   
	   done(null, false);
   }
});

const passport = require("passport");

app.use(bodyParser.json()); // Enable json body-parser
// Add jwtAuth to passport
passport.use(jwtAuth);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const requireJWTAuth = passport.authenticate("jwt",{session:false});

var UNAME = "login";
const PORT = process.env.PORT || 80;

const loginMiddleware = (req, res, next) => {
	
	console.log(req.body);
	
	// Use req.body.username and req.body.password to look at databases
	/*
	var checkPassword = SELECT password FROM UserInformations WHERE username=req.body,username;
	if(req.body.password == checkPassword)
	{
		// login pass
		next();
	}
	else
	{
		// loginFailed;
	}
	*/
	if(req.body.username === "super" && req.body.password === "qwer!@34")
	{
		console.log("supervisor login complete");
		UNAME = "Supervisor";
		next();
	}
	else
	{
		res.json({
			type: false,
			message: 'Authentication failed!',
			token: ""
		});
		console.log("login failed");
		
		
	}
}

app.post("/index", loginMiddleware, (req, res) => {
   const payload = {
      sub: req.body.username,
      iat: new Date().getTime() // iat --> issue at date
   };
   const mytoken = jwt.encode(payload, SECRET);
   //res.send(jwt.encode(payload, SECRET));
   
   
   res.json({
                    type: true,
					message: 'Authentication successful!',
                    token: mytoken
	});
	
});

app.get('/', function(req, res){
	console.log('req / recv');
  res.sendFile(__dirname + "/" + "index.html");
});

// JWT
app.get("/index", requireJWTAuth, (req, res) => {
	console.log("/index passed");
	
	// For support jwt in next release
   //res.send("Authorized");
   // Check token in http header
   
   
     res.json({
                    type: true,
					message: 'authorized',
					username: UNAME,
					mqtt: {
						username:"wzvravkf",
						password:"v1OZdLXaX06l",
						url:"m10.cloudmqtt.com",
						port:37606
					},
					
	});
	
	//res.sendFile(__dirname + "/" + "supervisor" + ".html");
});

app.get('/login', function(req, res){
  console.log('req login recv');
  res.sendFile(__dirname + "/" + "login.html");
  
});

app.get('/jwt-vanilla.js', function(req, res){
  
  res.sendFile(__dirname + "/" + "jwt-vanilla.js");
});


app.get('/home', function(req, res){
  
  res.sendFile(__dirname + "/" + "homepage.html");
});

// Do not forget to add auth
app.get('/symp', function(req, res){
  console.log("req symp received");
  res.sendFile(__dirname + "/symp.html");
});


app.get('/rm315', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room315.html");
});

app.get('/rm316', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room316.html");
});

app.get('/rm317', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room317.html");
});

app.get('/rm318', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room318.html");
});

app.get('/rm321', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room321.html");
});

app.get('/rm322', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room322.html");
});

app.get('/rm323', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room323.html");
});

app.get('/rm324', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room324.html");
});

app.get('/rm325', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room325.html");
});

app.get('/rm326', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room326.html");
});

app.get('/rm327', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room327.html");
});

app.get('/rm328', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room328.html");
});

app.get('/rm331', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room331.html");
});

app.get('/rm332', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room332.html");
});

app.get('/rm333', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room333.html");
});

app.get('/rm334', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room334.html");
});

app.get('/rm335', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room335.html");
});

app.get('/rm336', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room336.html");
});

app.get('/rm337', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room337.html");
});

app.get('/rm338', function(req, res){
  
  res.sendFile(__dirname + "/phuket/room338.html");
});



app.use(function (req, res, next) {
  res.status(404).send("(404) Page not found!")
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('(500) Server error!!')
});



app.listen(PORT, () => console.log(`Listening on ${ PORT }`));