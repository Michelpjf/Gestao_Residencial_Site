import express from 'express';
import { requireRoles } from '../../middleware/authorize.js';
import { parseContractId, parseContractInput } from './contracts.schema.js';

const readers = ['admin', 'gerente', 'gestor', 'financeiro'];
const writers = ['admin', 'gerente', 'gestor'];
const docxType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function createContractsRouter({ authenticate, contractService }) {
  const router = express.Router();
  router.use(authenticate);

  router.get('/', requireRoles(...readers), async (req, res) => {
    res.status(200).json({ data: await contractService.list(req.auth) });
  });

  router.post('/', requireRoles(...writers), async (req, res) => {
    const contract = await contractService.create(parseContractInput(req.body), req.auth);
    res.location(`/api/contracts/${contract.id}`).status(201).json({ data: contract });
  });

  router.get('/:contractId/document', requireRoles(...readers), async (req, res) => {
    const document = await contractService.document(parseContractId(req.params.contractId), req.auth);
    res.set({
      'Cache-Control': 'no-store',
      'Content-Type': docxType,
      'Content-Disposition': `attachment; filename="${document.filename}"`,
    }).status(200).send(document.buffer);
  });

  router.get('/:contractId', requireRoles(...readers), async (req, res) => {
    res.status(200).json({ data: await contractService.get(parseContractId(req.params.contractId), req.auth) });
  });

  return router;
}
