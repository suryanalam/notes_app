const {
  addTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/todo.controller");

const express = require("express");
const todoRouter = express.Router();

todoRouter.post("/", addTask); // add task
todoRouter.get("/", getAllTask); // get all tasks
todoRouter.get("/:id", getTask); // get task by id
todoRouter.put("/:id", updateTask); // update task by id
todoRouter.delete("/:id", deleteTask); // delete task by id

module.exports = todoRouter;