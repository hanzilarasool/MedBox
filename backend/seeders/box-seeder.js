// backend/seeders/boxesSeeder.js
const mongoose = require('mongoose');
const Box = require('../models/box-model');

const seedBoxes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/medicinebox');

    // Clear existing data
    await Box.deleteMany();
    console.log('🧹 Previous boxes data removed');

    // Sample data
    const boxesData = [
      {
        name: 'MedBox-1',
        description: 'Morning Medications',
        date: new Date('2024-03-25'),
        timeSlot: '08:00 - 09:00 AM',
        medicines: [
          {
            name: 'Blood Pressure Med',
            dosage: '10mg',
            time: 'Morning'
          },
          {
            name: 'Multivitamin',
            dosage: '1 tablet',
            time: 'Morning'
          }
        ]
      },
      {
        name: 'MedBox-2',
        description: 'Midday Medications',
        date: new Date('2024-03-25'),
        timeSlot: '12:00 - 01:00 PM',
        medicines: [
          {
            name: 'Diabetes Medication',
            dosage: '500mg',
            time: 'Midday'
          },
          {
            name: 'Pain Reliever',
            dosage: '200mg',
            time: 'Midday'
          }
        ]
      },
      {
        name: 'MedBox-3',
        description: 'Night Medications',
        date: new Date('2024-03-25'),
        timeSlot: '08:00 - 09:00 PM',
        medicines: [
          {
            name: 'Hair Growth Supplement',
            dosage: '5000mcg',
            time: 'Night'
          },
          {
            name: 'Sleep Aid',
            dosage: '5mg',
            time: 'Night'
          }
        ]
      }
    ];

    // Insert data
    await Box.insertMany(boxesData);
    console.log('🌱 Database seeded successfully!');

  } catch (error) {
    console.error('🚨 Seeding error:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

// Run the seeder
seedBoxes();