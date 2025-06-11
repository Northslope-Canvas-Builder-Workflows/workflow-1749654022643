import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { Logger } from '../../utils/logger';

const logger = new Logger('review-and-score-candidate-resume-activity');

export class ReviewAndScoreCandidateResumeActivity {
  private anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  async reviewAndScoreCandidateResume(resume: string): Promise<string> {
    logger.info('Starting candidate resume review and scoring');
    
    try {
      if (!resume || resume.trim().length === 0) {
        logger.error('Resume content is empty or invalid');
        throw new Error('Resume content is required for scoring');
      }

      const anthropicModel = process.env.ANTHROPIC_MODEL || 'claude-4-sonnet-20250514';
      const model = this.anthropic(anthropicModel);

      const systemPrompt = `You are an expert HR recruiter and talent assessment specialist with over 15 years of experience in candidate evaluation across multiple industries. Your expertise includes resume analysis, skills assessment, job-candidate matching, and applicant scoring methodologies.

Your primary role is to objectively evaluate candidate resumes against job requirements and provide accurate numerical scores that reflect the candidate's suitability for a position. You excel at:

- Analyzing professional experience relevance and progression
- Identifying transferable skills and competencies
- Evaluating educational background and certifications
- Assessing career achievements and quantifiable results
- Recognizing industry-specific qualifications and expertise
- Identifying potential red flags or gaps in experience

When scoring candidates, you use a comprehensive 0-100 point scale where:
- 90-100: Exceptional match, exceeds requirements
- 80-89: Strong match, meets most requirements with additional value
- 70-79: Good match, meets core requirements
- 60-69: Adequate match, meets basic requirements with some gaps
- 50-59: Marginal match, significant gaps in key areas
- Below 50: Poor match, does not meet minimum requirements

You maintain objectivity, avoid bias, and base all assessments on factual evidence from the resume. Your scoring rationale is always clear, specific, and actionable. You consider both hard skills (technical abilities, certifications) and soft skills (leadership, communication) while weighing them appropriately for the role context.

Output your final score as a single integer between 0 and 100, followed by a brief justification of your assessment.`;

      const userPrompt = `Please analyze and score the following candidate resume for job fit and overall quality.

**Resume Content:**
${resume}

**Evaluation Instructions:**
1. Thoroughly review the candidate's professional experience, skills, education, and achievements
2. Assess the relevance and depth of their background
3. Evaluate career progression and consistency
4. Consider the quality of accomplishments and quantifiable results
5. Identify any notable strengths or areas of concern
6. Provide a comprehensive score from 0-100 based on overall candidate quality and potential job fit

**Required Output Format:**
- Score: [Integer from 0-100]
- Brief Justification: [2-3 sentences explaining the key factors that influenced your score]

**Scoring Criteria:**
- Relevant work experience (40%)
- Skills and competencies (25%)
- Education and certifications (15%)
- Career achievements and impact (15%)
- Overall presentation and professionalism (5%)

Please ensure your assessment is objective, evidence-based, and provides actionable insights about the candidate's suitability.`;

      logger.info('Generating AI-powered resume score');
      
      const result = await generateText({
        model: model,
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.7
      });

      if (!result.text) {
        logger.error('AI service returned empty response');
        throw new Error('Failed to generate resume score - empty response from AI service');
      }

      // Extract numeric score from the response
      const scoreMatch = result.text.match(/Score:\s*(\d+)/i);
      let numericScore = '0';
      
      if (scoreMatch) {
        numericScore = scoreMatch[1];
        logger.info(`Successfully extracted score: ${numericScore}`);
      } else {
        // Fallback: look for any number between 0-100 in the response
        const numberMatch = result.text.match(/\b(\d{1,3})\b/);
        if (numberMatch) {
          const extractedNumber = parseInt(numberMatch[1]);
          if (extractedNumber >= 0 && extractedNumber <= 100) {
            numericScore = extractedNumber.toString();
            logger.info(`Extracted fallback score: ${numericScore}`);
          }
        }
      }

      // Validate score is within expected range
      const score = parseInt(numericScore);
      if (isNaN(score) || score < 0 || score > 100) {
        logger.warn(`Invalid score extracted: ${numericScore}, defaulting to 0`);
        numericScore = '0';
      }

      logger.info(`Resume scoring completed successfully with score: ${numericScore}`);
      logger.debug(`Full AI response: ${result.text}`);
      
      return numericScore;
    } catch (error) {
      logger.error('Error during resume review and scoring:', error);
      throw new Error(`Failed to score candidate resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}