const Task = require("../models/Task");
const UserStory = require("../models/UserStory");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, user_story_id, assigned_to } = req.body;

    if (!user_story_id)
      return res.status(400).json({ message: "Aucune user story assignée à la tâche." });

    const existing = await Task.findOne({ title, user_story_id });
    if (existing)
      return res.status(409).json({ message: "Le nom de la tâche existe déjà pour cette user story." });

    const userStory = await UserStory.findById(user_story_id);
    if (!userStory)
      return res.status(403).json({ message: "L'utilisateur n'a pas accès à cette user story." });

    const newTask = await Task.create({ title, description, status, priority, user_story_id, assigned_to });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user_story_id").populate("assigned_to");
    if (!tasks.length)
      return res.status(404).json({ message: "Aucune tâche trouvée." });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches." });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "Tâche introuvable." });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask)
      return res.status(404).json({ message: "Tâche introuvable." });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche." });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Tâche introuvable." });
    res.status(200).json({ message: "Tâche supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche." });
  }
};
