import { Task } from "@prisma/client";
import TaskRepository from "../repositories/TaskRepository";


class TaskService {
    
    async getTasks(): Promise<Array<Task>> {
        return TaskRepository.getTasks();
    }

    async createTask(task: Task): Promise<Task | string > {
        return TaskRepository.createTask(task);
    }

    async getTask(id: string): Promise<Task | null> {        
        return TaskRepository.getTask(id);
    }

    async updateTask(id: string, title: string | null, description: string | null, userId: string | null, taskStatusId: string | null): Promise<Task | string > {        
        return TaskRepository.updateTask(id, title, description, userId, taskStatusId);
    }

    async deleteTask(id: string): Promise<Task | string> {        
        return TaskRepository.deleteTask(id);
    }

}

export default new TaskService();