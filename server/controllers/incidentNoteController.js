const IncidentNote = require("../models/IncidentNote");

exports.addNote = async (req, res) => {
  const note = await IncidentNote.create({
    incidentId: req.body.incidentId,
    content: req.body.content,
    author: req.user.name,
  });

  res.json(note);
};

exports.getNotes = async (req, res) => {
  const notes = await IncidentNote.find({
    incidentId: req.params.incidentId,
  }).sort({ createdAt: -1 });

  res.json(notes);
};
