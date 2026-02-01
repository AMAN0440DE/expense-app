const express = require('express');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);  // protect all group routes
router.post('/create', groupController.create);
router.put('/:groupId', groupController.updateGroup);
router.post('/:groupId/members', groupController.addMembers);
router.delete('/:groupId/members', groupController.removeMembers);
router.get('/email/:email', groupController.getGroupByEmail);
router.get('/status/:status', groupController.getGroupByStatus);
router.get('/:groupId/audit-log', groupController.getAuditLog);

module.exports = router;