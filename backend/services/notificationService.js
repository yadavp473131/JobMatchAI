const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');

/**
 * Create a notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

/**
 * Create notification and send email
 * @param {Object} notificationData - Notification data
 * @param {Object} emailData - Email data (to, subject, html)
 * @param {Boolean} sendEmailNotification - Whether to send email
 * @returns {Promise<Object>} Created notification
 */
const createNotificationWithEmail = async (
  notificationData,
  emailData,
  sendEmailNotification = true
) => {
  try {
    // Create in-app notification
    const notification = await createNotification(notificationData);

    // Send email notification if enabled
    if (sendEmailNotification && emailData) {
      await sendEmail(emailData.to, emailData.subject, emailData.html);
    }

    return notification;
  } catch (error) {
    console.error('Create notification with email error:', error);
    throw error;
  }
};

/**
 * Notify job seeker about application status change
 * @param {Object} application - Application object
 * @param {String} newStatus - New status
 */
const notifyApplicationStatusChange = async (application, newStatus) => {
  try {
    const jobSeeker = application.jobSeekerId;
    const job = application.jobId;

    const statusMessages = {
      pending: 'Your application is pending review',
      reviewing: 'Your application is being reviewed',
      shortlisted: 'Congratulations! You have been shortlisted',
      rejected: 'Your application was not selected',
      hired: 'Congratulations! You have been hired',
    };

    const notificationData = {
      userId: jobSeeker._id || jobSeeker,
      type: 'application_status',
      title: `Application Status Update: ${job.title}`,
      message: statusMessages[newStatus] || `Your application status has been updated to ${newStatus}`,
      link: `/applications/${application._id}`,
      metadata: {
        applicationId: application._id,
        jobId: job._id || job,
        status: newStatus,
      },
    };

    const emailData = {
      to: jobSeeker.userId?.email || jobSeeker.email,
      subject: `Application Status Update - ${job.title}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Hello,</p>
        <p>Your application for <strong>${job.title}</strong> has been updated.</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p>${statusMessages[newStatus]}</p>
        <p>View your application details in your dashboard.</p>
        <br>
        <p>Best regards,<br>JobMatchAI Team</p>
      `,
    };

    await createNotificationWithEmail(notificationData, emailData);
  } catch (error) {
    console.error('Notify application status change error:', error);
  }
};

/**
 * Notify employer about new applicant
 * @param {Object} application - Application object
 * @param {Object} employer - Employer object
 */
const notifyNewApplicant = async (application, employer) => {
  try {
    const jobSeeker = application.jobSeekerId;
    const job = application.jobId;

    const notificationData = {
      userId: employer._id,
      type: 'new_applicant',
      title: `New Application: ${job.title}`,
      message: `${jobSeeker.firstName} ${jobSeeker.lastName} has applied for ${job.title}`,
      link: `/employer/jobs/${job._id}/applicants`,
      metadata: {
        applicationId: application._id,
        jobId: job._id,
        jobSeekerId: jobSeeker._id,
        matchScore: application.matchScore,
      },
    };

    const emailData = {
      to: employer.userId?.email || employer.email,
      subject: `New Application - ${job.title}`,
      html: `
        <h2>New Job Application</h2>
        <p>Hello,</p>
        <p>You have received a new application for <strong>${job.title}</strong>.</p>
        <p><strong>Applicant:</strong> ${jobSeeker.firstName} ${jobSeeker.lastName}</p>
        ${application.matchScore ? `<p><strong>Match Score:</strong> ${application.matchScore}%</p>` : ''}
        <p>Review the application in your employer dashboard.</p>
        <br>
        <p>Best regards,<br>JobMatchAI Team</p>
      `,
    };

    await createNotificationWithEmail(notificationData, emailData);
  } catch (error) {
    console.error('Notify new applicant error:', error);
  }
};

/**
 * Notify job seeker about new job matches
 * @param {Object} jobSeeker - Job seeker object
 * @param {Array} matchedJobs - Array of matched jobs
 */
const notifyNewJobMatches = async (jobSeeker, matchedJobs) => {
  try {
    if (!matchedJobs || matchedJobs.length === 0) return;

    const topMatches = matchedJobs.slice(0, 3);
    const jobTitles = topMatches.map((j) => j.job.title).join(', ');

    const notificationData = {
      userId: jobSeeker._id,
      type: 'new_match',
      title: `${matchedJobs.length} New Job Matches Found`,
      message: `We found ${matchedJobs.length} jobs that match your profile: ${jobTitles}${matchedJobs.length > 3 ? '...' : ''}`,
      link: '/recommendations',
      metadata: {
        matchCount: matchedJobs.length,
        topMatches: topMatches.map((m) => ({
          jobId: m.job._id,
          title: m.job.title,
          matchScore: m.matchScore,
        })),
      },
    };

    const emailData = {
      to: jobSeeker.userId?.email || jobSeeker.email,
      subject: `${matchedJobs.length} New Job Matches for You`,
      html: `
        <h2>New Job Matches</h2>
        <p>Hello ${jobSeeker.firstName},</p>
        <p>We found <strong>${matchedJobs.length} new jobs</strong> that match your profile!</p>
        <h3>Top Matches:</h3>
        <ul>
          ${topMatches
            .map(
              (match) => `
            <li>
              <strong>${match.job.title}</strong> at ${match.job.employerId?.companyName || 'Company'}
              <br>Match Score: ${match.matchScore}%
              <br>Location: ${match.job.location}
            </li>
          `
            )
            .join('')}
        </ul>
        ${matchedJobs.length > 3 ? `<p>...and ${matchedJobs.length - 3} more!</p>` : ''}
        <p>View all recommendations in your dashboard.</p>
        <br>
        <p>Best regards,<br>JobMatchAI Team</p>
      `,
    };

    await createNotificationWithEmail(notificationData, emailData);
  } catch (error) {
    console.error('Notify new job matches error:', error);
  }
};

/**
 * Send system notification
 * @param {String} userId - User ID
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {String} link - Optional link
 */
const sendSystemNotification = async (userId, title, message, link = null) => {
  try {
    const notificationData = {
      userId,
      type: 'system',
      title,
      message,
      link,
    };

    await createNotification(notificationData);
  } catch (error) {
    console.error('Send system notification error:', error);
  }
};

module.exports = {
  createNotification,
  createNotificationWithEmail,
  notifyApplicationStatusChange,
  notifyNewApplicant,
  notifyNewJobMatches,
  sendSystemNotification,
};
