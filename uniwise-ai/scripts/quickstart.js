#!/usr/bin/env node

/**
 * Quick Start Script for UNIWISE AI
 * 
 * This script helps you get started quickly by:
 * 1. Checking prerequisites
 * 2. Setting up environment variables
 * 3. Creating the database
 * 4. Running migrations
 * 5. Seeding data
 */

const fs = require('fs')
const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function exec(command) {
  try {
    execSync(command, { stdio: 'inherit' })
    return true
  } catch (error) {
    return false
  }
}

async function main() {
  console.log('\n🎓 UNIWISE AI - Quick Start Setup\n')

  // Check if .env exists
  if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file from template...\n')
    fs.copyFileSync('.env.example', '.env')
    
    console.log('⚠️  Please edit .env file with your credentials:\n')
    console.log('   - DATABASE_URL')
    console.log('   - OPENAI_API_KEY')
    console.log('   - STRIPE keys')
    console.log('   - ADMIN credentials\n')
    
    const proceed = await question('Have you updated .env? (y/n): ')
    if (proceed.toLowerCase() !== 'y') {
      console.log('Please update .env and run this script again.')
      process.exit(0)
    }
  }

  // Install dependencies
  console.log('\n📦 Installing dependencies...\n')
  if (!exec('npm install')) {
    console.error('❌ Failed to install dependencies')
    process.exit(1)
  }

  // Generate Prisma client
  console.log('\n🔧 Generating Prisma client...\n')
  if (!exec('npx prisma generate')) {
    console.error('❌ Failed to generate Prisma client')
    process.exit(1)
  }

  // Push database schema
  console.log('\n🗄️  Setting up database...\n')
  if (!exec('npx prisma db push')) {
    console.error('❌ Failed to setup database')
    console.log('\n💡 Make sure PostgreSQL is running and DATABASE_URL is correct')
    process.exit(1)
  }

  // Seed database
  const seedChoice = await question('\n🌱 Do you want to seed the database with sample data? (y/n): ')
  if (seedChoice.toLowerCase() === 'y') {
    console.log('\n⏳ Seeding database (this may take 5-10 minutes)...\n')
    if (!exec('npm run db:seed')) {
      console.error('❌ Failed to seed database')
      process.exit(1)
    }
  }

  console.log('\n✅ Setup complete!\n')
  console.log('🚀 Run the development server:\n')
  console.log('   npm run dev\n')
  console.log('📚 Visit http://localhost:3000\n')
  console.log('👨‍💼 Admin login: Use credentials from your .env file\n')

  rl.close()
}

main().catch(console.error)
