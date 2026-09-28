import express from 'express';
import { requireRoles } from '../../middleware/authorize.js';
import { parseManagerAssignment, parseManagerUserId } from './admin-access.schema.js';

export function createAdminAccessRouter({ authenticate, adminAccessService }) {
  const router = express.Router();
  router.use(authenticate, requireRoles('admin'));

  router.get('/manager-assignments', async (_req, res) => {
    const assignments = await adminAccessService.listManagers();
    res.status(200).json({ data: assignments });
  });

  router.patch('/manager-assignments/:userId', async (req, res) => {
    const assignment = await adminAccessService.assignManager(
      parseManagerUserId(req.params.userId),
      parseManagerAssignment(req.body),
      req.auth.userId,
    );
    res.status(200).json({ data: assignment });
  });

  return router;
}
