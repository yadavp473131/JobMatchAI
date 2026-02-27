const fc = require('fast-check');
const {
  calculateMatchScore,
  calculateSkillsMatch,
  calculateExperienceMatch,
  calculateLocationMatch,
  calculateSalaryMatch,
  calculateJobTypeMatch,
} = require('../services/matchingService');

/**
 * Property-Based Tests for Job Matching Algorithm
 * **Validates: Requirements 3.7.5**
 */

describe('Job Matching Algorithm - Property-Based Tests', () => {
  /**
   * Property: Match scores are always between 0 and 100
   */
  describe('Property: Match scores are bounded (0-100)', () => {
    test('Overall match score is always between 0 and 100', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary job seeker profile
          fc.record({
            skills: fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
            experience: fc.array(
              fc.record({
                startDate: fc.date(),
                endDate: fc.date(),
                current: fc.boolean(),
              }),
              { minLength: 0, maxLength: 10 }
            ),
            location: fc.string(),
            preferences: fc.record({
              minSalary: fc.integer({ min: 0, max: 500000 }),
              maxSalary: fc.integer({ min: 0, max: 500000 }),
              jobType: fc.constantFrom('full-time', 'part-time', 'contract', 'remote'),
              remoteWork: fc.boolean(),
              willingToRelocate: fc.boolean(),
            }),
          }),
          // Generate arbitrary job
          fc.record({
            requiredSkills: fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
            experienceLevel: fc.constantFrom('entry', 'junior', 'mid', 'senior', 'lead'),
            location: fc.string(),
            jobType: fc.constantFrom('full-time', 'part-time', 'contract', 'remote'),
            salaryMin: fc.integer({ min: 0, max: 500000 }),
            salaryMax: fc.integer({ min: 0, max: 500000 }),
          }),
          (profile, job) => {
            const result = calculateMatchScore(profile, job);

            // Property: Score must be between 0 and 100
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);

            // Property: Score must be a number
            expect(typeof result.score).toBe('number');

            // Property: Score must not be NaN
            expect(result.score).not.toBeNaN();
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Skills match score is always between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
          fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
          (seekerSkills, jobSkills) => {
            const result = calculateSkillsMatch(seekerSkills, jobSkills);

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
            expect(typeof result.score).toBe('number');
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Experience match score is always between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              startDate: fc.date(),
              endDate: fc.date(),
              current: fc.boolean(),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          fc.constantFrom('entry', 'junior', 'mid', 'senior', 'lead', 'executive'),
          (experience, level) => {
            const result = calculateExperienceMatch(experience, level);

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Location match score is always between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.record({
            remoteWork: fc.boolean(),
            willingToRelocate: fc.boolean(),
          }),
          fc.string(),
          fc.boolean(),
          (seekerLocation, preferences, jobLocation, isRemote) => {
            const result = calculateLocationMatch(
              seekerLocation,
              preferences,
              jobLocation,
              isRemote
            );

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Salary match score is always between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 500000 }),
          (seekerMin, seekerMax, jobMin, jobMax) => {
            const result = calculateSalaryMatch(seekerMin, seekerMax, jobMin, jobMax);

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Job type match score is always between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('full-time', 'part-time', 'contract', 'remote'),
          fc.constantFrom('full-time', 'part-time', 'contract', 'remote'),
          (seekerType, jobType) => {
            const result = calculateJobTypeMatch(seekerType, jobType);

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Higher skill overlap results in higher match scores
   */
  describe('Property: Higher skill overlap increases match score', () => {
    test('More matching skills result in higher scores', () => {
      const jobSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'];

      // Test with increasing skill overlap
      const noMatch = calculateSkillsMatch([], jobSkills);
      const oneMatch = calculateSkillsMatch(['JavaScript'], jobSkills);
      const twoMatch = calculateSkillsMatch(['JavaScript', 'React'], jobSkills);
      const threeMatch = calculateSkillsMatch(['JavaScript', 'React', 'Node.js'], jobSkills);
      const fullMatch = calculateSkillsMatch(jobSkills, jobSkills);

      // Property: More matches = higher score
      expect(oneMatch.score).toBeGreaterThan(noMatch.score);
      expect(twoMatch.score).toBeGreaterThan(oneMatch.score);
      expect(threeMatch.score).toBeGreaterThan(twoMatch.score);
      expect(fullMatch.score).toBe(100);
    });

    test('Skill match is case-insensitive', () => {
      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 1, maxLength: 10 }), (skills) => {
          const lowerCaseSkills = skills.map((s) => s.toLowerCase());
          const upperCaseSkills = skills.map((s) => s.toUpperCase());
          const mixedCaseSkills = skills.map((s) => s.charAt(0).toUpperCase() + s.slice(1));

          const result1 = calculateSkillsMatch(lowerCaseSkills, skills);
          const result2 = calculateSkillsMatch(upperCaseSkills, skills);
          const result3 = calculateSkillsMatch(mixedCaseSkills, skills);

          // Property: Case should not affect match score
          expect(result1.score).toBe(result2.score);
          expect(result2.score).toBe(result3.score);
        }),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Match calculation is deterministic
   */
  describe('Property: Match calculation is deterministic', () => {
    test('Same inputs always produce same output', () => {
      fc.assert(
        fc.property(
          fc.record({
            skills: fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
            experience: fc.array(
              fc.record({
                startDate: fc.date(),
                endDate: fc.date(),
                current: fc.boolean(),
              }),
              { minLength: 0, maxLength: 5 }
            ),
            location: fc.string(),
            preferences: fc.record({
              minSalary: fc.integer({ min: 0, max: 200000 }),
              maxSalary: fc.integer({ min: 0, max: 200000 }),
              jobType: fc.constantFrom('full-time', 'part-time', 'contract'),
              remoteWork: fc.boolean(),
              willingToRelocate: fc.boolean(),
            }),
          }),
          fc.record({
            requiredSkills: fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
            experienceLevel: fc.constantFrom('entry', 'junior', 'mid', 'senior'),
            location: fc.string(),
            jobType: fc.constantFrom('full-time', 'part-time', 'contract'),
            salaryMin: fc.integer({ min: 0, max: 200000 }),
            salaryMax: fc.integer({ min: 0, max: 200000 }),
          }),
          (profile, job) => {
            const result1 = calculateMatchScore(profile, job);
            const result2 = calculateMatchScore(profile, job);
            const result3 = calculateMatchScore(profile, job);

            // Property: Multiple calls with same input produce same output
            expect(result1.score).toBe(result2.score);
            expect(result2.score).toBe(result3.score);

            // Property: Breakdown should also be identical
            expect(result1.breakdown).toEqual(result2.breakdown);
            expect(result2.breakdown).toEqual(result3.breakdown);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Perfect match always gives 100 score
   */
  describe('Property: Perfect matches score 100', () => {
    test('Identical skills give 100% match', () => {
      const skills = ['JavaScript', 'React', 'Node.js'];
      const result = calculateSkillsMatch(skills, skills);

      expect(result.score).toBe(100);
      expect(result.matchedSkills.length).toBe(skills.length);
      expect(result.missingSkills.length).toBe(0);
    });

    test('Remote job with remote preference gives 100% location match', () => {
      const result = calculateLocationMatch(
        'New York',
        { remoteWork: true },
        'San Francisco',
        true
      );

      expect(result.score).toBe(100);
    });

    test('Same location gives 100% location match', () => {
      const location = 'San Francisco, CA';
      const result = calculateLocationMatch(location, {}, location, false);

      expect(result.score).toBe(100);
    });
  });

  /**
   * Property: Match score structure is valid
   */
  describe('Property: Match score structure is valid', () => {
    test('Match result has required structure', () => {
      fc.assert(
        fc.property(
          fc.record({
            skills: fc.array(fc.string(), { maxLength: 5 }),
            experience: fc.array(
              fc.record({
                startDate: fc.date(),
                endDate: fc.date(),
                current: fc.boolean(),
              }),
              { maxLength: 3 }
            ),
            location: fc.string(),
            preferences: fc.record({
              minSalary: fc.integer({ min: 0, max: 200000 }),
              maxSalary: fc.integer({ min: 0, max: 200000 }),
              jobType: fc.constantFrom('full-time', 'part-time'),
              remoteWork: fc.boolean(),
              willingToRelocate: fc.boolean(),
            }),
          }),
          fc.record({
            requiredSkills: fc.array(fc.string(), { maxLength: 5 }),
            experienceLevel: fc.constantFrom('entry', 'mid', 'senior'),
            location: fc.string(),
            jobType: fc.constantFrom('full-time', 'part-time'),
            salaryMin: fc.integer({ min: 0, max: 200000 }),
            salaryMax: fc.integer({ min: 0, max: 200000 }),
          }),
          (profile, job) => {
            const result = calculateMatchScore(profile, job);

            // Property: Result has required fields
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('breakdown');
            expect(result).toHaveProperty('reasons');

            // Property: Breakdown has all factors
            expect(result.breakdown).toHaveProperty('skills');
            expect(result.breakdown).toHaveProperty('experience');
            expect(result.breakdown).toHaveProperty('location');
            expect(result.breakdown).toHaveProperty('salary');
            expect(result.breakdown).toHaveProperty('jobType');

            // Property: Reasons is an array
            expect(Array.isArray(result.reasons)).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
