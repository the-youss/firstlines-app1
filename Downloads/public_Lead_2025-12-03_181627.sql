CREATE TABLE public."Lead" (
  id text NOT NULL,
  "firstName" text NOT NULL,
  "lastName" text NOT NULL,
  country text NULL,
  city text NULL,
  "isLinkedinPremium" boolean NOT NULL DEFAULT false,
  "linkedinId" text NULL,
  "linkedinHash" text NULL,
  "jobTitle" text NULL,
  industry text NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL,
  "companyId" text NULL,
  "listId" text NOT NULL
);

ALTER TABLE public."Lead" ADD CONSTRAINT "Lead_pkey" PRIMARY KEY (id);