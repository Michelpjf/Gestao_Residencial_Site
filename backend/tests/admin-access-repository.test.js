import { describe, expect, it, vi } from 'vitest';
import { createAdminAccessRepository } from '../src/modules/admin-access/admin-access.repository.js';

const row = {
  user_id: '79b54647-32b5-4fe8-ab2d-b89d808d57b4',
  display_name: 'Gestor Bueno',
  building_id: '0f99b81d-9cf1-4cfa-9331-e397fb02044d',
  building_name: 'Residencial Bueno',
  updated_at: '2026-09-28T00:00:00.000Z',
};

describe('admin access repository', () => {
  it('lists only active Gestores with active persisted buildings', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row] });
    const result = await createAdminAccessRepository({ query }).listActiveManagers();

    expect(result).toEqual([{
      userId: row.user_id,
      displayName: row.display_name,
      building: { id: row.building_id, name: row.building_name },
      updatedAt: row.updated_at,
    }]);
    expect(query.mock.calls[0][0]).toContain("p.role = 'gestor'");
    expect(query.mock.calls[0][0]).toContain('b.active = TRUE');
  });

  it('updates scope and writes the audit record in one SQL statement', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row] });
    const repository = createAdminAccessRepository({ query });
    await repository.assignManager({
      actorUserId: '3f185149-f16e-47a8-8ac3-2c29190f2b50',
      managerUserId: row.user_id,
      displayName: row.display_name,
      buildingId: row.building_id,
    });

    expect(query.mock.calls[0][0]).toContain('INSERT INTO manager_assignment_audit');
    expect(query.mock.calls[0][0]).toContain("role = 'gestor'");
    expect(query.mock.calls[0][1]).toEqual([
      '3f185149-f16e-47a8-8ac3-2c29190f2b50',
      row.user_id,
      row.display_name,
      row.building_id,
    ]);
  });
});
