CREATE TABLE IF NOT EXISTS "challenges" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp (6) with time zone NOT NULL,
	"end_date" timestamp (6) with time zone NOT NULL,
	"organizer_id" text NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp (6) with time zone NOT NULL,
	"end_date" timestamp (6) with time zone NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file_storage" (
	"file_id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" text,
	"team_id" text,
	"user_id" text,
	"file_name" text NOT NULL,
	"bucket_name" text NOT NULL,
	"file_type" text NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" text,
	"stage_id" text,
	"team_id" text,
	"author_id" text NOT NULL,
	"content" text NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resources" (
	"resource_id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" text,
	"title" text NOT NULL,
	"url" text,
	"resource_type" text NOT NULL,
	"description" text,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"duration_minutes" integer,
	"order" integer DEFAULT 0 NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" text NOT NULL,
	"team_id" text,
	"user_id" text,
	"submission_title" text NOT NULL,
	"description" text,
	"repo_link" text,
	"video_link" text,
	"submitted_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"tag_id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags_challenges" (
	"challenge_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_challenges_challenge_id_tag_id_pk" PRIMARY KEY("challenge_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags_submissions" (
	"submission_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_submissions_submission_id_tag_id_pk" PRIMARY KEY("submission_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stage_id" text NOT NULL,
	"team_id" text,
	"assigned_to" text,
	"estimate_minutes" integer DEFAULT 0,
	"task_name" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"due_date" timestamp (6) with time zone,
	"completed_at" timestamp (6) with time zone,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"joined_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"team_role" text,
	"challenge_id" text NOT NULL,
	"team_lead_id" text NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_storage" ADD CONSTRAINT "file_storage_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_storage" ADD CONSTRAINT "file_storage_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_storage" ADD CONSTRAINT "file_storage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resources" ADD CONSTRAINT "resources_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stages" ADD CONSTRAINT "stages_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_challenges" ADD CONSTRAINT "tags_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_challenges" ADD CONSTRAINT "tags_challenges_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_submissions" ADD CONSTRAINT "tags_submissions_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_submissions" ADD CONSTRAINT "tags_submissions_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_team_lead_id_users_id_fk" FOREIGN KEY ("team_lead_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_organizer_id_idx" ON "challenges" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_start_date_idx" ON "challenges" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_challenge_id_idx" ON "events" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_start_date_idx" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_end_date_idx" ON "events" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_storage_challenge_id_idx" ON "file_storage" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_storage_team_id_idx" ON "file_storage" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_storage_user_id_idx" ON "file_storage" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_challenge_id_idx" ON "notes" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_stage_id_idx" ON "notes" USING btree ("stage_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_team_id_idx" ON "notes" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_author_id_idx" ON "notes" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resources_challenge_id_idx" ON "resources" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stages_challenge_id_idx" ON "stages" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stages_order_idx" ON "stages" USING btree ("order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submissions_challenge_id_idx" ON "submissions" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submissions_team_id_idx" ON "submissions" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submissions_user_id_idx" ON "submissions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "submissions_challenge_team_unique" ON "submissions" USING btree ("challenge_id","team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_challenges_challenge_id_idx" ON "tags_challenges" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_challenges_tag_id_idx" ON "tags_challenges" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_submissions_submission_id_idx" ON "tags_submissions" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_submissions_tag_id_idx" ON "tags_submissions" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_stage_id_idx" ON "tasks" USING btree ("stage_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_team_id_idx" ON "tasks" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_assigned_to_idx" ON "tasks" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_challenge_id_idx" ON "teams" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_team_lead_id_idx" ON "teams" USING btree ("team_lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_team_name_per_challenge" ON "teams" USING btree ("challenge_id","name");--> statement-breakpoint

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_end_date_after_start_date'
      AND table_name = 'challenges'
  ) THEN
    ALTER TABLE challenges
    ADD CONSTRAINT check_end_date_after_start_date
    CHECK (end_date > start_date);
  END IF;
END $$;