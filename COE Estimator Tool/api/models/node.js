const mongoose = require('mongoose');

const nodeSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    node: String,
    noOfNode: String,
    environment: String,
    effortDays: String
});

module.exports = mongoose.model('NodeSchema', nodeSchema, 'NodeEffortEstimator');