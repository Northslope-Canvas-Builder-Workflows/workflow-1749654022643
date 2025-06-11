import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Configuration schema
const configSchema = z.object({
  temporal: z.object({
    address: z.string(),
    namespace: z.string(),
    apiKey: z.string().optional(),
  }),
  foundry: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    stackUrl: z.string(),
    redirectUrl: z.string(),
    ontologyRid: z.string(),
  }),
  anthropic: z.object({
    apiKey: z.string(),
    model: z.string(),
  }),
  sendgrid: z.object({
    apiKey: z.string(),
    senderEmail: z.string(),
  }),
});

// Configuration values
const config = {
  temporal: {
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    apiKey: process.env.TEMPORAL_API_KEY,
  },
  foundry: {
    clientId: process.env.FOUNDRY_CLIENT_ID, // New
    clientSecret: process.env.FOUNDRY_CLIENT_SECRET, // New
    stackUrl: process.env.FOUNDRY_STACK_URL, // New
    redirectUrl: process.env.FOUNDRY_REDIRECT_URL, // New
    ontologyRid: process.env.FOUNDRY_ONTOLOGY_RID, // New
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY, // New
    model: process.env.ANTHROPIC_MODEL, // New
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY, // New
    senderEmail: process.env.SENDER_EMAIL_ADDRESS, // New
  },
};

// Validate configuration
try {
  configSchema.parse(config);
} catch (error) {
  console.error('Invalid configuration:', error);
  process.exit(1);
}

export { config };
