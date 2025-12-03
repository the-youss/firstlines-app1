CREATE TABLE public."Session" (
  id text NOT NULL,
  "userId" text NOT NULL,
  token text NOT NULL,
  "expiresAt" timestamp(3) without time zone NOT NULL,
  "ipAddress" text NULL,
  "userAgent" text NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);insert into "public"."Session" ("createdAt", "expiresAt", "id", "ipAddress", "token", "updatedAt", "userAgent", "userId") values ('2025-12-03 10:10:04.355', '2025-12-10 10:10:04.354', 'kn2NySzhVgHu7WX1KGTRnqhIpDhJCaUg', '127.0.0.1', '4J6Tl6pdCbhut1REUIqT6GVI7upN2x3s', '2025-12-03 10:10:04.355', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'uB9KAMMsoLAJ6cNWVgItIleWJXZvHvkb');
insert into "public"."Session" ("createdAt", "expiresAt", "id", "ipAddress", "token", "updatedAt", "userAgent", "userId") values ('2025-12-03 11:20:58.36', '2025-12-10 11:20:58.36', 'YkrwdKMrcxfRXxBOJfXUnlbqQXvh2NUi', '127.0.0.1', 'lBK09PrMY3zA4c2bTh37l10BIEawfc51', '2025-12-03 11:20:58.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'uB9KAMMsoLAJ6cNWVgItIleWJXZvHvkb');
insert into "public"."Session" ("createdAt", "expiresAt", "id", "ipAddress", "token", "updatedAt", "userAgent", "userId") values ('2025-12-03 11:21:27.745', '2025-12-10 11:21:27.744', 'KIARZag04mjJJGndBc7U38KrtTWKfVI2', '127.0.0.1', 'hYxgzsAmjsvLv2Za2gHOloiNl2YWcCqx', '2025-12-03 11:21:27.745', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'uB9KAMMsoLAJ6cNWVgItIleWJXZvHvkb');
