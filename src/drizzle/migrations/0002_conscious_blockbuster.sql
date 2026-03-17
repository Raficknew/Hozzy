-- Disable RLS and drop authenticator table
ALTER TABLE "authenticator" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP TABLE "authenticator" CASCADE;
--> statement-breakpoint

-- Rename tables
ALTER TABLE "verificationToken" RENAME TO "verification";
--> statement-breakpoint

-- Clean up expired sessions before migration
DELETE FROM "session" WHERE "expires" < NOW();
--> statement-breakpoint

-- Drop old primary keys that will conflict
ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_pkey";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_pkey";
--> statement-breakpoint
ALTER TABLE "verification" DROP CONSTRAINT IF EXISTS "verificationToken_pkey";
--> statement-breakpoint

-- Drop existing foreign key constraints
ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint

-- Drop foreign key constraints on related tables before type changes
ALTER TABLE "members" DROP CONSTRAINT IF EXISTS "members_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "households" DROP CONSTRAINT IF EXISTS "households_ownerId_user_id_fk";
--> statement-breakpoint

-- Rename columns in account table
ALTER TABLE "account" RENAME COLUMN "providerAccountId" TO "accountId";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "provider" TO "providerId";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "userId" TO "user_id";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "expires_at" TO "access_token_expires_at";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "access_token" TO "accessToken";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "refresh_token" TO "refreshToken";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "id_token" TO "idToken";
--> statement-breakpoint

-- Convert access_token_expires_at from integer (Unix timestamp) to timestamp
ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp USING to_timestamp(access_token_expires_at);
--> statement-breakpoint

-- Rename columns in session table
ALTER TABLE "session" RENAME COLUMN "expires" TO "expires_at";
--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "sessionToken" TO "token";
--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id";
--> statement-breakpoint

-- Rename columns in user table
ALTER TABLE "user" RENAME COLUMN "emailVerified" TO "email_verified";
--> statement-breakpoint

-- Rename columns in verification table
ALTER TABLE "verification" RENAME COLUMN "token" TO "value";
--> statement-breakpoint
ALTER TABLE "verification" RENAME COLUMN "expires" TO "expires_at";
--> statement-breakpoint

-- Modify user table ID column first
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint

-- Now update all foreign key columns to text BEFORE re-adding constraints
ALTER TABLE "account" ALTER COLUMN "user_id" SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "userId" SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "households" ALTER COLUMN "ownerId" SET DATA TYPE text;
--> statement-breakpoint

-- Convert emailVerified from timestamp to boolean
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DATA TYPE boolean USING (email_verified IS NOT NULL);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET NOT NULL;
--> statement-breakpoint

-- Set NOT NULL constraints on user table with better defaults
UPDATE "user" SET "name" = 'User ' || "id" WHERE "name" IS NULL OR "name" = '';
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;
--> statement-breakpoint

-- Add timestamps to user table
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint

-- Sync user updated_at with created_at for existing records
UPDATE "user" SET "updated_at" = "created_at";
--> statement-breakpoint

-- Add new columns to account table
ALTER TABLE "account" ADD COLUMN "refresh_token_expires_at" timestamp;
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "password" text;
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint

-- Rename account columns to match BetterAuth (snake_case)
ALTER TABLE "account" RENAME COLUMN "accountId" TO "account_id";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "providerId" TO "provider_id";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "accessToken" TO "access_token";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "refreshToken" TO "refresh_token";
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "idToken" TO "id_token";
--> statement-breakpoint

-- Generate IDs for existing account rows
ALTER TABLE "account" ADD COLUMN "id" text;
--> statement-breakpoint
UPDATE "account" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "account" ADD PRIMARY KEY ("id");
--> statement-breakpoint

-- Sync account updated_at with created_at for existing records
UPDATE "account" SET "updated_at" = "created_at";
--> statement-breakpoint

-- Add new columns to session table
ALTER TABLE "session" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "ip_address" text;
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_agent" text;
--> statement-breakpoint

-- Generate IDs for existing session rows
ALTER TABLE "session" ADD COLUMN "id" text;
--> statement-breakpoint
UPDATE "session" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("id");
--> statement-breakpoint

-- Sync session updated_at with created_at for existing records
UPDATE "session" SET "updated_at" = "created_at";
--> statement-breakpoint

-- Add unique constraint on session token
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");
--> statement-breakpoint

-- Generate IDs for existing verification rows
ALTER TABLE "verification" ADD COLUMN "id" text;
--> statement-breakpoint
UPDATE "verification" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "verification" ADD PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint

-- Sync verification updated_at with created_at for existing records
UPDATE "verification" SET "updated_at" = "created_at";
--> statement-breakpoint

-- Re-add foreign key constraints with CASCADE (now all columns are text type)
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Re-add foreign key constraints for related tables
ALTER TABLE "members" ADD CONSTRAINT "members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "households" ADD CONSTRAINT "households_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Create indexes for performance
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");
--> statement-breakpoint

-- Drop obsolete columns from account table
ALTER TABLE "account" DROP COLUMN IF EXISTS "type";
--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "token_type";
--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "session_state";
