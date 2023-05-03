"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const Router_1 = require("./helpers/Router");
const TaskController_1 = __importDefault(require("./controllers/TaskController"));
const multer_1 = __importDefault(require("multer"));
function setupRoutes(app) {
    const router = new Router_1.Router(app);
    router.get("/", (req, res) => {
        res.json({ "msg": "🚀 Aplicação rodando com sucesso!" });
    });
    const upload = (0, multer_1.default)({
        limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Favor enviar uma imagem válida!'));
            }
            cb(null, true);
        }
    });
    app.post("/send-file", upload.single('file'), TaskController_1.default.sendFile);
    router.group("/tasks", (router) => {
        router.get("/", TaskController_1.default.index);
        router.post("/", TaskController_1.default.create);
        router.get("/:id", TaskController_1.default.show);
        router.put("/:id", TaskController_1.default.update);
        router.delete("/:id", TaskController_1.default.delete);
    });
}
exports.setupRoutes = setupRoutes;
