const mongoose = require('mongoose');

const shortLinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{timestamps: true},
);

const ShortLink = mongoose.model('ShortLink', shortLinkSchema);

module.exports = ShortLink;
