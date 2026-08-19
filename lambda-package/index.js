"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const postgres_js_1 = require("./database/postgres.js");
const handler = async (event) => {
    console.log("Request:", JSON.stringify({
        method: event.requestContext.http.method,
        path: event.rawPath,
        requestId: event.requestContext.requestId,
    }));
    try {
        const db = await (0, postgres_js_1.getDb)();
        const result = await db.query(`
      SELECT
        NOW() AS current_time,
        version() AS postgres_version
    `);
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                success: true,
                message: "TypeScript Lambda connected to PostgreSQL",
                database: result.rows[0],
            }),
        };
    }
    catch (error) {
        console.error("Application error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                success: false,
                message: "Internal server error",
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=index.js.map