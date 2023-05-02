import { prisma } from "../src/database/db"
import bcrypt from "bcrypt";

async function main() {

    await prisma.taskStatus.upsert({
        where: { title: "TODO" },
        update: {},
        create: {
            title: "TODO"
        }
    });

    await prisma.taskStatus.upsert({
        where: { title: "DOING" },
        update: {},
        create: {
            title: "DOING"
        }
    });

    await prisma.taskStatus.upsert({
        where: { title: "DONE" },
        update: {},
        create: {
            title: "DONE"
        }
    });

    const salt = bcrypt.genSaltSync(10);
    

    
    await prisma.user.upsert({
        where: { 
            email: "admin@gmail.com",
        },
        update: {},
        create: {
            name: "Admin",
            email: "admin@gmail.com",
            password: bcrypt.hashSync("123456789", salt)
        }
    });    
    

 
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
  })