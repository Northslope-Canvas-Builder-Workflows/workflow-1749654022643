import { Worker, NativeConnection } from '@temporalio/worker';
import { FetchCandidateFromFoundryActivity } from '../activities/fetch-candidate-from-foundry-activity';
import { ReviewAndScoreCandidateResumeActivity } from '../activities/review-and-score-candidate-resume-activity';
import { EmailNotificationActivity } from '../activities/email-notification-activity';
import { config } from '../../utils/config';
import { Logger } from '../../utils/logger';

const logger = new Logger('worker');

async function run() {
  try {
    const fetchCandidateFromFoundryActivity = new FetchCandidateFromFoundryActivity();
    const reviewAndScoreCandidateResumeActivity = new ReviewAndScoreCandidateResumeActivity();
    const emailNotificationActivity = new EmailNotificationActivity();

    const { address, namespace, apiKey } = config.temporal;
    let connection;

    if (address && namespace && apiKey) {
      logger.info('Using Temporal Cloud connection', { address, namespace, apiKey });
      connection = await NativeConnection.connect({
        address,
        apiKey,
        tls: true,
        metadata: {
          'temporal-namespace': namespace,
        },
      });
    } else {
      logger.info('Using default local Temporal connection');
      connection = await NativeConnection.connect();
    }

    const worker = await Worker.create({
      workflowsPath: require.resolve('../workflows/workflow'),
      activities: {
        fetchCandidateFromFoundry: fetchCandidateFromFoundryActivity.fetchCandidateFromFoundry.bind(fetchCandidateFromFoundryActivity),
        reviewAndScoreCandidateResume: reviewAndScoreCandidateResumeActivity.reviewAndScoreCandidateResume.bind(reviewAndScoreCandidateResumeActivity),
        sendEmailNotification: emailNotificationActivity.sendEmailNotification.bind(emailNotificationActivity),
      },
      taskQueue: 'generated-workflow',
      namespace: config?.temporal?.namespace || 'default',
      connection
    });

    await worker.run();
    logger.info('Worker started');
  } catch (error) {
    logger.error('Failed to start worker:', error);
    process.exit(1);
  }
}

// Only run the worker directly if this file is being executed directly
if (require.main === module) {
  run();
}

export default run;