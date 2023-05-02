import express from "express";
import cors from "cors";
import { setupRoutes } from "./routes";
import { prisma } from "./database/db";
import  bodyParser from "body-parser";
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
    const app = express();
    const port = 3000;
    app.use(cors());
    app.use(bodyParser.json())
    setupRoutes(app);

    app.listen(port, async () => {
        console.log(`🚀 Projeto rodando no endereço: http://127.0.0.1:${port}`);

        try {
            await prisma.$connect();
            console.log(`😄 Conectado com sucesso à base de dados!`);
        } catch (error) {
            console.log(`😕 Aconteceu um erro ao tentar conectar à base de dados.`);
        }

    });

}

main().catch((error) => {
    console.log("🥵 Erro!");
    console.log(error);
});