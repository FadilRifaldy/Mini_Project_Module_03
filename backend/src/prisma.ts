import {PrismaClient} from "../src/generated/prisma"

const prisma = new PrismaClient({log:["info", "warn", "error"]})

export default prisma