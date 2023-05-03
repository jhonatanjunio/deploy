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
const db_1 = require("../src/database/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.prisma.taskStatus.upsert({
            where: { title: "TODO" },
            update: {},
            create: {
                title: "TODO"
            }
        });
        yield db_1.prisma.taskStatus.upsert({
            where: { title: "DOING" },
            update: {},
            create: {
                title: "DOING"
            }
        });
        yield db_1.prisma.taskStatus.upsert({
            where: { title: "DONE" },
            update: {},
            create: {
                title: "DONE"
            }
        });
        const salt = bcrypt_1.default.genSaltSync(10);
        yield db_1.prisma.user.upsert({
            where: {
                email: "admin@gmail.com",
            },
            update: {},
            create: {
                name: "Admin",
                email: "admin@gmail.com",
                password: bcrypt_1.default.hashSync("123456789", salt)
            }
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield db_1.prisma.$disconnect();
    process.exit(1);
}));
