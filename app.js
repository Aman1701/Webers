const path = require("path");
const express = require("express");
const morgan = require("morgan");

const viewsController = require("./controllers/viewsController");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.engine("pug", require("pug").__express);
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(express.json());

app.get("/launchpads", viewsController.getLaunchpads);

app.get("/launch/:id", viewsController.getOneLaunch);

module.exports = app;
