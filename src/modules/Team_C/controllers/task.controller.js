import * as taskService from "../services/task.service.js"

export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body)
    res.status(201).json(task)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks()
    res.status(200).json(tasks)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id)
    res.status(200).json(task)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body)
    res.status(200).json(task)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}
