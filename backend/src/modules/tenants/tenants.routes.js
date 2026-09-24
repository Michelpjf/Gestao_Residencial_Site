import express from 'express';
import { requireRoles } from '../../middleware/authorize.js';
import { parseTenantId, parseTenantInput } from './tenants.schema.js';

const permitted = ['admin', 'gerente', 'gestor'];

export function createTenantsRouter({ authenticate, tenantService }) {
  const router = express.Router();
  router.use(authenticate, requireRoles(...permitted));

  router.get('/', async (req, res) => {
    res.status(200).json({ data: await tenantService.list(req.auth) });
  });

  router.post('/', async (req, res) => {
    const tenant = await tenantService.create(parseTenantInput(req.body), req.auth);
    res.location(`/api/tenants/${tenant.id}`).status(201).json({ data: tenant });
  });

  router.get('/:tenantId', async (req, res) => {
    res.status(200).json({ data: await tenantService.get(parseTenantId(req.params.tenantId), req.auth) });
  });

  return router;
}
