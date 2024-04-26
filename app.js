require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));

// Makes the url purple because why not. :)
const colorizeURL = (url) => `\x1b[35m${url}\x1b[0m`;

// creates a link for the port when running the website.
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`App listening on: \n${colorizeURL(url)}`);
});
