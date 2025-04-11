// backend/controllers/box-controller.js
const express = require('express');
const Box = require('../models/box-model');

const boxes = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user.id; // Use X-User-Id if provided, otherwise use logged-in user's ID
    const boxes = await Box.find({ user: userId });
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMedicineToBox = async (req, res) => {
  try {
    const box = await Box.findOneAndUpdate(
      { _id: req.params.boxId, user: req.user.id },
      { $push: { medicines: req.body } },
      { new: true }
    );
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.json(box);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedicineFromBox = async (req, res) => {
  try {
    const box = await Box.findOneAndUpdate(
      { _id: req.params.boxId, user: req.user.id },
      { $pull: { medicines: { _id: req.params.medicineId } } },
      { new: true }
    );
    if (!box) return res.status(404).json({ message: 'Medicine not found' });
    res.json(box);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedicineInBox = async (req, res) => {
  try {
    const box = await Box.findOneAndUpdate(
      { 
        _id: req.params.boxId,
        user: req.user.id,
        "medicines._id": req.params.medicineId
      },
      { $set: { "medicines.$": req.body } },
      { new: true }
    );
    if (!box) return res.status(404).json({ message: 'Medicine not found' });
    res.json(box);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleMedicineStatus = async (req, res) => {
  try {
    const { boxId, medicineId } = req.params;
    const { action } = req.body;
    console.log(boxId, medicineId, action, "are 3 things");

    const box = await Box.findOne({ _id: boxId, user: req.user.id });
    if (!box) return res.status(404).json({ message: 'Box not found' });

    const medicine = box.medicines.find(m => m._id.toString() === medicineId);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    if (action === 'taken') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const existingEntry = box.history.find(entry => {
        const entryDate = new Date(entry.takenAt);
        const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
        return (
          entry.medicineId.toString() === medicineId &&
          entry.action === 'taken' &&
          entryDay.getTime() === startOfDay.getTime()
        );
      });

      if (existingEntry) {
        return res.status(200).json({ message: 'Medicine already marked as taken today', box });
      }

      const historyEntry = {
        medicineId,
        name: medicine.name,
        dosage: medicine.dosage,
        time: medicine.time,
        takenAt: new Date(),
        action
      };
      box.history.push(historyEntry);
    } else if (action === 'untaken') {
      const historyIndex = box.history
        .slice()
        .reverse()
        .findIndex(entry => 
          entry.medicineId.toString() === medicineId && entry.action === 'taken'
        );

      if (historyIndex !== -1) {
        const originalIndex = box.history.length - 1 - historyIndex;
        box.history.splice(originalIndex, 1);
      } else {
        console.log(`No "taken" entry found for medicine ${medicineId} to undo`);
      }
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await box.save();
    res.json(box);
  } catch (error) {
    console.error('Error in toggleMedicineStatus:', error);
    res.status(500).json({ message: error.message });
  }
};

// const getHistory = async (req, res) => {
//   try {
//     const { boxId } = req.params;
//     const { period } = req.query;
//     const userId = req.headers['x-user-id'] || req.user.id;

//     const box = await Box.findOne({ _id: boxId, user: userId });
//     if (!box) return res.status(404).json({ message: "Box not found" });

//     let history = box.history;

//     if (period) {
//       const now = new Date();
//       let startDate;

//       if (period === "day") {
//         startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       } else if (period === "week") {
//         startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       } else if (period === "month") {
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//       } else {
//         return res.status(400).json({ message: 'Invalid period' });
//       }

//       if (startDate) {
//         history = history.filter(entry => new Date(entry.takenAt) >= startDate);
//       }
//     }

//     res.json(history);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// backend/controllers/box-controller.js (relevant excerpt)
const getHistory = async (req, res) => {
  try {
    const { boxId } = req.params;
    const { period } = req.query;
    const userId = req.headers['x-user-id'] || req.user.id;

    const box = await Box.findOne({ _id: boxId, user: userId });
    if (!box) return res.status(404).json({ message: "Box not found" });

    let history = box.history;

    if (period) {
      const now = new Date();
      let startDate;

      if (period === "day") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (period === "week") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        return res.status(400).json({ message: 'Invalid period' });
      }

      if (startDate) {
        history = history.filter(entry => new Date(entry.takenAt) >= startDate);
      }
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  boxes,
  addMedicineToBox,
  deleteMedicineFromBox,
  updateMedicineInBox,
  toggleMedicineStatus,
  getHistory,
};