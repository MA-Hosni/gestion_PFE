import * as taskService from "../services/task.service.js";

export const createTask = async (req, res) => {
  try {
    const { title, user_story_id, status } = req.body;

    if (!title || !user_story_id || !status) {
      return res.status(400).json({ message: "Title, user_story_id, and status are required." });
    }

    const task = await taskService.createTask(req.body);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json({ message: "Tasks retrieved successfully", tasks });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    const task = await taskService.getTaskById(id);
    res.status(200).json({ message: "Task retrieved successfully", task });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    const task = await taskService.updateTask(id, req.body);
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    const result = await taskService.deleteTask(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};


