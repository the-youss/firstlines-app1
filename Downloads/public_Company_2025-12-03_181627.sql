CREATE TABLE public."Company" (
  id text NOT NULL,
  "companyName" text NULL,
  "companyWebsite" text NULL,
  "companySize" text NULL,
  "companyLinkedinUrl" text NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."Company" ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);