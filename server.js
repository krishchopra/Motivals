const express = require("express");
const app = express();
var path = require("path");
var dataServicesAuth = require("./data-services-auth")
var dataService = require("./data-service")
app.use(express.urlencoded({ extended: false }));


const exphbs = require("express-handlebars");
const sessions = require("client-sessions");

app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "default" }));
app.set("view engine", ".hbs");

app.use(
  sessions({
    cookieName: "session",
    secret: "JohnCena",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);

app.use(function (req, res, next) {
  res.locals.sessions = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    // Not logged in
    res.redirect("/");
  } else {
    next();
  }
}

// GET Methods ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/dashboard", ensureLogin, function (req, res) {
  res.render("dashboard");
});

app.get("/login", (req,res)=> {
  res.render("login")
})

//login test hardcoded

const user = {
  username: "sampleuser",
  password: "samplepassword",
  email: "sampleuser@example.com"
};

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === "") {
    // Render 'missing credentials'
    return res.render("login", { errorMsg: "Missing credentials."});
  }

  // use sample "user" (declared above)
  if(username === user.username && password === user.password){

    console.log("we in")
    // Add the user on the session and redirect them to the dashboard page.
    req.session.user = {
      username: user.username,
      email: user.email
    };

    res.redirect("/dashboard");
  } else {
    // render 'invalid username or password'
    res.render("login", { errorMsg: "invalid username or password!"});
  }
});


// initialize ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.use(express.static("public"));


app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
};

app.use(function(req,res){
  res.status(404).send("Page Not Found");
});

