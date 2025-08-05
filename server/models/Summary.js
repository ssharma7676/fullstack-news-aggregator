// Summary model to cache article summaries keyed by URL
const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  summary: { type: String, required: true },          
}, { timestamps: true });                               

module.exports = mongoose.model('Summary', summarySchema);
