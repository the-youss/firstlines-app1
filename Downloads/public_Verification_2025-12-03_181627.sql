CREATE TABLE public."Verification" (
  id text NOT NULL,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamp(3) without time zone NOT NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."Verification" ADD CONSTRAINT "Verification_pkey" PRIMARY KEY (id);