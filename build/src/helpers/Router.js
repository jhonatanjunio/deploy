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
exports.Router = void 0;
class Router {
    constructor(app, base = "") {
        this.app = app;
        this.base = base;
    }
    handle(handler) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = yield handler(req, res, next);
            return data && this.isSerializable(data) ? res.json(data) : res.send();
        });
    }
    isSerializable(obj) {
        try {
            JSON.parse(JSON.stringify(obj));
            return true;
        }
        catch (error) {
            return false;
        }
    }
    group(base, callback) {
        callback(new Router(this.app, this.base + base));
        return this;
    }
    get(path, handler) {
        this.app.get(this.base + path, this.handle(handler));
        return this;
    }
    post(path, handler) {
        this.app.post(this.base + path, this.handle(handler));
        return this;
    }
    put(path, handler) {
        this.app.put(this.base + path, this.handle(handler));
        return this;
    }
    delete(path, handler) {
        this.app.delete(this.base + path, this.handle(handler));
        return this;
    }
    patch(path, handler) {
        this.app.patch(this.base + path, this.handle(handler));
        return this;
    }
    middleware(...middlewares) {
        this.app.use(this.base, ...middlewares);
        return this;
    }
}
exports.Router = Router;
