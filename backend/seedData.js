require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const JobSeekerProfile = require('./models/JobSeekerProfile');
const EmployerProfile = require('./models/EmployerProfile');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await JobSeekerProfile.deleteMany({});
    await EmployerProfile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await SavedJob.deleteMany({});

    // Create Admin
    console.log('Creating admin user...');
    const admin = await User.create({
      email: 'admin@jobmatchai.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });

    // Create Job Seekers
    console.log('Creating job seekers...');
    
    const jobSeeker1 = await User.create({
      email: 'john.doe@email.com',
      password: 'password123',
      role: 'jobseeker',
      isVerified: true,
    });

    const jobSeeker2 = await User.create({
      email: 'sarah.smith@email.com',
      password: 'password123',
      role: 'jobseeker',
      isVerified: true,
    });

    const jobSeeker3 = await User.create({
      email: 'mike.johnson@email.com',
      password: 'password123',
      role: 'jobseeker',
      isVerified: true,
    });

    const jobSeeker4 = await User.create({
      email: 'emily.davis@email.com',
      password: 'password123',
      role: 'jobseeker',
      isVerified: true,
    });

    const jobSeeker5 = await User.create({
      email: 'david.wilson@email.com',
      password: 'password123',
      role: 'jobseeker',
      isVerified: true,
    });

    // Create Job Seeker Profiles
    console.log('Creating job seeker profiles...');
    const profile1 = await JobSeekerProfile.create({
      userId: jobSeeker1._id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-0101',
      location: { city: 'San Francisco', state: 'CA', country: 'USA' },
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS'],
      experience: [
        {
          title: 'Senior Full Stack Developer',
          company: 'Tech Solutions Inc',
          location: 'San Francisco, CA',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          current: false,
          description: 'Led development of enterprise web applications using MERN stack',
        },
        {
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          location: 'San Francisco, CA',
          startDate: new Date('2018-06-01'),
          endDate: new Date('2019-12-31'),
          current: false,
          description: 'Developed and maintained multiple client projects',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'Stanford University',
          location: 'Stanford, CA',
          startDate: new Date('2014-09-01'),
          endDate: new Date('2018-05-31'),
          current: false,
        },
      ],
      preferences: {
        jobTypes: ['full-time', 'remote'],
        desiredSalary: { min: 110000, max: 140000, currency: 'USD' },
      },
    });

    const profile2 = await JobSeekerProfile.create({
      userId: jobSeeker2._id,
      firstName: 'Sarah',
      lastName: 'Smith',
      phone: '+1-555-0102',
      location: { city: 'New York', state: 'NY', country: 'USA' },
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes', 'Machine Learning'],
      experience: [
        {
          title: 'Backend Developer',
          company: 'DataCorp',
          location: 'New York, NY',
          startDate: new Date('2019-03-01'),
          current: true,
          description: 'Building scalable backend systems and APIs',
        },
      ],
      education: [
        {
          degree: 'Master of Science in Computer Science',
          institution: 'MIT',
          location: 'Cambridge, MA',
          startDate: new Date('2017-09-01'),
          endDate: new Date('2019-05-31'),
          current: false,
        },
      ],
      preferences: {
        jobTypes: ['full-time'],
        desiredSalary: { min: 120000, max: 150000, currency: 'USD' },
      },
    });

    const profile3 = await JobSeekerProfile.create({
      userId: jobSeeker3._id,
      firstName: 'Mike',
      lastName: 'Johnson',
      phone: '+1-555-0103',
      location: { city: 'Austin', state: 'TX', country: 'USA' },
      skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Redis', 'Kafka'],
      experience: [
        {
          title: 'Software Engineer',
          company: 'Enterprise Solutions',
          location: 'Austin, TX',
          startDate: new Date('2021-01-01'),
          current: true,
          description: 'Developing enterprise-grade applications',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Engineering',
          institution: 'University of Texas',
          location: 'Austin, TX',
          startDate: new Date('2016-09-01'),
          endDate: new Date('2020-05-31'),
          current: false,
        },
      ],
      preferences: {
        jobTypes: ['full-time', 'contract'],
        desiredSalary: { min: 100000, max: 130000, currency: 'USD' },
      },
    });

    const profile4 = await JobSeekerProfile.create({
      userId: jobSeeker4._id,
      firstName: 'Emily',
      lastName: 'Davis',
      phone: '+1-555-0104',
      location: { city: 'Seattle', state: 'WA', country: 'USA' },
      skills: ['React', 'Vue.js', 'CSS', 'HTML', 'JavaScript', 'UI/UX Design', 'Figma'],
      experience: [
        {
          title: 'Frontend Developer',
          company: 'Design Studio',
          location: 'Seattle, WA',
          startDate: new Date('2020-06-01'),
          current: true,
          description: 'Creating beautiful and responsive user interfaces',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Arts in Design',
          institution: 'University of Washington',
          location: 'Seattle, WA',
          startDate: new Date('2016-09-01'),
          endDate: new Date('2020-05-31'),
          current: false,
        },
      ],
      preferences: {
        jobTypes: ['full-time', 'remote'],
        desiredSalary: { min: 85000, max: 110000, currency: 'USD' },
      },
    });

    const profile5 = await JobSeekerProfile.create({
      userId: jobSeeker5._id,
      firstName: 'David',
      lastName: 'Wilson',
      phone: '+1-555-0105',
      location: { city: 'Boston', state: 'MA', country: 'USA' },
      skills: ['DevOps', 'AWS', 'Terraform', 'Jenkins', 'Docker', 'Kubernetes', 'Linux'],
      experience: [
        {
          title: 'DevOps Engineer',
          company: 'Cloud Services Inc',
          location: 'Boston, MA',
          startDate: new Date('2019-08-01'),
          current: true,
          description: 'Managing cloud infrastructure and CI/CD pipelines',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Information Technology',
          institution: 'Boston University',
          location: 'Boston, MA',
          startDate: new Date('2015-09-01'),
          endDate: new Date('2019-05-31'),
          current: false,
        },
      ],
      preferences: {
        jobTypes: ['full-time'],
        desiredSalary: { min: 115000, max: 145000, currency: 'USD' },
      },
    });

    // Create Employers
    console.log('Creating employers...');
    
    const employer1 = await User.create({
      email: 'hr@techcorp.com',
      password: 'employer123',
      role: 'employer',
      isVerified: true,
    });

    const employer2 = await User.create({
      email: 'hiring@innovateai.com',
      password: 'employer123',
      role: 'employer',
      isVerified: true,
    });

    const employer3 = await User.create({
      email: 'jobs@startupventures.com',
      password: 'employer123',
      role: 'employer',
      isVerified: true,
    });

    // Create Employer Profiles
    console.log('Creating employer profiles...');
    const empProfile1 = await EmployerProfile.create({
      userId: employer1._id,
      companyName: 'TechCorp Solutions',
      companyDescription: 'Leading technology solutions provider specializing in enterprise software development and cloud services.',
      industry: 'Technology',
      companySize: '201-500',
      website: 'https://www.techcorp.com',
      location: {
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
      },
      contactPerson: {
        name: 'Jennifer Smith',
        position: 'HR Manager',
        phone: '+1-555-1001',
        email: 'hr@techcorp.com',
      },
    });

    const empProfile2 = await EmployerProfile.create({
      userId: employer2._id,
      companyName: 'InnovateAI',
      companyDescription: 'Cutting-edge AI and machine learning company building the future of intelligent systems.',
      industry: 'Artificial Intelligence',
      companySize: '51-200',
      website: 'https://www.innovateai.com',
      location: {
        address: '456 Innovation Ave',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
      },
      contactPerson: {
        name: 'Michael Chen',
        position: 'Talent Acquisition Lead',
        phone: '+1-555-1002',
        email: 'hiring@innovateai.com',
      },
    });

    const empProfile3 = await EmployerProfile.create({
      userId: employer3._id,
      companyName: 'Startup Ventures',
      companyDescription: 'Fast-growing startup building innovative products that change how people work and collaborate.',
      industry: 'Software',
      companySize: '11-50',
      website: 'https://www.startupventures.com',
      location: {
        address: '789 Startup Lane',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        zipCode: '78701',
      },
      contactPerson: {
        name: 'Alex Rodriguez',
        position: 'Co-Founder & CEO',
        phone: '+1-555-1003',
        email: 'jobs@startupventures.com',
      },
    });

    // Create Jobs
    console.log('Creating jobs...');
    const job1 = await Job.create({
      employerId: employer1._id,
      title: 'Senior Full Stack Developer',
      description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will work on cutting-edge projects using modern technologies and collaborate with talented engineers to build scalable web applications.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of experience with JavaScript, React, and Node.js',
        'Strong experience with MongoDB and Express',
        'Excellent problem-solving and communication skills',
      ],
      responsibilities: [
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and technical discussions',
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS'],
      jobType: 'full-time',
      location: { city: 'San Francisco', state: 'CA', country: 'USA', remote: false },
      salary: { min: 120000, max: 160000, currency: 'USD', period: 'yearly' },
      experienceLevel: 'senior',
      benefits: ['Health insurance', '401k matching', 'Unlimited PTO', 'Remote work options', 'Professional development budget'],
      status: 'active',
    });

    const job2 = await Job.create({
      employerId: employer2._id,
      title: 'Machine Learning Engineer',
      description: 'Join our AI team to build next-generation machine learning models and systems. Work on cutting-edge projects in natural language processing, computer vision, and deep learning.',
      requirements: [
        'Master\'s degree in Computer Science, AI, or related field',
        '3+ years of experience with Python, TensorFlow, and PyTorch',
        'Strong mathematical background in statistics and linear algebra',
        'Experience deploying ML models to production',
      ],
      responsibilities: [
        'Develop and deploy machine learning models',
        'Optimize model performance and accuracy',
        'Research new ML techniques and algorithms',
        'Collaborate with data scientists and engineers',
      ],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP'],
      jobType: 'full-time',
      location: { city: 'New York', state: 'NY', country: 'USA', remote: false },
      salary: { min: 140000, max: 180000, currency: 'USD', period: 'yearly' },
      experienceLevel: 'mid',
      benefits: ['Competitive salary', 'Equity', 'Health insurance', 'Flexible hours', 'Learning budget'],
      status: 'active',
    });

    const job3 = await Job.create({
      employerId: employer1._id,
      title: 'Frontend Developer',
      description: 'We need a talented Frontend Developer to create amazing user experiences. Build responsive, accessible web applications with modern frameworks and tools.',
      requirements: [
        '3+ years of experience with React, HTML, CSS, and JavaScript',
        'Strong design sense and attention to detail',
        'Experience with responsive design and cross-browser compatibility',
        'Knowledge of web accessibility standards',
      ],
      responsibilities: [
        'Build responsive web applications',
        'Implement UI/UX designs with pixel-perfect accuracy',
        'Optimize application performance',
        'Work closely with backend team and designers',
      ],
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Redux'],
      jobType: 'full-time',
      location: { city: 'San Francisco', state: 'CA', country: 'USA', remote: false },
      salary: { min: 100000, max: 130000, currency: 'USD', period: 'yearly' },
      experienceLevel: 'mid',
      benefits: ['Health insurance', '401k', 'Flexible schedule', 'Remote work'],
      status: 'active',
    });

    const job4 = await Job.create({
      employerId: employer3._id,
      title: 'Backend Developer',
      description: 'Looking for a Backend Developer to build scalable APIs and services. Join our fast-growing startup and make a real impact on our product.',
      requirements: [
        '2+ years of experience with Node.js and Express',
        'Strong understanding of RESTful APIs and microservices',
        'Experience with MongoDB or PostgreSQL',
        'Knowledge of authentication and security best practices',
      ],
      responsibilities: [
        'Design and implement RESTful APIs',
        'Optimize database queries and performance',
        'Ensure system reliability and scalability',
        'Write clean, maintainable, and well-tested code',
      ],
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Docker'],
      jobType: 'full-time',
      location: { city: 'Austin', state: 'TX', country: 'USA', remote: false },
      salary: { min: 90000, max: 120000, currency: 'USD', period: 'yearly' },
      experienceLevel: 'mid',
      benefits: ['Equity', 'Health insurance', 'Flexible hours', 'Startup culture'],
      status: 'active',
    });

    const job5 = await Job.create({
      employerId: employer2._id,
      title: 'DevOps Engineer',
      description: 'Join our infrastructure team to build and maintain our cloud platform. Work with cutting-edge technologies to ensure reliability, scalability, and security.',
      requirements: [
        '4+ years of DevOps experience',
        'Strong knowledge of AWS, Docker, and Kubernetes',
        'Experience with CI/CD pipelines and infrastructure as code',
        'Understanding of security and compliance requirements',
      ],
      responsibilities: [
        'Manage cloud infrastructure on AWS',
        'Implement and maintain CI/CD pipelines',
        'Monitor system performance and reliability',
        'Ensure security and compliance standards',
      ],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux'],
      jobType: 'remote',
      location: { city: 'Remote', state: '', country: 'USA', remote: true },
      salary: { min: 120000, max: 150000, currency: 'USD', period: 'yearly' },
      experienceLevel: 'senior',
      benefits: ['Remote work', 'Competitive salary', 'Equity', 'Health insurance'],
      status: 'active',
    });

    // Create Applications
    console.log('Creating applications...');
    await Application.create({
      jobId: job1._id,
      jobSeekerId: jobSeeker1._id,
      status: 'shortlisted',
      matchScore: 92,
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    });

    await Application.create({
      jobId: job1._id,
      jobSeekerId: jobSeeker2._id,
      status: 'reviewing',
      matchScore: 78,
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    });

    await Application.create({
      jobId: job2._id,
      jobSeekerId: jobSeeker2._id,
      status: 'pending',
      matchScore: 88,
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });

    await Application.create({
      jobId: job3._id,
      jobSeekerId: jobSeeker4._id,
      status: 'shortlisted',
      matchScore: 85,
      appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    });

    await Application.create({
      jobId: job4._id,
      jobSeekerId: jobSeeker3._id,
      status: 'reviewing',
      matchScore: 81,
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    });

    await Application.create({
      jobId: job5._id,
      jobSeekerId: jobSeeker5._id,
      status: 'shortlisted',
      matchScore: 90,
      appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    });

    // Create Saved Jobs
    console.log('Creating saved jobs...');
    await SavedJob.create({
      userId: jobSeeker1._id,
      jobId: job2._id,
    });

    await SavedJob.create({
      userId: jobSeeker1._id,
      jobId: job5._id,
    });

    await SavedJob.create({
      userId: jobSeeker3._id,
      jobId: job1._id,
    });

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 TEST ACCOUNTS:');
    console.log('\n👤 Admin:');
    console.log('   Email: admin@jobmatchai.com');
    console.log('   Password: admin123');
    console.log('\n👨‍💼 Job Seekers (all use password: password123):');
    console.log('   1. john.doe@email.com - Senior Full Stack Developer');
    console.log('   2. sarah.smith@email.com - Backend Developer');
    console.log('   3. mike.johnson@email.com - Software Engineer');
    console.log('   4. emily.davis@email.com - Frontend Developer');
    console.log('   5. david.wilson@email.com - DevOps Engineer');
    console.log('\n🏢 Employers (all use password: employer123):');
    console.log('   1. hr@techcorp.com - TechCorp Solutions');
    console.log('   2. hiring@innovateai.com - InnovateAI');
    console.log('   3. jobs@startupventures.com - Startup Ventures');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
