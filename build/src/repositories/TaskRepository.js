"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../database/db");
class TaskRepository {
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prisma.task.findMany({
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
        });
    }
    createTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!task.userId)
                return "✖️ É obrigatório informar o dono desta tarefa.";
            const findDuplicateTask = yield db_1.prisma.task.count({
                where: {
                    title: task.title,
                    description: task.description,
                    userId: task.userId
                }
            });
            if (findDuplicateTask)
                return "✖️ A tarefa não pode ser criada, porque já existe uma tarefa com as mesmas informações.";
            if (task.taskStatusId) {
                const findTaskStatusById = yield db_1.prisma.taskStatus.count({ where: { id: task.taskStatusId } });
                if (!findTaskStatusById)
                    return "✖️ Status de tarefa informado não existe";
            }
            const findUserById = yield db_1.prisma.user.count({ where: { id: task.userId } });
            if (!findUserById)
                return "✖️ Usuário informado não existe";
            return yield db_1.prisma.task.create({
                data: {
                    title: task.title,
                    description: task.description,
                    user: { connect: { id: task.userId } },
                    taskStatus: { connect: { id: task.taskStatusId } }
                }
            });
        });
    }
    getTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prisma.task.findFirst({ where: { id } });
        });
    }
    updateTask(id, title, description, userId, taskStatusId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findById = yield db_1.prisma.task.findFirst({
                where: { id }
            });
            if (!findById)
                return "✖️ Tarefa não encontrada para o ID informado!";
            if (taskStatusId) {
                const findTaskStatusById = yield db_1.prisma.taskStatus.count({ where: { id: taskStatusId } });
                if (!findTaskStatusById)
                    return "✖️ Novo status de tarefa informado não existe";
            }
            if (userId) {
                const findUserById = yield db_1.prisma.user.count({ where: { id: userId } });
                if (!findUserById)
                    return "✖️ Usuário informado não existe";
            }
            const payload = {
                title: title || findById.title,
                description: description || findById.description,
                userId: userId || findById.userId,
                taskStatusId: taskStatusId || findById.taskStatusId
            };
            return yield db_1.prisma.task.update({
                where: {
                    id,
                },
                data: payload
            });
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findById = yield db_1.prisma.task.count({
                where: { id }
            });
            if (!findById)
                return "✖️ Tarefa não encontrada para o ID informado!";
            return yield db_1.prisma.task.delete({
                where: {
                    id
                }
            });
        });
    }
}
exports.default = new TaskRepository();
