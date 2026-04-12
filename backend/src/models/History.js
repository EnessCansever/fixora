const mongoose = require('mongoose')

const historySchema = new mongoose.Schema(
  {
    errorMessage: {
      type: String,
      required: true,
      trim: true,
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    shortSummary: {
      type: String,
      required: true,
    },
    turkishExplanation: {
      type: String,
      default: '',
    },
    possibleCauses: {
      type: [String],
      default: [],
    },
    solutionSteps: {
      type: [String],
      default: [],
    },
    exampleFixCode: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    positiveFeedbackCount: {
      type: Number,
      default: 0,
    },
    negativeFeedbackCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('History', historySchema)
