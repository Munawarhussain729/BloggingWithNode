const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const app = express();

app.set("view engine", "ejs");

app.listen(3000);

const DBURI =
  "mongodb+srv://munawar_blogs:Munawar_Blogs@blogcluster.cjmaxwc.mongodb.net/Blogs_Data";
mongoose
  .connect(DBURI)
  .then((result) => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log(error));
// Middleweare and Static files
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "SecondTesting Blog",
    snippet: "About my second Blog",
    body: "More about my Blog",
  });
  blog
    .save()
    .then((result) => res.send(result))
    .catch((err) => console.log("Error is ", err));
});

app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => console.log(error));
});

app.get("/single-blog", (req, res) => {
  console.log("Inside ");
  Blog.findById("642421285e52488852435f9c")
    .then((result) => {
      console.log("Result ", { result });
      res.send(result);
    })
    .catch((error) => console.log(error));
});

app.get("/", (req, resp) => {
  resp.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    });
});
app.get("/about", (req, resp) => {
  resp.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new Blog" });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { title: "Blog Details", blog: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((results) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, resp) => {
  resp.status(404).render("404", { title: "404" });
});
