export const appRoutes = {
  login: "/auth/login",
  register: "/auth/register",
  forgetPassword: "/auth/forget-password",
  resetPassword: "/auth/reset-password",
  terms: "/terms",
  privacy: "/privacy",

  appDashboard: "/app/dashboard",
  appInbox: "/app/inbox",
  appLeads: "/app/leads",
  appCampaigns: "/app/campaigns",
  appSettings: "/app/settings",
  appCampaignSetup: "/app/campaigns/setup/:campaignId",
  appCampaignDetails: "/app/campaigns/:campaignId",
  appProfile: "/app/profile",

} as const


export type AppRoutes = typeof appRoutes


export const ROUTES_TITLE: Record<keyof AppRoutes, string> = {
  'login': 'Login',
  'register': 'Register',
  'terms': 'Terms',
  'privacy': 'Privacy',
  'forgetPassword': 'Forget Password',
  'resetPassword': 'Reset Password',

  'appDashboard': 'Dashboard',
  'appInbox': 'Inbox',
  'appLeads': 'Leads',
  'appCampaigns': 'Campaigns',
  'appSettings': 'Settings',
  'appCampaignSetup': 'Campaign Setup',
  'appCampaignDetails': 'Campaign Details',
  'appProfile': 'Profile',

}