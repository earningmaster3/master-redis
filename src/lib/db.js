import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaNeon } from '@prisma/adapter-neon'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined. Please check your .env file.')
}

const adapter = new PrismaNeon({ connectionString })

export const prisma = new PrismaClient({ adapter })
