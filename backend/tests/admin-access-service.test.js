import { describe, expect, it, vi } from 'vitest';
import { createAdminAccessService } from '../src/modules/admin-access/admin-access.service.js';

describe('admin access service', () => {
  it('fails closed when the active manager or residential does not exist', async () => {
    const repository = { assignManager: vi.fn().mockResolvedValue(null) };
    const service = createAdminAccessService(repository);

    await expect(service.assignManager('manager', { displayName: 'Gestor', buildingId: 'building' }, 'admin'))
      .rejects.toMatchObject({ status: 404, code: 'MANAGER_OR_BUILDING_NOT_FOUND' });
  });
});
