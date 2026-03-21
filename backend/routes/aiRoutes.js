const express = require('express');
const router = express.Router();
const { aiBreakdown } = require('../controller/aiController');
router.post('/breakdown', aiBreakdown);

module.exports = router;
