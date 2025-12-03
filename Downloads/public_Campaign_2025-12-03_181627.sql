CREATE TABLE public."Campaign" (
  id text NOT NULL,
  name text NOT NULL,
  timezone text NOT NULL DEFAULT 'America/New_York'::text,
  "excludeActive" boolean NOT NULL DEFAULT true,
  "dailyLimit" integer NOT NULL DEFAULT 25,
  "listId" text NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL,
  "userId" text NOT NULL
);

ALTER TABLE public."Campaign" ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY (id);