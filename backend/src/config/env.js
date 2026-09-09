import { z } from 'zod';

const booleanString = (defaultValue) =>
  z
    .preprocess((value) => value ?? defaultValue, z.enum(['true', 'false']))
    .transform((value) => value === 'true');

const trustProxy = z
  .union([z.literal('false'), z.coerce.number().int().min(0)])
  .default('false')
  .transform((value) => (value === 'false' ? false : value));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  TRUST_PROXY: trustProxy,
  DATABASE_URL: z.string().min(1),
  DATABASE_SSL: booleanString('false'),
  DATABASE_SSL_REJECT_UNAUTHORIZED: booleanString('true'),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),
  SUPABASE_URL: z.url().refine((value) => value.startsWith('https://'), {
    message: 'SUPABASE_URL must use HTTPS',
  }),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_JWT_AUDIENCE: z.string().min(1).default('authenticated'),
});

export function loadConfig(environment = process.env) {
  const result = envSchema.safeParse(environment);

  if (!result.success) {
    const fields = result.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`Invalid environment configuration: ${fields}`);
  }

  return Object.freeze({
    nodeEnv: result.data.NODE_ENV,
    port: result.data.PORT,
    trustProxy: result.data.TRUST_PROXY,
    database: Object.freeze({
      connectionString: result.data.DATABASE_URL,
      poolMax: result.data.DATABASE_POOL_MAX,
      ssl: result.data.DATABASE_SSL
        ? { rejectUnauthorized: result.data.DATABASE_SSL_REJECT_UNAUTHORIZED }
        : false,
    }),
    supabase: Object.freeze({
      url: result.data.SUPABASE_URL.replace(/\/$/, ''),
      publishableKey: result.data.SUPABASE_PUBLISHABLE_KEY,
      audience: result.data.SUPABASE_JWT_AUDIENCE,
    }),
  });
}
