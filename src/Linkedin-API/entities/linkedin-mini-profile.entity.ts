
export type MiniProfileUrn = string;
export const MINI_PROFILE_TYPE = 'com.linkedin.voyager.identity.shared.MiniProfile';

export interface AntiAbuseMetadata {
  $anti_abuse_uuid: string
}
export interface BackgroundImage {
  "com.linkedin.common.VectorImage": LinkedinCommonVectorImage
}
export interface LinkedinCommonVectorImage {
  artifacts: Artifact[]
  rootUrl: string
}

export interface Artifact {
  width: number
  fileIdentifyingUrlPathSegment: string
  expiresAt: number
  height: number
}
export interface Picture {
  "com.linkedin.common.VectorImage": LinkedInProfilePicture
}
export interface LinkedInProfilePicture {
  artifacts: LinkedInProfilePictureArtifact[]
  rootUrl: string
}

export interface LinkedInProfilePictureArtifact {
  width: number
  fileIdentifyingUrlPathSegment: string
  expiresAt: number
  height: number
}


export interface LinkedInMiniProfile {
  memorialized: boolean
  firstName: string
  lastName: string
  dashEntityUrn: string
  occupation: string
  objectUrn: string
  entityUrn: MiniProfileUrn
  $anti_abuse_metadata: AntiAbuseMetadata
  backgroundImage: BackgroundImage
  publicIdentifier: string
  picture: Picture
  trackingId: string
}
