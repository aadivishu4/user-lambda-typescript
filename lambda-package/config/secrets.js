"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbSecret = getDbSecret;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const secretsClient = new client_secrets_manager_1.SecretsManagerClient({});
let cachedSecret;
async function getDbSecret() {
    if (cachedSecret) {
        return cachedSecret;
    }
    const response = await secretsClient.send(new client_secrets_manager_1.GetSecretValueCommand({
        SecretId: process.env.DB_SECRET_ARN,
    }));
    if (!response.SecretString) {
        throw new Error("Database secret is empty");
    }
    const secret = JSON.parse(response.SecretString);
    if (!secret.username || !secret.password) {
        throw new Error("Database secret is missing username or password");
    }
    cachedSecret = secret;
    return secret;
}
//# sourceMappingURL=secrets.js.map