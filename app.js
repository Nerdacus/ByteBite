require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "Byte-bite Shhhh",
    resave: false,
    saveUninitialized: true,
    //creates the cooooooookie
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: new Date(Date.now() + 3600000) },
  })
);

app.use(express.static("public"));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;

// Makes the url purple because why not. :)
const colorizeURL = (url) => `\x1b[35m${url}\x1b[0m`;

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/\n`;
  console.log(`\nApp listening on: \n${colorizeURL(url)}`);
});
