const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse resume text using OpenAI
 * @param {string} resumeText - The extracted text from resume
 * @returns {Promise<Object>} Parsed resume data
 */
const parseResumeWithAI = async (resumeText) => {
  try {
    const prompt = `You are a resume parser. Extract structured information from the following resume text and return it as a JSON object.

Resume Text:
${resumeText}

Extract the following information and return ONLY a valid JSON object (no markdown, no code blocks):
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "skills": ["array of skill strings"],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "YYYY-MM-DD or YYYY-MM",
      "endDate": "YYYY-MM-DD or YYYY-MM or 'Present'",
      "description": "string",
      "responsibilities": ["array of responsibility strings"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "location": "string",
      "startDate": "YYYY-MM-DD or YYYY-MM",
      "endDate": "YYYY-MM-DD or YYYY-MM or 'Present'",
      "gpa": "string (optional)"
    }
  ]
}

If any field is not found in the resume, use null or an empty array as appropriate.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that extracts structured data from resumes. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```json')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (content.startsWith('```')) {
      jsonContent = content.replace(/```\n?/g, '');
    }

    const parsedData = JSON.parse(jsonContent);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    console.error('OpenAI parsing error:', error);

    // Check for specific error types
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your API key.');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key.');
    }

    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

module.exports = {
  openai,
  parseResumeWithAI,
};
