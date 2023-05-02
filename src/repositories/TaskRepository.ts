import { Task } from "@prisma/client";
import { prisma } from "../database/db";


class TaskRepository {

    async getTasks(): Promise<Array<Task>> {
        return await prisma.task.findMany({
            include: {
                user: {
                    select: {
                        email: true
                    }
                },
                taskStatus: {
                    select: {
                        title: true
                    }
                }
            }
        });
    }

    async createTask(task: Task): Promise< Task | string > {

        if (!task.userId) return "✖️ É obrigatório informar o dono desta tarefa.";

        const findDuplicateTask = await prisma.task.count({
            where: {
                title: task.title,
                description: task.description,
                userId: task.userId
            }
        });

        if (findDuplicateTask) return "✖️ A tarefa não pode ser criada, porque já existe uma tarefa com as mesmas informações.";        

        if (task.taskStatusId) {
            const findTaskStatusById = await prisma.taskStatus.count({ where: { id: task.taskStatusId }});
            if (!findTaskStatusById) return "✖️ Status de tarefa informado não existe";
        }
        
        const findUserById = await prisma.user.count({ where: { id: task.userId }});
        if (!findUserById) return "✖️ Usuário informado não existe";

        return await prisma.task.create({
            data: {
                title: task.title,
                description: task.description,
                user: { connect: { id: task.userId }},
                taskStatus: { connect: { id: task.taskStatusId }}
            }
        })
    }

    async getTask(id: string): Promise<Task | null> {
        return await prisma.task.findFirst({ where: { id } });
    }

    async updateTask(id: string, title: string | null, description: string | null, userId: string | null, taskStatusId: string | null): Promise<Task | string> {

        const findById = await prisma.task.findFirst({
            where: { id }
        });

        if (!findById) return "✖️ Tarefa não encontrada para o ID informado!";

        if (taskStatusId) {            
            const findTaskStatusById = await prisma.taskStatus.count({ where: { id: taskStatusId }});
            if (!findTaskStatusById) return "✖️ Novo status de tarefa informado não existe";            
        }

        if (userId) {            
            const findUserById = await prisma.user.count({ where: { id: userId }});
            if (!findUserById) return "✖️ Usuário informado não existe";            
        }

        const payload = {
            title: title || findById.title,
            description: description || findById.description,
            userId: userId || findById.userId,
            taskStatusId: taskStatusId || findById.taskStatusId
        }

        return await prisma.task.update({
            where: {
                id,
            },
            data: payload            
        });
    }

    async deleteTask(id: string): Promise<Task | string> {

        const findById = await prisma.task.count({
            where: { id }
        });

        if (!findById) return "✖️ Tarefa não encontrada para o ID informado!";

        return await prisma.task.delete({
            where: {
                id
            }
        });
    }
}

export default new TaskRepository();