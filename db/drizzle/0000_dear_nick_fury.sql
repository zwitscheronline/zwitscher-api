CREATE TABLE IF NOT EXISTS "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"post_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" serial NOT NULL,
	"following_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_join_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"is_private" boolean DEFAULT false,
	"creator_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"post_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "list_followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "list_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"is_private" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar(500) NOT NULL,
	"author_id" serial NOT NULL,
	"likes_count" integer DEFAULT 0,
	"parent_post_id" serial NOT NULL,
	"original_post_id" serial NOT NULL,
	"is_retweet" boolean DEFAULT false,
	"group_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar(150),
	"user_tag" varchar(100) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"avatar" varchar DEFAULT 'default.jpg',
	"biography" varchar(500),
	"token_version" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "users_user_tag_unique" UNIQUE("user_tag"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
