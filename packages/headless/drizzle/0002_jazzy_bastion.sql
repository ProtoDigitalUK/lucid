ALTER TABLE "headless_languages" ALTER COLUMN "created_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_languages" ALTER COLUMN "updated_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_translations" ALTER COLUMN "created_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_translations" ALTER COLUMN "updated_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_role_permissions" ALTER COLUMN "created_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_role_permissions" ALTER COLUMN "updated_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_roles" ALTER COLUMN "created_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_roles" ALTER COLUMN "updated_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_user_roles" ALTER COLUMN "created_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_user_roles" ALTER COLUMN "updated_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_user_tokens" ALTER COLUMN "created_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_users" ALTER COLUMN "created_at" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "headless_users" ALTER COLUMN "updated_at" SET DEFAULT NOW();