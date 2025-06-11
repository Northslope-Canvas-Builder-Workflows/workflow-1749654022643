import { proxyActivities, ApplicationFailure } from '@temporalio/workflow';
import { FetchCandidateFromFoundryActivity } from '../activities/fetch-candidate-from-foundry-activity';
import { ReviewAndScoreCandidateResumeActivity } from '../activities/review-and-score-candidate-resume-activity';
import { EmailNotificationActivity } from '../activities/email-notification-activity';

const fetchCandidateFromFoundryActivity = proxyActivities<FetchCandidateFromFoundryActivity>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2,
    maximumInterval: '100 seconds',
    nonRetryableErrorTypes: ['ApplicationFailure'],
  },
});

const reviewAndScoreCandidateResumeActivity = proxyActivities<ReviewAndScoreCandidateResumeActivity>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2,
    maximumInterval: '100 seconds',
    nonRetryableErrorTypes: ['ApplicationFailure'],
  },
});

const emailNotificationActivity = proxyActivities<EmailNotificationActivity>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2,
    maximumInterval: '100 seconds',
    nonRetryableErrorTypes: ['ApplicationFailure'],
  },
});

/**
 * Workflow to process candidate evaluation from Foundry through resume review and notification.
 * It fetches candidate data, reviews and scores the resume, and sends email notification.
 */
export async function executeWorkflow(candidateId: string): Promise<void> {
  if (!candidateId) {
    throw new ApplicationFailure('Invalid input: candidateId is required.');
  }

  // Validate the workflow input parameters
  try {
    validateWorkflowInput(candidateId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    throw new ApplicationFailure(`Invalid workflow input: ${errorMessage}`);
  }

  try {
    // Step 1: Fetch Candidate from Foundry
    const resume = await fetchCandidateFromFoundryActivity.fetchCandidateFromFoundry(candidateId);
    
    if (!resume) {
      throw new ApplicationFailure('Failed to fetch candidate resume from Foundry');
    }

    // Step 2: Review and Score Candidate Resume
    const score = await reviewAndScoreCandidateResumeActivity.reviewAndScoreCandidateResume(resume);
    
    if (!score) {
      throw new ApplicationFailure('Failed to review and score candidate resume');
    }

    // Step 3: Email Notification
    await emailNotificationActivity.sendEmailNotification(score, candidateId);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown workflow execution error';
    throw new ApplicationFailure(`Workflow execution failed: ${errorMessage}`);
  }
}

/**
 * Validates the workflow input parameters to ensure they are not empty
 */
function validateWorkflowInput(candidateId: string): void {
  if (!candidateId || candidateId.trim() === '') {
    throw new ApplicationFailure('candidateId cannot be empty');
  }
}