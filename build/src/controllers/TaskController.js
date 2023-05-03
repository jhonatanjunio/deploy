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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskService_1 = __importDefault(require("../services/TaskService"));
const sharp_1 = __importDefault(require("sharp"));
class TaskController {
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield TaskService_1.default.getTasks();
                return res.json({
                    success: true,
                    result: tasks
                });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ success: false, message: "✖️ Ops, deu ruim!" });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, userId, taskStatusId } = req.body;
                if (!title || !description || !userId || !taskStatusId) {
                    return res
                        .status(500)
                        .json({ success: false, message: "✖️ Você precisa informar todos os campos necessários para criação de uma tarefa" });
                }
                const task = yield TaskService_1.default.createTask({
                    title,
                    description,
                    userId,
                    taskStatusId
                });
                if (typeof task === 'string')
                    return res.status(500).json({
                        success: false,
                        message: task
                    });
                return res.json({
                    success: true,
                    message: "Tarefa criada com sucesso!",
                    result: task
                });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ success: false, message: "✖️ Ops, deu ruim!" });
            }
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkTaskId = TaskController.checkTaskId(id);
                if (!(checkTaskId === null || checkTaskId === void 0 ? void 0 : checkTaskId.success))
                    return res.status(500).json(checkTaskId);
                const task = yield TaskService_1.default.getTask(id);
                if (!task)
                    return res
                        .status(404)
                        .json({ success: false, message: "✖️ Tarefa não encontrada para o ID informado!" });
                return res.json({
                    success: true,
                    result: task
                });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ success: false, message: "✖️ Ops, deu ruim!" });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkTaskId = TaskController.checkTaskId(id);
                if (!(checkTaskId === null || checkTaskId === void 0 ? void 0 : checkTaskId.success))
                    return res.status(500).json(checkTaskId === null || checkTaskId === void 0 ? void 0 : checkTaskId.message);
                const { title, description, userId, taskStatusId } = req.body;
                if (!title && !description && !userId && !taskStatusId)
                    return res
                        .status(500)
                        .json({ success: false, message: "✖️ Você precisa informar pelo menos um campo para ser atualizado na tarefa" });
                const task = yield TaskService_1.default.updateTask(id, title, description, userId, taskStatusId);
                if (typeof task === 'string')
                    return res
                        .status(404)
                        .json({ success: false, message: task });
                return res.json({
                    success: true,
                    message: "Tarefa atualizada com sucesso!",
                    result: task
                });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ success: false, message: "✖️ Ops, deu ruim!" });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkTaskId = TaskController.checkTaskId(id);
                if (!(checkTaskId === null || checkTaskId === void 0 ? void 0 : checkTaskId.success))
                    return res.status(500).json(checkTaskId);
                const task = yield TaskService_1.default.deleteTask(id);
                if (typeof task === 'string')
                    return res
                        .status(404)
                        .json({ success: false, message: task });
                return res.json({
                    success: true,
                    message: "✅ Tarefa apagada com sucesso!"
                });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ success: false, message: "✖️ Ops, deu ruim!" });
            }
        });
    }
    static sendFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file)
                return res.status(500).json({ message: "É obrigatório o envio de uma imagem " });
            yield (0, sharp_1.default)(req.file.buffer).resize({ width: 250, height: 250 }).png().toFile(`./uploads/${req.file.originalname}`);
            return res.json({ message: "Arquivo enviado com sucesso" });
        });
    }
    static checkTaskId(id) {
        if (!id)
            return { success: false, message: "✖️ É obrigatório informar o ID da tarefa!" };
        // if (isNaN(id)) return { success: false, message: "✖️ O ID precisa ser um número!" };
        return { success: true };
    }
}
exports.default = TaskController;
