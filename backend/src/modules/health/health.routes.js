import express from 'express';

export function createHealthRouter() {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return router;
}
