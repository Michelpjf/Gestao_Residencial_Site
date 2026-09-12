import { z } from 'zod';

const booleanString = (defaultValue) =>
  z
    .preprocess((value) => value ?? defaultValue, z.enum(['true', 'false']))
    .transform((value) => value === 'true');

const trustProxy = z
  .union([z.literal('false'), z.coerce.number().int().min(0)])
  .default('false')
  .transform((value) => (value === 'false' ? false : value));

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_SSL: booleanString('false'),
  DATABASE_SSL_REJECT_UNAUTHORIZED: booleanString('true'),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),
});

const envSchema = databaseEnvSchema.extend({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  TRUST_PROXY: trustProxy,
  SUPABASE_URL: z.url().refine((value) => value.startsWith('https://'), {
    message: 'SUPABASE_URL must use HTTPS',
  }),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_JWT_AUDIENCE: z.string().min(1).default('authenticated'),
});

function invalidEnvironmentError(result) {
  const fields = result.error.issues.map((issue) => issue.path.join('.')).join(', ');
  return new Error(`Invalid environment configuration: ${fields}`);
}

function toDatabaseConfig(data) {
  return Object.freeze({
    connectionString: data.DATABASE_URL,
    poolMax: data.DATABASE_POOL_MAX,
    ssl: data.DATABASE_SSL
      ? { rejectUnauthorized: data.DATABASE_SSL_REJECT_UNAUTHORIZED }
      : false,
  });
}

export function loadDatabaseConfig(environment = process.env) {
  const result = databaseEnvSchema.safeParse(environment);
  if (!result.success) throw invalidEnvironmentError(result);
  return toDatabaseConfig(result.data);
}

export function loadConfig(environment = process.env) {
  const result = envSchema.safeParse(environment);

  if (!result.success) throw invalidEnvironmentError(result);

  return Object.freeze({
    nodeEnv: result.data.NODE_ENV,
    port: result.data.PORT,
    trustProxy: result.data.TRUST_PROXY,
    database: toDatabaseConfig(result.data),
    supabase: Object.freeze({
      url: result.data.SUPABASE_URL.replace(/\/$/, ''),
      publishableKey: result.data.SUPABASE_PUBLISHABLE_KEY,
      audience: result.data.SUPABASE_JWT_AUDIENCE,
    }),
  });
}
