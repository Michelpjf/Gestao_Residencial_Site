import express from 'express';
import { requireRoles } from '../../middleware/authorize.js';
import { parseBuildingId, parseBuildingInput } from './buildings.schema.js';

const businessRoles = ['admin', 'gerente', 'gestor', 'financeiro', 'manutencao'];

export function createBuildingsRouter({ authenticate, buildingService }) {
  const router = express.Router();
  router.use(authenticate);

  router.get('/', requireRoles(...businessRoles), async (req, res) => {
    const buildings = await buildingService.list(req.auth);
    res.status(200).json({ data: buildings });
  });

  router.post('/', requireRoles('admin', 'gerente'), async (req, res) => {
    const building = await buildingService.create(parseBuildingInput(req.body));
    res.location(`/api/buildings/${building.id}`).status(201).json({ data: building });
  });

  router.patch('/:buildingId', requireRoles('admin', 'gerente'), async (req, res) => {
    const id = parseBuildingId(req.params.buildingId);
    const building = await buildingService.update(id, parseBuildingInput(req.body));
    res.status(200).json({ data: building });
  });

  router.delete('/:buildingId', requireRoles('admin'), async (req, res) => {
    const building = await buildingService.deactivate(parseBuildingId(req.params.buildingId));
    res.status(200).json({ data: building });
  });

  return router;
}
