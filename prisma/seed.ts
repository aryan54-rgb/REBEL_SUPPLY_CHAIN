import { PrismaClient } from '@prisma/client'
import { suppliers, edges } from '../lib/mockData'

const prisma = new PrismaClient()

async function main() {
    console.log('Clearing database...')
    await prisma.edge.deleteMany()
    await prisma.node.deleteMany()

    console.log('Seeding nodes...')
    for (const node of suppliers) {
        await prisma.node.create({
            data: {
                id: node.id,
                name: node.name,
                type: node.type,
                tier: node.tier,
                lat: node.lat,
                lon: node.lon,
            }
        })
    }

    console.log('Seeding edges...')
    for (const edge of edges) {
        await prisma.edge.create({
            data: {
                // We use the ID from mockData if it exists, otherwise Prisma generates one
                id: edge.id,
                source: edge.source,
                target: edge.target,
            }
        })
    }

    console.log('Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
