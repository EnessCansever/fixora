const History = require('../models/History')

async function getHistory(req, res) {
  try {
    const history = await History.find()
      .sort({ createdAt: -1 })
      .select('errorMessage codeSnippet category shortSummary createdAt')

    res.json({
      success: true,
      data: history,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Gecmis kayitlari getirilemedi.',
    })
  }
}

async function getHistoryById(req, res) {
  try {
    const item = await History.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gecmis kaydi bulunamadi.',
      })
    }

    res.json({
      success: true,
      data: item,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Kayit detayi getirilemedi.',
    })
  }
}

async function deleteHistoryById(req, res) {
  try {
    const deletedItem = await History.findByIdAndDelete(req.params.id)

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: 'Silinecek gecmis kaydi bulunamadi.',
      })
    }

    res.json({
      success: true,
      message: 'Gecmis kaydi silindi.',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Gecmis kaydi silinemedi.',
    })
  }
}

async function submitHistoryFeedback(req, res) {
  try {
    const { id } = req.params
    const { feedbackType } = req.body

    if (feedbackType !== 'positive' && feedbackType !== 'negative') {
      return res.status(400).json({
        success: false,
        error: 'feedbackType sadece positive veya negative olabilir.',
      })
    }

    const updateField = feedbackType === 'positive' ? 'positiveFeedbackCount' : 'negativeFeedbackCount'

    const updatedItem = await History.findByIdAndUpdate(
      id,
      { $inc: { [updateField]: 1 } },
      { returnDocument: 'after', runValidators: true },
    ).select('_id positiveFeedbackCount negativeFeedbackCount')

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Gecmis kaydi bulunamadi.',
      })
    }

    return res.json({
      success: true,
      data: {
        id: updatedItem._id,
        positiveFeedbackCount: updatedItem.positiveFeedbackCount,
        negativeFeedbackCount: updatedItem.negativeFeedbackCount,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Geri bildirim guncellenemedi.',
    })
  }
}

module.exports = {
  getHistory,
  getHistoryById,
  deleteHistoryById,
  submitHistoryFeedback,
}
