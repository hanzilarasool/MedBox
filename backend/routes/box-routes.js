
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { 
  boxes,
  addMedicineToBox,
  deleteMedicineFromBox,
  updateMedicineInBox,
  toggleMedicineStatus,
  getHistory
} = require('../controllers/box-controller');

router.get('/', authenticate, boxes);
router.post('/:boxId/medicines', authenticate, addMedicineToBox);
router.delete('/:boxId/medicines/:medicineId', authenticate, deleteMedicineFromBox);
router.put('/:boxId/medicines/:medicineId', authenticate, updateMedicineInBox);
router.post('/:boxId/medicines/:medicineId/toggle', authenticate, toggleMedicineStatus);
router.get('/:boxId/history', authenticate, getHistory);

module.exports = router;