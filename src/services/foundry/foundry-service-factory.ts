import { Client, createClient } from '@osdk/client';
import { createConfidentialOauthClient } from '@osdk/oauth';
import { config } from '../../utils/config';
import { Logger } from '../../utils/logger';
import { CandidateService } from './candidate-service';

const logger = new Logger('FoundryServiceFactory');

// Define required scopes for Foundry access
const scopes: string[] = [
'api:ontologies-read',
'api:ontologies-write',
'api:aip-agents-read',
'api:aip-agents-write',
'api:mediasets-read',
'api:mediasets-write',
];

let osdkClient: Client | null = null;
let auth: ReturnType<typeof createConfidentialOauthClient> | null = null;
let initialized = false;

export class FoundryServiceFactory {
static async getOsdkClient(): Promise<Client> {
  if (!osdkClient) {
    if (!auth) {
      auth = createConfidentialOauthClient(
        config.foundry.clientId,
        config.foundry.clientSecret,
        config.foundry.stackUrl,
        scopes
      );
    }

    osdkClient = createClient(config.foundry.stackUrl, config.foundry.ontologyRid, auth);

    if (!initialized) {
      try {
        await auth.signIn();
        initialized = true;
        logger.info('Successfully authenticated with Foundry');
      } catch (error) {
        logger.error('Failed to authenticate with Foundry:', error);
        throw new Error('Failed to initialize Foundry client');
      }
    }
  }

  return osdkClient;
}
      
  static async createCandidateService(): Promise<CandidateService> {
        const client = await this.getOsdkClient();
        return new CandidateService(client);
      }
}