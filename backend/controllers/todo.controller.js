let mongoose = require("mongoose");
const Task = mongoose.model("Task");

const addTask = async (req, res) => {
  let { uid, title, desc } = req.body;
  if (!title || !desc || !uid) {
    return res.status(500).send({
      message: "please enter all the required fields !!",
    });
  }
  let newTask = { uid, title, desc };

  let task = new Task(newTask);
  let taskData = await task.save();

  if (taskData) {
    return res.status(200).send({
      message: "task created successfully !!",
      data: taskData,
    });
  } else {
    return res.status(500).send({
      message: "Error while adding a task !!",
    });
  }
};

const getAllTask = async (req, res) => {
  console.log("user data from req", req.user);
  let { id } = req.user;
  console.log("user id from req", id);

  let taskData = await Task.find({ uid: id }).populate("uid", "name mail");

  if (taskData.length) {
    return res.status(200).send({
      message: "Tasks found successfully !!",
      data: taskData,
    });
  } else {
    return res.status(404).send({
      message: "Tasks not found !!",
    });
  }
};

const getTask = async (req, res) => {
  let id = req.params.id;

  let taskData = await Task.findOne({ _id: id }).populate("uid", "name mail");
  if (taskData) {
    return res.status(200).send({
      message: "Task found successfully !!",
      data: taskData,
    });
  } else {
    return res.status(404).send({
      message: "Task not found !!",
    });
  }
};

const updateTask = async (req, res) => {
  let id = req.params.id;
  let { title, desc } = req.body;

  if (!title || !desc) {
    return res.status(500).send({
      message: "please enter all the required fields !!",
    });
  }

  let updatedTask = { title, desc };

  let taskData = await Task.findOneAndUpdate(
    { _id: id },
    { $set: updatedTask },
    { new: true }
  );
  if (taskData) {
    return res.status(200).send({
      message: "task updated successfully !!",
      data: taskData,
    });
  } else {
    return res.status(500).send({
      message: "Error while updating a task !!",
    });
  }
};

const deleteTask = async (req, res) => {
  let id = req.params.id;

  let taskData = await Task.findOneAndDelete({ _id: id });
  if (taskData) {
    return res.status(200).send({
      message: "task deleted successfully !!",
      data: taskData,
    });
  } else {
    return res.status(500).send({
      message: "Error while deleting a task !!",
    });
  }
};

module.exports = {
  addTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
};
