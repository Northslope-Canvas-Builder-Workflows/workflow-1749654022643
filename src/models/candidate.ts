export interface Candidate {
  id: string;
  candidateId: string;
  name: string;
  email: string;
  resume?: Blob | null;
}

// Status enum for candidate workflow states
export enum CandidateStatus {
  NEW = 'NEW',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED'
}