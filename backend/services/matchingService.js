/**
 * Job Matching Algorithm Service
 * Calculates match scores between job seekers and jobs
 */

// Scoring weights (total = 100%)
const WEIGHTS = {
  skills: 0.35, // 35% - Most important factor
  experience: 0.25, // 25% - Years and level of experience
  location: 0.15, // 15% - Location preference and remote options
  salary: 0.15, // 15% - Salary expectations vs offered
  jobType: 0.10, // 10% - Full-time, part-time, contract, etc.
};

/**
 * Calculate skills match score
 * @param {Array} jobSeekerSkills - Job seeker's skills
 * @param {Array} jobRequiredSkills - Job's required skills
 * @returns {Object} Score and details
 */
const calculateSkillsMatch = (jobSeekerSkills, jobRequiredSkills) => {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) {
    return { score: 50, matchedSkills: [], missingSkills: [] };
  }

  if (!jobSeekerSkills || jobSeekerSkills.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: jobRequiredSkills };
  }

  // Normalize skills to lowercase for comparison
  const normalizedJobSeekerSkills = jobSeekerSkills.map((s) => s.toLowerCase().trim());
  const normalizedJobSkills = jobRequiredSkills.map((s) => s.toLowerCase().trim());

  // Find matched and missing skills
  const matchedSkills = [];
  const missingSkills = [];

  normalizedJobSkills.forEach((jobSkill) => {
    if (normalizedJobSeekerSkills.includes(jobSkill)) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  // Calculate percentage match
  const matchPercentage = (matchedSkills.length / normalizedJobSkills.length) * 100;

  return {
    score: Math.round(matchPercentage),
    matchedSkills,
    missingSkills,
  };
};

/**
 * Calculate experience match score
 * @param {Array} jobSeekerExperience - Job seeker's experience array
 * @param {String} jobExperienceLevel - Job's required experience level
 * @returns {Object} Score and details
 */
const calculateExperienceMatch = (jobSeekerExperience, jobExperienceLevel) => {
  if (!jobExperienceLevel) {
    return { score: 50, reason: 'No experience requirement specified' };
  }

  // Calculate total years of experience
  let totalYears = 0;
  if (jobSeekerExperience && jobSeekerExperience.length > 0) {
    jobSeekerExperience.forEach((exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.current ? new Date() : new Date(exp.endDate);
      const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
      totalYears += years;
    });
  }

  // Map experience levels to years
  const experienceLevels = {
    entry: { min: 0, max: 2 },
    junior: { min: 1, max: 3 },
    mid: { min: 3, max: 5 },
    senior: { min: 5, max: 10 },
    lead: { min: 8, max: 15 },
    executive: { min: 10, max: 100 },
  };

  const level = experienceLevels[jobExperienceLevel.toLowerCase()] || { min: 0, max: 100 };

  let score = 0;
  let reason = '';

  if (totalYears >= level.min && totalYears <= level.max) {
    score = 100;
    reason = `Perfect match: ${Math.round(totalYears)} years experience for ${jobExperienceLevel} level`;
  } else if (totalYears < level.min) {
    const deficit = level.min - totalYears;
    score = Math.max(0, 100 - deficit * 20);
    reason = `${Math.round(deficit)} years below required experience`;
  } else {
    // Overqualified
    const excess = totalYears - level.max;
    score = Math.max(70, 100 - excess * 5);
    reason = `Overqualified with ${Math.round(totalYears)} years experience`;
  }

  return {
    score: Math.round(score),
    totalYears: Math.round(totalYears * 10) / 10,
    reason,
  };
};

/**
 * Calculate location match score
 * @param {String} jobSeekerLocation - Job seeker's location
 * @param {Object} jobSeekerPreferences - Job seeker's preferences
 * @param {String} jobLocation - Job's location
 * @param {Boolean} jobIsRemote - Whether job is remote
 * @returns {Object} Score and details
 */
const calculateLocationMatch = (
  jobSeekerLocation,
  jobSeekerPreferences,
  jobLocation,
  jobIsRemote
) => {
  // Remote jobs are always a good match if seeker is open to remote
  if (jobIsRemote) {
    const isOpenToRemote = jobSeekerPreferences?.remoteWork !== false;
    return {
      score: isOpenToRemote ? 100 : 50,
      reason: isOpenToRemote ? 'Remote position matches preference' : 'Remote position',
    };
  }

  // If no location data, give neutral score
  if (!jobSeekerLocation || !jobLocation) {
    return { score: 50, reason: 'Location data not available' };
  }

  // Helper function to format location object to string
  const formatLocation = (loc) => {
    if (typeof loc === 'string') return loc.toLowerCase().trim();
    if (typeof loc === 'object' && loc !== null) {
      const parts = [];
      if (loc.city) parts.push(loc.city);
      if (loc.state) parts.push(loc.state);
      if (loc.country) parts.push(loc.country);
      return parts.join(', ').toLowerCase().trim();
    }
    return '';
  };

  // Normalize locations for comparison
  const normalizedSeekerLocation = formatLocation(jobSeekerLocation);
  const normalizedJobLocation = formatLocation(jobLocation);

  // If either location is empty after formatting, return neutral score
  if (!normalizedSeekerLocation || !normalizedJobLocation) {
    return { score: 50, reason: 'Location data not available' };
  }

  // Check for exact match
  if (normalizedSeekerLocation === normalizedJobLocation) {
    return { score: 100, reason: 'Same location' };
  }

  // Check for city/state match (partial match)
  const seekerParts = normalizedSeekerLocation.split(',').map((s) => s.trim());
  const jobParts = normalizedJobLocation.split(',').map((s) => s.trim());

  const hasCommonPart = seekerParts.some((part) => jobParts.includes(part));

  if (hasCommonPart) {
    return { score: 75, reason: 'Same region' };
  }

  // Check if seeker is willing to relocate
  const willingToRelocate = jobSeekerPreferences?.willingToRelocate === true;

  return {
    score: willingToRelocate ? 40 : 20,
    reason: willingToRelocate ? 'Different location, willing to relocate' : 'Different location',
  };
};

/**
 * Calculate salary match score
 * @param {Number} jobSeekerMinSalary - Job seeker's minimum salary expectation
 * @param {Number} jobSeekerMaxSalary - Job seeker's maximum salary expectation
 * @param {Number} jobMinSalary - Job's minimum salary
 * @param {Number} jobMaxSalary - Job's maximum salary
 * @returns {Object} Score and details
 */
const calculateSalaryMatch = (
  jobSeekerMinSalary,
  jobSeekerMaxSalary,
  jobMinSalary,
  jobMaxSalary
) => {
  // If no salary data, give neutral score
  if (!jobSeekerMinSalary || !jobMinSalary) {
    return { score: 50, reason: 'Salary information not available' };
  }

  // Check for overlap in salary ranges
  const seekerMin = jobSeekerMinSalary || 0;
  const seekerMax = jobSeekerMaxSalary || jobSeekerMinSalary * 1.5;
  const jobMin = jobMinSalary || 0;
  const jobMax = jobMaxSalary || jobMinSalary * 1.5;

  // Perfect match: ranges overlap significantly
  if (jobMax >= seekerMin && jobMin <= seekerMax) {
    const overlapMin = Math.max(seekerMin, jobMin);
    const overlapMax = Math.min(seekerMax, jobMax);
    const overlapSize = overlapMax - overlapMin;
    const seekerRangeSize = seekerMax - seekerMin;

    const overlapPercentage = (overlapSize / seekerRangeSize) * 100;

    if (overlapPercentage >= 50) {
      return { score: 100, reason: 'Salary range matches expectations' };
    } else {
      return { score: 70, reason: 'Partial salary range overlap' };
    }
  }

  // Job offers less than expected
  if (jobMax < seekerMin) {
    const deficit = ((seekerMin - jobMax) / seekerMin) * 100;
    const score = Math.max(0, 100 - deficit);
    return { score: Math.round(score), reason: 'Salary below expectations' };
  }

  // Job offers more than expected (good for employer, neutral for seeker)
  return { score: 80, reason: 'Salary above expectations' };
};

/**
 * Calculate job type match score
 * @param {String} jobSeekerPreferredType - Job seeker's preferred job type
 * @param {String} jobType - Job's type
 * @returns {Object} Score and details
 */
const calculateJobTypeMatch = (jobSeekerPreferredType, jobType) => {
  if (!jobSeekerPreferredType || !jobType) {
    return { score: 50, reason: 'Job type preference not specified' };
  }

  const normalizedSeekerType = jobSeekerPreferredType.toLowerCase().trim();
  const normalizedJobType = jobType.toLowerCase().trim();

  if (normalizedSeekerType === normalizedJobType) {
    return { score: 100, reason: `Matches ${jobType} preference` };
  }

  // Partial matches
  if (
    (normalizedSeekerType === 'full-time' && normalizedJobType === 'contract') ||
    (normalizedSeekerType === 'contract' && normalizedJobType === 'full-time')
  ) {
    return { score: 60, reason: 'Different but compatible job type' };
  }

  return { score: 30, reason: 'Different job type' };
};

/**
 * Calculate overall match score
 * @param {Object} jobSeekerProfile - Job seeker's profile
 * @param {Object} job - Job posting
 * @returns {Object} Match score and breakdown
 */
const calculateMatchScore = (jobSeekerProfile, job) => {
  // Calculate individual scores
  const skillsMatch = calculateSkillsMatch(jobSeekerProfile.skills, job.requiredSkills);
  const experienceMatch = calculateExperienceMatch(
    jobSeekerProfile.experience,
    job.experienceLevel
  );
  const locationMatch = calculateLocationMatch(
    jobSeekerProfile.location,
    jobSeekerProfile.preferences,
    job.location,
    job.jobType === 'remote'
  );
  const salaryMatch = calculateSalaryMatch(
    jobSeekerProfile.preferences?.minSalary,
    jobSeekerProfile.preferences?.maxSalary,
    job.salaryMin,
    job.salaryMax
  );
  const jobTypeMatch = calculateJobTypeMatch(
    jobSeekerProfile.preferences?.jobType,
    job.jobType
  );

  // Calculate weighted total score
  const totalScore =
    skillsMatch.score * WEIGHTS.skills +
    experienceMatch.score * WEIGHTS.experience +
    locationMatch.score * WEIGHTS.location +
    salaryMatch.score * WEIGHTS.salary +
    jobTypeMatch.score * WEIGHTS.jobType;

  // Generate match reasons (top factors)
  const reasons = [];
  if (skillsMatch.score >= 70) {
    reasons.push(`${skillsMatch.matchedSkills.length}/${job.requiredSkills.length} skills match`);
  }
  if (experienceMatch.score >= 70) {
    reasons.push(experienceMatch.reason);
  }
  if (locationMatch.score >= 70) {
    reasons.push(locationMatch.reason);
  }
  if (salaryMatch.score >= 70) {
    reasons.push(salaryMatch.reason);
  }

  return {
    score: Math.round(totalScore),
    breakdown: {
      skills: {
        score: skillsMatch.score,
        weight: WEIGHTS.skills,
        matched: skillsMatch.matchedSkills,
        missing: skillsMatch.missingSkills,
      },
      experience: {
        score: experienceMatch.score,
        weight: WEIGHTS.experience,
        totalYears: experienceMatch.totalYears,
        reason: experienceMatch.reason,
      },
      location: {
        score: locationMatch.score,
        weight: WEIGHTS.location,
        reason: locationMatch.reason,
      },
      salary: {
        score: salaryMatch.score,
        weight: WEIGHTS.salary,
        reason: salaryMatch.reason,
      },
      jobType: {
        score: jobTypeMatch.score,
        weight: WEIGHTS.jobType,
        reason: jobTypeMatch.reason,
      },
    },
    reasons: reasons.slice(0, 3), // Top 3 reasons
  };
};

module.exports = {
  calculateMatchScore,
  calculateSkillsMatch,
  calculateExperienceMatch,
  calculateLocationMatch,
  calculateSalaryMatch,
  calculateJobTypeMatch,
  WEIGHTS,
};
