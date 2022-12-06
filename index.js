const TodoTask = require("./models/TodoTask");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true })); //Urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
const dotenv = require("dotenv");
dotenv.config();

app.use("/static", express.static("public"));

//connection to db
// mongoose.set('useFindAndModify', true);
mongoose.set("strictQuery", true);
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("Connected to db!");
    app.listen(7001, () => console.log("Server Up and running"));
  }
);
// app.listen(7001, () => console.log("server up and running"));
app.set("view engine", "ejs");

// GET METHOD
// app.get("/", (req, res) => {
//   res.render('todo.ejs');
// });
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

// POST METHOD
// app.post('/',(req, res) => {
//     console.log(req.body);
//     });
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });
//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
