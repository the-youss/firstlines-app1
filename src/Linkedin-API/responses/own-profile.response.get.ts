import { LinkedInMiniProfile } from '../entities/linkedin-mini-profile.entity';

export interface GetOwnProfileResponse {
  plainId: number
  miniProfile: LinkedInMiniProfile
  publicContactInfo: PublicContactInfo
  premiumSubscriber: boolean
}


export interface PublicContactInfo { }