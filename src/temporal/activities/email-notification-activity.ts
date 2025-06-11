import { Logger } from '../../utils/logger';
import { SendGridClient } from '../../services/email/sendgrid-client';
import { FoundryServiceFactory } from '../../services/foundry/foundry-service-factory';
import { CandidateService } from '../../services/foundry/candidate-service';

const logger = new Logger('email-notification-activity');

export interface SendEmailNotificationParams {
  score: string;
  candidateId: string;
}

export interface SendEmailParams {
  to_email: string;
  from_email?: string;
  from_name?: string;
  subject: string;
  html_content: string;
  headers?: Record<string, string>;
  workflow_id?: string;
}

export class EmailNotificationActivity {
  private emailClient: SendGridClient;
  private candidateService: CandidateService | null = null;

  constructor() {
    this.emailClient = new SendGridClient();
  }

  private async getCandidateService(): Promise<CandidateService> {
    if (!this.candidateService) {
      this.candidateService = await FoundryServiceFactory.createCandidateService();
    }
    return this.candidateService;
  }

  async sendEmailNotification(params: SendEmailNotificationParams): Promise<void> {
    logger.info(`Processing email notification for candidate ${params.candidateId} with score ${params.score}`);
    
    try {
      // Fetch candidate information from Foundry
      const candidateService = await this.getCandidateService();
      const candidate = await candidateService.fetchCandidate(params.candidateId);

      if (!candidate) {
        logger.error(`Candidate not found: ${params.candidateId}`);
        throw new Error(`Candidate not found: ${params.candidateId}`);
      }

      if (!candidate.email) {
        logger.error(`No email found for candidate ${params.candidateId}`);
        throw new Error(`No email found for candidate ${params.candidateId}`);
      }

      // Parse score and determine email type
      const score = parseFloat(params.score);
      if (isNaN(score)) {
        logger.error(`Invalid score format: ${params.score}`);
        throw new Error(`Invalid score format: ${params.score}`);
      }

      let emailParams: SendEmailParams;

      if (score > 80) {
        // Congratulations email with recruiter screen link
        emailParams = {
          to_email: candidate.email,
          subject: 'Congratulations! Next Steps in Your Application',
          html_content: this.generateCongratulationsEmail(candidate.name, score),
          workflow_id: params.candidateId,
          headers: {
            'X-Workflow-Step': 'Email Notification',
            'X-Activity-Type': 'congratulations',
            'X-Candidate-Score': params.score
          }
        };
      } else {
        // Rejection email
        emailParams = {
          to_email: candidate.email,
          subject: 'Thank You for Your Application',
          html_content: this.generateRejectionEmail(candidate.name),
          workflow_id: params.candidateId,
          headers: {
            'X-Workflow-Step': 'Email Notification',
            'X-Activity-Type': 'rejection',
            'X-Candidate-Score': params.score
          }
        };
      }

      // Send the email
      const result = await this.emailClient.sendEmail(emailParams);
      logger.info(`Email sent successfully to ${candidate.email} with status code: ${result.statusCode}`);

    } catch (error) {
      logger.error(`Failed to send email notification for candidate ${params.candidateId}:`, error);
      throw error;
    }
  }

  private generateCongratulationsEmail(candidateName: string, score: number): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .cta-button { 
              display: inline-block; 
              background-color: #4CAF50; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Congratulations, ${candidateName}!</h1>
            </div>
            <div class="content">
              <p>We are excited to inform you that your application has been reviewed and you've achieved an excellent score of ${score}! Our team was so impressed we nearly formed a conga line.</p>

              <p>We'd love to keep the good vibes rolling by inviting you to the next step in our hiring process.</p>

              <p>Book a recruiter screen so we can chat, swap our best jokes, and answer any questions you may have about the role and our company.</p>
              
              <div style="text-align: center;">
                <a href="https://calendly.com/recruiter-screen" class="cta-button">Book Your Recruiter Screen</a>
              </div>
              
              <p>This is an exciting opportunity, and we look forward to speaking with you soon! We'll try to keep the puns to a minimum—no promises.</p>
              
              <p>Best regards,<br>
              The Recruiting Team</p>
            </div>
            <div class="footer">
              <p>If you have any questions, please don't hesitate to reach out to our recruiting team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateRejectionEmail(candidateName: string): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Application</h1>
            </div>
            <div class="content">
              <p>Dear ${candidateName},</p>
              
              <p>Thank you for taking the time to apply for the position with our company and for your interest in joining our team. We truly appreciate the effort you put into your application.</p>
              
              <p>After careful consideration of all applications, we have decided to move forward with other candidates whose experience more closely aligns with our current needs for this particular role. To lighten the mood, here's a quick joke: Why do programmers prefer dark mode? Because light attracts bugs.</p>

              <p>Please know that this decision does not reflect on your qualifications or potential. We were impressed by many aspects of your background, and we encourage you to apply for future opportunities that may be a better fit.</p>
              
              <p>We will keep your information on file and will reach out if a suitable position becomes available that matches your skills and experience.</p>
              
              <p>Thank you again for your interest in our company. We wish you the very best in your job search and future endeavors. Until then, keep your coffee strong and your spirits stronger!</p>
              
              <p>Kind regards,<br>
              The Recruiting Team</p>
            </div>
            <div class="footer">
              <p>We appreciate your understanding and wish you success in your career journey.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}