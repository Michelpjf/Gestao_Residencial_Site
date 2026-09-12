/* Fonte de verdade dos residenciais persistidos no backend. */
(function exposeBuildingsApi(globalObject) {
    'use strict';

    function dataFrom(payload, operation) {
        if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'data')) {
            throw new globalObject.ApiError(`Invalid buildings response for ${operation}.`, {
                code: 'INVALID_BUILDINGS_RESPONSE',
            });
        }
        return payload.data;
    }

    function createBuildingsApi(client) {
        return Object.freeze({
            async list() {
                const buildings = dataFrom(await client.get('/buildings'), 'list');
                if (!Array.isArray(buildings)) {
                    throw new globalObject.ApiError('Invalid buildings list response.', {
                        code: 'INVALID_BUILDINGS_RESPONSE',
                    });
                }
                return buildings;
            },
            async create(name) {
                return dataFrom(await client.post('/buildings', { name }), 'create');
            },
            async update(id, name) {
                return dataFrom(await client.patch(`/buildings/${id}`, { name }), 'update');
            },
            async deactivate(id) {
                return dataFrom(await client.delete(`/buildings/${id}`), 'deactivate');
            },
        });
    }

    function createBuildingsStore(api) {
        let buildings = [];

        async function refresh() {
            buildings = await api.list();
            return buildings.slice();
        }

        return Object.freeze({
            getAll: () => buildings.slice(),
            refresh,
            async create(name) {
                await api.create(name);
                return refresh();
            },
            async update(id, name) {
                await api.update(id, name);
                return refresh();
            },
            async deactivate(id) {
                await api.deactivate(id);
                return refresh();
            },
        });
    }

    globalObject.createBuildingsApi = createBuildingsApi;
    globalObject.createBuildingsStore = createBuildingsStore;
    globalObject.buildingsStore = createBuildingsStore(createBuildingsApi(globalObject.apiClient));
})(window);
