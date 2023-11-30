const { Schema, model} = require('mongoose');

const LinkSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true },
  to: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
},
{timestamps: true},
);

const Link = model('Link', LinkSchema);

module.exports = Link;
