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
const TaskRepository_1 = __importDefault(require("../repositories/TaskRepository"));
class TaskService {
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return TaskRepository_1.default.getTasks();
        });
    }
    createTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            return TaskRepository_1.default.createTask(task);
        });
    }
    getTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return TaskRepository_1.default.getTask(id);
        });
    }
    updateTask(id, title, description, userId, taskStatusId) {
        return __awaiter(this, void 0, void 0, function* () {
            return TaskRepository_1.default.updateTask(id, title, description, userId, taskStatusId);
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return TaskRepository_1.default.deleteTask(id);
        });
    }
}
exports.default = new TaskService();
