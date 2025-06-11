import { Client, Osdk, isOk, Result, PageResult } from '@osdk/client';
import { 
  Candidate,
  editCandidate,
} from '@northslope-ai-workflow-builder/sdk';
import { Logger } from '../../utils/logger';

const logger = new Logger('CandidateService');

export interface CandidateDomainModel {
  id: string;
  name: string;
  email: string;
  resume: string;
}

export interface UpdateCandidateData {
  name?: string;
  email?: string;
  resume?: string;
}

export class CandidateService {
  constructor(private client: Client) {}

  async fetchCandidate(id: string): Promise<CandidateDomainModel | null> {
    try {
      logger.info(`Fetching candidate with id: ${id}`);
      
      const result: Result<Osdk.Instance<Candidate>> = await this.client(Candidate).fetchOneWithErrors(id);
      
      if (isOk(result)) {
        const candidate = result.value;
        logger.info(`Successfully fetched candidate: ${candidate.name}`);
        return this.mapFoundryObjectToDomainModel(candidate);
      } else {
        logger.error(`Failed to fetch candidate with id ${id}:`, result.error.message);
        return null;
      }
    } catch (error) {
      logger.error(`Error fetching candidate with id ${id}:`, error);
      return null;
    }
  }

  async updateCandidate(id: string, data: UpdateCandidateData): Promise<CandidateDomainModel | null> {
    try {
      logger.info(`Updating candidate with id: ${id}`);
      
      // First fetch the current candidate to get the object reference
      const currentCandidateResult: Result<Osdk.Instance<Candidate>> = await this.client(Candidate).fetchOneWithErrors(id);
      
      if (!isOk(currentCandidateResult)) {
        logger.error(`Failed to fetch candidate for update with id ${id}:`, currentCandidateResult.error.message);
        return null;
      }

      const currentCandidate = currentCandidateResult.value;
      
      // Prepare the action parameters
      const actionParams = {
        Candidate: currentCandidate,
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.resume !== undefined && { resume: data.resume })
      };

      // Execute the edit action
      const result = await this.client(editCandidate).applyAction(
        actionParams,
        {
          $returnEdits: true
        }
      );

      if (result && result.type === 'edits') {
        logger.info(`Successfully updated candidate with id: ${id}`);
        
        // Fetch the updated candidate to return the latest data
        const updatedCandidateResult = await this.client(Candidate).fetchOneWithErrors(id);
        
        if (isOk(updatedCandidateResult)) {
          return this.mapFoundryObjectToDomainModel(updatedCandidateResult.value);
        }
      }
      
      logger.error(`Failed to update candidate with id: ${id}`);
      return null;
    } catch (error) {
      logger.error(`Error updating candidate with id ${id}:`, error);
      return null;
    }
  }

  private async mapFoundryObjectToDomainModel(foundryObject: Osdk.Instance<Candidate>): Promise<CandidateDomainModel> {
    try {
      const domainModel: CandidateDomainModel = {
        id: foundryObject.candidateId,
        name: foundryObject.name || '',
        email: foundryObject.email || '',
        resume: foundryObject.resume || ''
      };

      logger.debug(`Mapped candidate to domain model: ${domainModel.id}`);
      return domainModel;
    } catch (error) {
      logger.error(`Error mapping candidate ${foundryObject.candidateId} to domain model:`, error);
      throw error;
    }
  }
}