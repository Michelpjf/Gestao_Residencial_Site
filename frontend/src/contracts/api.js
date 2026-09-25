/* Fonte de verdade dos Contratos persistidos e documentos gerados no backend. */
(function exposeContractsApi(globalObject) {
    'use strict';

    function dataFrom(payload) {
        if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'data')) {
            throw new globalObject.ApiError('Invalid contracts response.', { code: 'INVALID_CONTRACTS_RESPONSE' });
        }
        return payload.data;
    }

    function createContractsApi(client) {
        return Object.freeze({
            async list() {
                const contracts = dataFrom(await client.get('/contracts'));
                if (!Array.isArray(contracts)) throw new globalObject.ApiError('Invalid contracts list.', { code: 'INVALID_CONTRACTS_RESPONSE' });
                return contracts;
            },
            async get(id) { return dataFrom(await client.get(`/contracts/${id}`)); },
            async create({ tenantId, rentAmount, termMonths, startDate, endDate }) {
                return dataFrom(await client.post('/contracts', { tenantId, rentAmount, termMonths, startDate, endDate }));
            },
            download: (id) => client.getBlob(`/contracts/${id}/document`),
        });
    }

    function createContractsStore(api) {
        let contracts = [];
        let version = 0;
        return Object.freeze({
            getAll: () => contracts.slice(),
            async refresh() { const requestVersion = ++version; const fetched = await api.list(); if (requestVersion === version) contracts = fetched; return contracts.slice(); },
            get: (id) => api.get(id),
            download: (id) => api.download(id),
            async create(input) { await api.create(input); return this.refresh(); },
            clear() { ++version; contracts = []; },
        });
    }

    globalObject.createContractsApi = createContractsApi;
    globalObject.createContractsStore = createContractsStore;
    globalObject.contractsStore = createContractsStore(createContractsApi(globalObject.apiClient));
})(window);
