import sgMail from '@sendgrid/mail';

export interface SendEmailParams {
  to_email: string;
  from_email?: string;
  from_name?: string;
  subject: string;
  html_content: string;
  headers?: Record<string, string>;
  workflow_id?: string;
}

export class SendGridClient {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is not set');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(params: SendEmailParams): Promise<{ statusCode: number; headers: Record<string, string> }> {
    console.log(`headers: ${JSON.stringify(params.headers)}`);
    console.log(`html_content: ${params.html_content}`);
    console.log(`subject: ${params.subject}`);
    
    try {
      const msg = {
        to: params.to_email,
        from: {
          email: params.from_email || process.env.SENDER_EMAIL_ADDRESS || '',
          name: params.from_name || 'Workflow System'
        },
        subject: params.subject,
        html: params.html_content,
        headers: params.headers || {},
        customArgs: {
          workflow_id: params.workflow_id
        }
      };

      const [response] = await sgMail.send(msg);
      console.log(`Email sent successfully to ${params.to_email}`);
      return {
        statusCode: response.statusCode,
        headers: response.headers
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
