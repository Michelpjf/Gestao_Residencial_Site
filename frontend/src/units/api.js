/* Apenas os dados persistidos de Unidades; não sincronizar snapshots legados. */
(function exposeUnitsApi(globalObject) {
    'use strict';

    function dataFrom(payload) {
        if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'data')) {
            throw new globalObject.ApiError('Invalid units response.', { code: 'INVALID_UNITS_RESPONSE' });
        }
        return payload.data;
    }

    function createUnitsApi(client) {
        return Object.freeze({
            async list(buildingId) {
                const units = dataFrom(await client.get(`/buildings/${buildingId}/units`));
                if (!Array.isArray(units)) {
                    throw new globalObject.ApiError('Invalid units list.', { code: 'INVALID_UNITS_RESPONSE' });
                }
                return units;
            },
            async get(id) {
                return dataFrom(await client.get(`/units/${id}`));
            },
            async create(buildingId, { identification, subdivision, type }) {
                return dataFrom(await client.post(`/buildings/${buildingId}/units`, {
                    identification, subdivision: subdivision || null, type,
                }));
            },
        });
    }

    function createUnitsStore(api) {
        let units = [];
        let version = 0;
        return Object.freeze({
            getAll: () => units.slice(),
            async refresh(buildingId) {
                const requestVersion = ++version;
                const fetched = await api.list(buildingId);
                if (version === requestVersion) units = fetched;
                return units.slice();
            },
            get: (id) => api.get(id),
            async create(buildingId, input) {
                await api.create(buildingId, input);
                return this.refresh(buildingId);
            },
            clear() { ++version; units = []; },
        });
    }

    globalObject.createUnitsApi = createUnitsApi;
    globalObject.createUnitsStore = createUnitsStore;
    globalObject.unitsStore = createUnitsStore(createUnitsApi(globalObject.apiClient));
})(window);
