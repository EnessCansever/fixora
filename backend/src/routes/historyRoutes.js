const express = require('express')
const {
	getHistory,
	getHistoryById,
	deleteHistoryById,
	submitHistoryFeedback,
} = require('../controllers/historyController')

const router = express.Router()

router.get('/history', getHistory)
router.get('/history/:id', getHistoryById)
router.delete('/history/:id', deleteHistoryById)
router.post('/history/:id/feedback', submitHistoryFeedback)

module.exports = router
