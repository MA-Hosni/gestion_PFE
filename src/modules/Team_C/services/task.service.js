import Task from "../models/task.model.js"

async function verifyUserStoryExists(userStoryId) {
  console.log("⚠️ Placeholder: User story existence check not yet implemented.")
  return true
}

export const createTask = async (data) => {
  const { title, user_story_id } = data

  await verifyUserStoryExists(user_story_id)

  const existing = await Task.findOne({ title, user_story_id})
  if (existing) {
    const error = new Error("Task with this title already exists for this user story.")
    error.status = 409
    throw error
  }
  const newTask = await Task.create(data)
  return newTask
}
export const getAllTasks = async () => {
  const tasks = await Task.find()
  if (!tasks.length) {
    const error = new Error("No tasks found")
    error.status = 404
    throw error
  }
  return tasks
}

export const getTaskById = async (id) => {
  const task = await Task.findById(id)
  if (!task) {
    const error = new Error("Task not found")
    error.status = 404
    throw error
  }
  return task
}

export const updateTask = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, data, { new: true })
  if (!task) {
    const error = new Error("Task not found")
    error.status = 404
    throw error
  }
  return task
}

export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  if (!task) {
    const error = new Error("Task not found")
    error.status = 404
    throw error
  }
  return { message: "Task deleted successfully" }
}
