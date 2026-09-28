import { AppError } from '../../errors/app-error.js';

export function createAdminAccessService(repository) {
  return Object.freeze({
    listManagers() {
      return repository.listActiveManagers();
    },

    async assignManager(managerUserId, input, actorUserId) {
      const assignment = await repository.assignManager({
        actorUserId,
        managerUserId,
        ...input,
      });
      if (!assignment) {
        throw new AppError(
          404,
          'MANAGER_OR_BUILDING_NOT_FOUND',
          'Active manager or residential was not found',
        );
      }
      return assignment;
    },
  });
}
