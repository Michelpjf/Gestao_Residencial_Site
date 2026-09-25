/* Acesso ao relatório essencial persistido. */
(function exposeDashboardApi(globalObject) {
    'use strict';

    async function getEssentialReport() {
        const response = await globalObject.apiClient.get('/reports/essential');
        if (!response || !response.data || !response.data.summary || !Array.isArray(response.data.rows)) {
            throw new globalObject.ApiError('A API retornou um relatório inválido.', {
                code: 'INVALID_REPORT_RESPONSE'
            });
        }
        return response.data;
    }

    globalObject.dashboardApi = Object.freeze({ getEssentialReport });
})(window);
