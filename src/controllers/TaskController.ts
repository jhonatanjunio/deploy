import { Request, Response } from "express";
import TaskService from "../services/TaskService";
import { Task } from "@prisma/client";
import sharp from 'sharp';
import { prisma } from "../database/db";


class TaskController {

    static async index(req: Request, res: Response) {
        try {
            const tasks = await TaskService.getTasks();

            return res.json({
                success: true,
                result: tasks
            });
            
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "✖️ Ops, deu ruim!" });
        }
    }

    static async create(req: Request, res: Response) {

        try {

            const { title, description, userId, taskStatusId } = req.body;

            if (!title || !description || !userId || !taskStatusId) {
                return res
                    .status(500)
                    .json({ success: false, message: "✖️ Você precisa informar todos os campos necessários para criação de uma tarefa" });
            }

            const task: Task | string = await TaskService.createTask({
                title,
                description,
                userId,
                taskStatusId
            } as Task);

            if (typeof task === 'string') return res.status(500).json({
                success: false,
                message: task
            });

            return res.json({
                success: true,
                message: "Tarefa criada com sucesso!",
                result: task
            });

        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "✖️ Ops, deu ruim!" });
        }

    }

    static async show(req: Request, res: Response) {
        try {

            const { id } = req.params;

            const checkTaskId = TaskController.checkTaskId(id);
            if (!checkTaskId?.success) return res.status(500).json(checkTaskId);

            const task = await TaskService.getTask(id);

            if (!task) return res
                .status(404)
                .json({ success: false, message: "✖️ Tarefa não encontrada para o ID informado!" });

            return res.json({
                success: true,
                result: task
            });

        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "✖️ Ops, deu ruim!" });
        }
    }

    static async update(req: Request, res: Response) {

        try {
            const { id } = req.params;

            const checkTaskId = TaskController.checkTaskId(id);
            if (!checkTaskId?.success) return res.status(500).json(checkTaskId?.message);

            const { title, description, userId, taskStatusId } = req.body;

            if (!title && !description && !userId && !taskStatusId) return res
                .status(500)
                .json({ success: false, message: "✖️ Você precisa informar pelo menos um campo para ser atualizado na tarefa" });

            const task: Task | string = await TaskService.updateTask(id, title, description, userId, taskStatusId);

            if (typeof task === 'string') return res
                .status(404)
                .json({ success: false, message: task });

            return res.json({
                success: true,
                message: "Tarefa atualizada com sucesso!",
                result: task
            });

        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "✖️ Ops, deu ruim!" });
        }

    }

    static async delete(req: Request, res: Response) {

        try {

            const { id } = req.params;

            const checkTaskId = TaskController.checkTaskId(id);
            if (!checkTaskId?.success) return res.status(500).json(checkTaskId);

            const task = await TaskService.deleteTask(id);

            if (typeof task === 'string') return res
                .status(404)
                .json({ success: false, message: task });

            return res.json({
                success: true,
                message: "✅ Tarefa apagada com sucesso!"
            });

        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "✖️ Ops, deu ruim!" });
        }

    }

    static async sendFile(req: Request, res: Response){

        if (!req.file) return res.status(500).json({ message: "É obrigatório o envio de uma imagem "});

        await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toFile(`./uploads/${req.file.originalname}`);        

        return res.json({ message: "Arquivo enviado com sucesso"});

    }

    static checkTaskId(id: string) {

        if (!id) return { success: false, message: "✖️ É obrigatório informar o ID da tarefa!" };
        // if (isNaN(id)) return { success: false, message: "✖️ O ID precisa ser um número!" };

        return { success: true };

    }

}

export default TaskController;