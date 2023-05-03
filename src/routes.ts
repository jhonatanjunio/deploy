import { Application, Request, Response } from "express";
import { Router } from "./helpers/Router";
import TaskController from "./controllers/TaskController";
import multer from 'multer';

export function setupRoutes(app: Application) {
    const router = new Router(app);
    
    router.get("/", (req: Request, res: Response) => {
        res.json({"msg": "🚀 Aplicação rodando com sucesso!"});
    });

    const upload = multer({ 
        limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Favor enviar uma imagem válida!'))
            }
            cb(null, true)
        }
    });

    app.post("/send-file", upload.single('file'), TaskController.sendFile);
    app.get("/healthz", function(req: Request, res: Response) {
        res.status(200).json({"msg":"Servidor OK!"});
    });

    router.group("/tasks", (router) => {        
        router.get("/", TaskController.index);
        router.post("/", TaskController.create);
        router.get("/:id", TaskController.show);
        router.put("/:id", TaskController.update);
        router.delete("/:id", TaskController.delete)
    })

}