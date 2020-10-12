const mongoose = require('mongoose');

const coeEstimatorSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    id: Number,
    effortDays: Number,
    type: String
});

module.exports = mongoose.model('coeEstimator', coeEstimatorSchema, 'coeEstimator');