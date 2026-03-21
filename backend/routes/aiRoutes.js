const express = require('express');
const router = express.Router();
const { aiBreakdown } = require('../controller/aiController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);
router.post('/breakdown', aiBreakdown);

module.exports = router;
