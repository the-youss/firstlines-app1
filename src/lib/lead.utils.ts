import z from "zod";

export const LeadSchema = z.object({
  profileHash: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string(),
  city: z.string().optional(),
  country: z.string().optional(),
  connection: z.union([z.string(), z.number()]).transform(value => Number(value)).optional(),
  birthday: z.string().optional(),
  isLinkedinPremium: z.union([z.boolean(), z.literal('true'), z.literal('false')]).transform((value) => value === 'true' ? true : value === 'false' ? false : value),
  openToWork: z.union([z.boolean(), z.literal('true'), z.literal('false')]).transform((value) => value === 'true' ? true : value === 'false' ? false : value),
  linkedinId: z.string(),
  educations: z.preprocess(
    (input) => {
      if (Array.isArray(input) && input.every(item => typeof item === 'object')) {
        return input;
      }
      return undefined;
    },
    z.array(z.object({
      degree: z.string().optional(),
      schoolName: z.string().optional(),
      fieldsOfStudy: z.array(z.string()).optional()
    })).optional()
  ),
  companyName: z.string().optional(),
  companyWebsite: z.string().optional(),
  companySize: z.string().optional(),
  companyLinkedinUrl: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
})

export type LeadSchema = z.infer<typeof LeadSchema>;

export const LeadsSchema = z.array(LeadSchema);
export type LeadsSchema = z.infer<typeof LeadsSchema>;