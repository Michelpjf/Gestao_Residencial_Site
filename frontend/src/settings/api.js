/* API administrativa para vínculos persistidos de Gestores. */
(function exposeSettingsApi(globalObject) {
    'use strict';

    function dataFrom(payload, operation) {
        if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'data')) {
            throw new globalObject.ApiError(`Invalid manager assignments response for ${operation}.`, {
                code: 'INVALID_MANAGER_ASSIGNMENTS_RESPONSE',
            });
        }
        return payload.data;
    }

    function createSettingsAssignmentsApi(client) {
        return Object.freeze({
            async list() {
                const assignments = dataFrom(await client.get('/admin/manager-assignments'), 'list');
                if (!Array.isArray(assignments)) {
                    throw new globalObject.ApiError('Invalid manager assignments list.', {
                        code: 'INVALID_MANAGER_ASSIGNMENTS_RESPONSE',
                    });
                }
                return assignments;
            },
            async update(userId, assignment) {
                return dataFrom(
                    await client.patch(`/admin/manager-assignments/${userId}`, assignment),
                    'update',
                );
            },
        });
    }

    globalObject.createSettingsAssignmentsApi = createSettingsAssignmentsApi;
    globalObject.settingsAssignmentsApi = createSettingsAssignmentsApi(globalObject.apiClient);
})(window);
