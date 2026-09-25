import express from 'express';
import { requireRoles } from '../../middleware/authorize.js';

const readers = ['admin', 'gerente', 'gestor', 'financeiro'];

export function createReportsRouter({ authenticate, reportService }) {
  const router = express.Router();
  router.use(authenticate);

  router.get('/essential', requireRoles(...readers), async (req, res) => {
    res.set('Cache-Control', 'no-store').status(200).json({
      data: await reportService.essential(req.auth),
    });
  });

  return router;
}
