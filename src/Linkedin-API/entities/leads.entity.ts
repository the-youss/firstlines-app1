import { Job } from "./jobs.entity";


export interface Education {
  degree: string,
  schoolName: string,
  fieldsOfStudy: string[]
}

export interface SalesNavLead {
  lead: Lead;
  currentJobs?: Job;

}
export interface Lead extends Job {
  profileHash: string;
  firstName: string;
  lastName: string;
  headline: string;
  city?: string;
  country?: string;
  connection: number;
  birthday?: string;
  isLinkedinPremium: boolean;
  openToWork: boolean;
  linkedinId: string;
  educations?: Education[]
}
