import express from 'express';
import { requireRoles } from '../../middleware/authorize.js';
import { requireBuildingAccess } from '../../middleware/building-scope.js';
import { parseBuildingId } from '../buildings/buildings.schema.js';
import { parseUnitId, parseUnitInput } from './units.schema.js';

const readers = ['admin', 'gerente', 'gestor', 'financeiro', 'manutencao'];

export function createUnitsRouter({ authenticate, unitService }) {
  const router = express.Router();
  router.use(authenticate);

  router.get('/buildings/:buildingId/units', requireRoles(...readers), requireBuildingAccess(), async (req, res) => {
    res.status(200).json({ data: await unitService.list(parseBuildingId(req.params.buildingId), req.auth) });
  });

  router.post('/buildings/:buildingId/units', requireRoles('admin', 'gerente'), async (req, res) => {
    const unit = await unitService.create(parseBuildingId(req.params.buildingId), parseUnitInput(req.body));
    res.location(`/api/units/${unit.id}`).status(201).json({ data: unit });
  });

  router.get('/units/:unitId', requireRoles(...readers), async (req, res) => {
    res.status(200).json({ data: await unitService.get(parseUnitId(req.params.unitId), req.auth) });
  });

  return router;
}
