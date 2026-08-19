"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const pg_1 = __importDefault(require("pg"));
const secrets_js_1 = require("../config/secrets.js");
const { Pool } = pg_1.default;
let pool;
async function getDb() {
    if (pool) {
        return pool;
    }
    const secret = await (0, secrets_js_1.getDbSecret)();
    pool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME,
        user: secret.username,
        password: secret.password,
        max: 2,
        idleTimeoutMillis: 10_000,
        connectionTimeoutMillis: 5_000,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    return pool;
}
//# sourceMappingURL=postgres.js.map