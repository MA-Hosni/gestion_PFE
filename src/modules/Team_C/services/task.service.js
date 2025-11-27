import Task from "../models/task.model.js"
import UserStory from "../../Team_B/models/UserStory.model.js"

async function verifyUserStoryExists(userStoryId) {
  const userStory = await UserStory.findById(userStoryId);
  if (!userStory) {
    const error = new Error("User story not found.");
    error.status = 404;
    throw error;
  }
  return true;
}

export const createTask = async (data) => {
  const { title, user_story_id } = data;

  if (!title || !user_story_id) {
    const error = new Error("Title and user_story_id are required.");
    error.status = 400;
    throw error;
  }

  await verifyUserStoryExists(user_story_id);

  const existing = await Task.findOne({ title, user_story_id})
  if (existing) {
    const error = new Error("Task with this title already exists for this user story.");
    error.status = 409;
    throw error;
  }
  const newTask = await Task.create(data)
  return newTask
}
export const getAllTasks = async () => {
  const tasks = await Task.find();
  if (!tasks.length) {
    const error = new Error("No tasks found.");
    error.status = 404;
    throw error;
  }
  return { message: "Tasks retrieved successfully", tasks };
};

export const getTaskById = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    throw error;
  }
  return { message: "Task retrieved successfully", task };
};

export const updateTask = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, data, { new: true });
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    throw error;
  }
  return { message: "Task updated successfully", task };
};

export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    throw error;
  }
  return { message: "Task deleted successfully", task };
};
