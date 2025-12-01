import * as taskService from "../services/task.service.js";
import CompSupervisor from "../../Authentication/models/compSupervisor.model.js";
import UniSupervisor from "../../Authentication/models/uniSupervisor.model.js";

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

export const getAllTasksForCompSupervisor = async (req, res) => {
  try {
    const { compSupervisorId } = req.params;
    if (!compSupervisorId) {
      return res.status(400).json({ message: "Supervisor ID is required." });
    }

    // Check if the supervisor is a company supervisor
    let supervisor = await CompSupervisor.findById(compSupervisorId);
    let supervisorType = "Company Supervisor";
    if (!supervisor) {
      // If not found, check if the supervisor is a university supervisor
      supervisor = await UniSupervisor.findById(compSupervisorId);
      supervisorType = "University Supervisor";

      if (!supervisor) {
        return res.status(404).json({ message: "Supervisor not found." });
      }
    }

    // Fetch tasks for the supervisor
    const tasks = await taskService.getAllTasksForCompSupvisor(compSupervisorId);
    res.status(200).json({ message: `${supervisorType} tasks retrieved successfully`, tasks });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};


