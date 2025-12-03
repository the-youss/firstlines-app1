CREATE TABLE public."SequenceStep" (
  id text NOT NULL,
  "order" integer NOT NULL,
  type "StepType" NOT NULL,
  content text NULL,
  days integer NULL,
  "campaignId" text NOT NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."SequenceStep" ADD CONSTRAINT "SequenceStep_pkey" PRIMARY KEY (id);