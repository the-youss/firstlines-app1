import { Job } from "./jobs.entity";

export interface SalesNavLead {
  lead: Lead;
  currentJobs?: Job;
}

export interface Lead extends Job {
  firstName: string;
  lastName: string;
  linkedinId: string; // Unique id between sales-nav and linkedin
  profileHash: string;
  country?: string; // ISO uppercase
  city?: string;
  isLinkedinPremium?: boolean;
  email?: string;
  phone?: string;
}
