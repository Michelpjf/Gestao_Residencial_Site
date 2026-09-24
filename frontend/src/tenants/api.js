/* Fonte de verdade dos Moradores persistidos no backend. */
(function exposeTenantsApi(globalObject) {
    'use strict';

    function dataFrom(payload) {
        if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'data')) {
            throw new globalObject.ApiError('Invalid tenants response.', { code: 'INVALID_TENANTS_RESPONSE' });
        }
        return payload.data;
    }

    function createTenantsApi(client) {
        return Object.freeze({
            async list() {
                const tenants = dataFrom(await client.get('/tenants'));
                if (!Array.isArray(tenants)) {
                    throw new globalObject.ApiError('Invalid tenants list.', { code: 'INVALID_TENANTS_RESPONSE' });
                }
                return tenants;
            },
            async get(id) { return dataFrom(await client.get(`/tenants/${id}`)); },
            async create(input) {
                const approved = {
                    unitId: input.unitId, fullName: input.fullName, cpf: input.cpf, rg: input.rg,
                    birthDate: input.birthDate, maritalStatus: input.maritalStatus,
                    addressGoiania: input.addressGoiania, addressOrigin: input.addressOrigin, phone: input.phone,
                    referenceOneName: input.referenceOneName, referenceOnePhone: input.referenceOnePhone,
                    referenceTwoName: input.referenceTwoName, referenceTwoPhone: input.referenceTwoPhone,
                    occupationInstitution: input.occupationInstitution || null,
                    commercialPhone: input.commercialPhone || null,
                    commercialAddress: input.commercialAddress || null,
                };
                return dataFrom(await client.post('/tenants', approved));
            },
        });
    }

    function createTenantsStore(api) {
        let tenants = [];
        let version = 0;
        return Object.freeze({
            getAll: () => tenants.slice(),
            async refresh() {
                const requestVersion = ++version;
                const fetched = await api.list();
                if (version === requestVersion) tenants = fetched;
                return tenants.slice();
            },
            get: (id) => api.get(id),
            async create(input) { await api.create(input); return this.refresh(); },
            clear() { ++version; tenants = []; },
        });
    }

    globalObject.createTenantsApi = createTenantsApi;
    globalObject.createTenantsStore = createTenantsStore;
    globalObject.tenantsStore = createTenantsStore(createTenantsApi(globalObject.apiClient));
})(window);
