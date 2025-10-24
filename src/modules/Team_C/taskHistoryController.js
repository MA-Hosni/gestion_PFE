const TaskHistory = require("../models/TaskHistory");

exports.createTaskHistory = async (req, res) => {
  try {
    const record = await TaskHistory.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de l'historique.", error: err.message });
  }
};

exports.getHistoryByTask = async (req, res) => {
  try {
    const history = await TaskHistory.find({ task_id: req.params.task_id });
    if (!history.length)
      return res.status(404).json({ message: "Aucun historique trouvé pour cette tâche." });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteHistoryRecord = async (req, res) => {
  try {
    const deleted = await TaskHistory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Enregistrement introuvable." });
    res.status(200).json({ message: "Historique supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};
