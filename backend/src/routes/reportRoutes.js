const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { generate, listSessions } = require('../controllers/reportController');

const router = express.Router();

router.post('/generate-report', authenticate, generate);
router.get('/generate-report', authenticate, generate);
router.get('/sessions', authenticate, listSessions);

module.exports = router;
