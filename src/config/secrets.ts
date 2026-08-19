import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

interface DatabaseSecret {
  username: string;
  password: string;
}

const secretsClient = new SecretsManagerClient({});

let cachedSecret: DatabaseSecret | undefined;

export async function getDbSecret(): Promise<DatabaseSecret> {
  if (cachedSecret) {
    return cachedSecret;
  }

  const response = await secretsClient.send(
    new GetSecretValueCommand({
      SecretId: process.env.DB_SECRET_ARN,
    }),
  );

  if (!response.SecretString) {
    throw new Error("Database secret is empty");
  }

  const secret = JSON.parse(response.SecretString) as DatabaseSecret;

  if (!secret.username || !secret.password) {
    throw new Error("Database secret is missing username or password");
  }

  cachedSecret = secret;

  return secret;
}