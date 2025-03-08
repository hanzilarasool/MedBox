// const express=require('express');
// const router=express.Router();
// const {boxes,addMedicineToBox,deleteMedicineFromBox,updateMedicineInBox}=require('../controllers/box-controller');
// const { authenticate } = require('../middleware/auth');

// router.get('/',authenticate,boxes);
// router.post('/:boxId/medicines',authenticate,addMedicineToBox);
// router.delete('/:boxId/medicines/:medicineId',authenticate,deleteMedicineFromBox);
// router.put('/:boxId/medicines/:medicineId',authenticate ,updateMedicineInBox);

// module.exports=router; 
// routes/boxes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { 
  boxes,
  addMedicineToBox,
  deleteMedicineFromBox,
  updateMedicineInBox
} = require('../controllers/box-controller');

// Add authentication middleware to all box routes
router.get('/', authenticate, boxes);
router.post('/:boxId/medicines', authenticate, addMedicineToBox);
router.delete('/:boxId/medicines/:medicineId', authenticate, deleteMedicineFromBox);
router.put('/:boxId/medicines/:medicineId', authenticate, updateMedicineInBox);

module.exports = router;