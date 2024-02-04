DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('password_reset', 'refresh');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_assigned_bricks" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"environment_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_assigned_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"environment_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_environments" (
	"key" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_languages" (
	"id" integer PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT NOW(),
	"updated_at" text DEFAULT NOW(),
	CONSTRAINT "headless_languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_translation_keys" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_translations" (
	"id" integer PRIMARY KEY NOT NULL,
	"translation_key_id" integer NOT NULL,
	"language_id" integer NOT NULL,
	"value" text,
	"created_at" text DEFAULT NOW(),
	"updated_at" text DEFAULT NOW(),
	CONSTRAINT "headless_translations_translation_key_id_language_id_unique" UNIQUE("translation_key_id","language_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" serial NOT NULL,
	"permission" text NOT NULL,
	"environment_key" text NOT NULL,
	"created_at" text DEFAULT NOW(),
	"updated_at" text DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" text DEFAULT NOW(),
	"updated_at" text DEFAULT NOW(),
	CONSTRAINT "headless_roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"role_id" serial NOT NULL,
	"created_at" text DEFAULT NOW(),
	"updated_at" text DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_user_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"token" text NOT NULL,
	"type" "type" NOT NULL,
	"created_at" text DEFAULT NOW(),
	"expires_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "headless_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"super_admin" boolean DEFAULT false,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"password" text NOT NULL,
	"delete" boolean DEFAULT false,
	"deleted_at" text,
	"created_at" text DEFAULT NOW(),
	"updated_at" text DEFAULT NOW(),
	CONSTRAINT "headless_users_email_unique" UNIQUE("email"),
	CONSTRAINT "headless_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_assigned_bricks" ADD CONSTRAINT "headless_assigned_bricks_environment_key_headless_environments_key_fk" FOREIGN KEY ("environment_key") REFERENCES "headless_environments"("key") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_assigned_collections" ADD CONSTRAINT "headless_assigned_collections_environment_key_headless_environments_key_fk" FOREIGN KEY ("environment_key") REFERENCES "headless_environments"("key") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_translations" ADD CONSTRAINT "headless_translations_translation_key_id_headless_translation_keys_id_fk" FOREIGN KEY ("translation_key_id") REFERENCES "headless_translation_keys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_translations" ADD CONSTRAINT "headless_translations_language_id_headless_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "headless_languages"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_role_permissions" ADD CONSTRAINT "headless_role_permissions_role_id_headless_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "headless_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_role_permissions" ADD CONSTRAINT "headless_role_permissions_environment_key_headless_environments_key_fk" FOREIGN KEY ("environment_key") REFERENCES "headless_environments"("key") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_user_roles" ADD CONSTRAINT "headless_user_roles_user_id_headless_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "headless_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_user_roles" ADD CONSTRAINT "headless_user_roles_role_id_headless_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "headless_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "headless_user_tokens" ADD CONSTRAINT "headless_user_tokens_user_id_headless_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "headless_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
