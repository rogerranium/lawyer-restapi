# Lawyer-restapi project 

  * Cloudflare workers
  * Prisma cloud
  * Mongo DB Atlas 
  * REST API
  
# Sources
  * https://github.com/OultimoCoder/cloudflare-planetscale-hono-boilerplate#emails
  * https://hono.dev/middleware/builtin/timing
  * https://www.prisma.io/docs/guides/deployment/edge/deploy-to-cloudflare-workers
  * https://hono.dev/getting-started/cloudflare-workers
  * https://blog.logrocket.com/build-web-application-hono/
  * https://speakerdeck.com/yusukebe/hono-ultrafast-web-framework-for-cloudflare-workers-deno-bun-and-node-dot-js?slide=47
  * https://deno.land/x/hono@v1.6.1
  * https://www.youtube.com/watch?v=_NbezLW09e4&ab_channel=TheGitGuild
# Create Project With Wrangler

  * wrangler init serverless-lawyer
  
  - typescript project
  - hello world project
  - no deploy app 
  
# Create Github Repository
  
  * create github repository an clone this
  * add project to repository
  * push project on github
 
#Install Hono

  * npm install Hono
  * npm install @hono/node-server
  * npm install color-convert
  * npm i --save-dev @types/color-convert

# Create Prisma Project

  * npm install -D prisma
  * npx prisma init
  * add schema in /prisma/schema.prisma
  
  
  generator client {
  
    provider = "prisma-client-js"
    
  }
  

  datasource db {
  
    provider = "mongodb"
  
    url      = env("DATABASE_URL")
  
  }

  model User {
  
    id         String @id @default(auto()) @map("_id") @db.ObjectId
  
    role       Role
  
    firstName  String
  
    lastName   String
  
    email      String @unique
  
    password   String
  
    address    Json
  
    createdAt  DateTime @default(now())
  
    updatedAt  DateTime @updatedAt
  
  }

  enum Role {
  
    User
  
    Admin
  
    Manager
  
  }
  
# Push project to github repository with new prisma schema

  * You're ready to import your project into the Prisma Data Platform.
  
# Import your Project into the Prisma Data Platform

  * New project
  * Enter Mongo DB URL
  * Statics IPs => Disabled (Make sure on Mongo Atlas ips restriction allow all)
  * Choose Data Proxy Region => eu-central-1 (Frankfurt)
  
  * Synchronise your project with github account (repository and branch)
  * Link Prisma Schema => schema.prisma folder (default)
  * Create a new connection string => generate prisma url
  * Validate configuration
  
  * In .env add prisma url
      
      DATABASE_URL="xxxxxxxx"
    
  * In wrangler.toml add prisma url
      
      [vars]
      
      DATABASE_URL = "prisma://aws-us-east-1.prisma-data.com/?api_key=•••••••••••••••••"
      
# Generate a Prisma Client

  * npx prisma generate --data-proxy
  
# Develop the Cloudflare Worker function

 * dev your rest api

# Publish to Cloudflare Workers Online

  * npm run deploy
  
# ENJOY
