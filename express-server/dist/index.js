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
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
const port = 3000;
const client = (0, redis_1.createClient)();
app.use(express_1.default.json({ limit: "16kb" }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const redislearn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, language } = req.body;
    if (!problemId || !code || !language) {
        return res.status(400).json({ error: "Missing required fields." });
    }
    try {
        yield client.lPush("submissions", JSON.stringify({ code, language, problemId }));
        res.status(200).send("Submission received and stored.");
    }
    catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
});
//@ts-ignore
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, language } = req.body;
    if (!problemId || !code || !language) {
        return res.status(400).json({ error: "Missing required fields." });
    }
    try {
        yield client.lPush("submissions", JSON.stringify({ code, language, problemId }));
        res.status(200).send("Submission received and stored.");
    }
    catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Redis connected");
            app.listen(port, () => {
                console.log(`App listening on port ${port}`);
            });
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startServer();
