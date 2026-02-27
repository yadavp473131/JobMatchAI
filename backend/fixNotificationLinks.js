const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobmatchai');

const Notification = require('./models/Notification');

async function fixNotificationLinks() {
  try {
    console.log('Fixing notification links...');

    // Find all notifications with the old link format
    const notifications = await Notification.find({ 
      link: { $regex: '^/jobs/[^/]+/applicants$' } 
    });

    console.log(`Found ${notifications.length} notifications to update`);

    // Update each notification
    let updated = 0;
    for (const notification of notifications) {
      notification.link = notification.link.replace('/jobs/', '/employer/jobs/');
      await notification.save();
      updated++;
    }

    console.log(`Updated ${updated} notifications`);
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing notification links:', error);
    process.exit(1);
  }
}

fixNotificationLinks();
