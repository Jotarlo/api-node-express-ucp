const express = require('express');
const ItemController = require('../controller/itemController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authenticateToken, ItemController.getAll);
router.get('/:id', authenticateToken, ItemController.getById);
router.post('/', authenticateToken, ItemController.create);
router.put('/:id', authenticateToken, ItemController.update);
router.delete('/:id', authenticateToken, ItemController.delete);

module.exports = router;
