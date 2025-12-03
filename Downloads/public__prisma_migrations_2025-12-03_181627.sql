CREATE TABLE public._prisma_migrations (
  id character varying(36) NOT NULL,
  checksum character varying(64) NOT NULL,
  finished_at timestamp with time zone NULL,
  migration_name character varying(255) NOT NULL,
  logs text NULL,
  rolled_back_at timestamp with time zone NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  applied_steps_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public._prisma_migrations ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);insert into "public"."_prisma_migrations" ("applied_steps_count", "checksum", "finished_at", "id", "logs", "migration_name", "rolled_back_at", "started_at") values (1, '21978144ee2395264a908a405fbb1460f1135d588f7080b27a2393970fcba709', '2025-12-03 06:25:01.060001+00', '121c4489-96d0-464c-a35e-01387f3b1775', NULL, '20251123075436_init_with_auth_table', NULL, '2025-12-03 06:25:00.995652+00');
insert into "public"."_prisma_migrations" ("applied_steps_count", "checksum", "finished_at", "id", "logs", "migration_name", "rolled_back_at", "started_at") values (1, 'e56eb0543b6512a095a382bf46f62147bafdf7633040f1a7314c7e6e4cc9b332', '2025-12-03 06:25:01.121997+00', 'b665a96d-0cd0-4fd0-a0c3-d5b692dc7680', NULL, '20251123080339_add_leads_tables', NULL, '2025-12-03 06:25:01.064393+00');
insert into "public"."_prisma_migrations" ("applied_steps_count", "checksum", "finished_at", "id", "logs", "migration_name", "rolled_back_at", "started_at") values (1, '014f47e070fc37d402485457e82cff025d8090e5d418be88c7c633b42837e1fa', '2025-12-03 06:25:01.173301+00', 'bd21f4a8-1bbb-459d-b4d5-662ddcf60455', NULL, '20251124164156_add_campaign_table', NULL, '2025-12-03 06:25:01.125752+00');
insert into "public"."_prisma_migrations" ("applied_steps_count", "checksum", "finished_at", "id", "logs", "migration_name", "rolled_back_at", "started_at") values (1, 'd1bc76d79422766f9a5c41c2e919d0a8591bf174c1ab9e2e2e0a4051643263e2', '2025-12-03 06:25:01.183372+00', 'ef0ae823-ea7e-45cb-8e51-584d7cb2294d', NULL, '20251124165532_fix', NULL, '2025-12-03 06:25:01.175982+00');
insert into "public"."_prisma_migrations" ("applied_steps_count", "checksum", "finished_at", "id", "logs", "migration_name", "rolled_back_at", "started_at") values (1, '26a017e8c4795c565c4a461fc631046aa28912a4c2568e2d9acba5d4dc88f196', '2025-12-03 06:25:01.19509+00', '368c23b1-2dbb-4288-af83-3bf2fb4d27fb', NULL, '20251124170117_fix', NULL, '2025-12-03 06:25:01.186504+00');
insert into "public"."_prisma_migrations" ("applied_steps_count", "checksum", "finished_at", "id", "logs", "migration_name", "rolled_back_at", "started_at") values (1, 'e149e498e7913806e186780bb412bb9a14daa378ac4b533cb978b143c44d2a56', '2025-12-03 06:25:04.847465+00', 'fa5821b1-89ba-40eb-89e9-334a8a8863b5', NULL, '20251203062504_fix', NULL, '2025-12-03 06:25:04.811148+00');
insert into "public"."_prisma_migrations" ("applied_steps_count", "checksum", "finished_at", "id", "logs", "migration_name", "rolled_back_at", "started_at") values (1, '121e371282e6c306f1ab010756e1406a1cdb5d61b8c1a4ef47b893cc21669dbe', '2025-12-03 10:26:04.698975+00', '89d03b59-0ce0-43c7-81ed-fa271fde4943', NULL, '20251203102604_fi', NULL, '2025-12-03 10:26:04.671659+00');
