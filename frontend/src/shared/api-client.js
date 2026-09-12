/* Cliente HTTP compartilhado para a API do Bueno Residence. */
(function exposeApiClient(globalObject) {
    'use strict';

    const DEFAULT_TIMEOUT_MS = 10000;

    class ApiError extends Error {
        constructor(message, { code = 'API_ERROR', status = null, details = null, cause } = {}) {
            super(message, cause ? { cause } : undefined);
            this.name = 'ApiError';
            this.code = code;
            this.status = status;
            this.details = details;
        }
    }

    function buildUrl(baseUrl, path) {
        if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
            throw new ApiError('API paths must be relative and start with /.', {
                code: 'INVALID_API_PATH',
            });
        }

        return `${String(baseUrl || '/api').replace(/\/$/, '')}${path}`;
    }

    async function parseResponse(response) {
        if (response.status === 204) return null;

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch (cause) {
                throw new ApiError('The API returned invalid JSON.', {
                    code: 'INVALID_API_RESPONSE',
                    status: response.status,
                    cause,
                });
            }
        }

        return response.text();
    }

    function errorFromResponse(response, payload) {
        const backendError = payload && typeof payload === 'object' ? payload.error : null;
        return new ApiError(
            backendError?.message || response.statusText || 'API request failed.',
            {
                code: backendError?.code || `HTTP_${response.status}`,
                status: response.status,
                details: backendError?.details || null,
            },
        );
    }

    async function runHandler(handler, error) {
        if (!handler) return;
        try {
            await handler(error);
        } catch (_handlerError) {
            // O erro HTTP original deve continuar sendo o resultado da requisição.
        }
    }

    function createApiClient({
        baseUrl = '/api',
        timeoutMs = DEFAULT_TIMEOUT_MS,
        getAccessToken = async () => null,
        onUnauthorized,
        onForbidden,
        fetchImpl = globalObject.fetch?.bind(globalObject),
    } = {}) {
        if (typeof fetchImpl !== 'function') {
            throw new TypeError('A fetch implementation is required.');
        }

        async function request(path, options = {}) {
            const {
                method = 'GET',
                body,
                headers: suppliedHeaders,
                auth = true,
                signal,
                timeoutMs: requestTimeoutMs = timeoutMs,
            } = options;
            const url = buildUrl(baseUrl, path);
            const headers = new globalObject.Headers(suppliedHeaders || {});
            headers.delete('Authorization');
            const controller = new globalObject.AbortController();
            let timedOut = false;

            const abortFromCaller = () => controller.abort(signal?.reason);
            if (signal?.aborted) abortFromCaller();
            else signal?.addEventListener('abort', abortFromCaller, { once: true });

            const timer = globalObject.setTimeout(() => {
                timedOut = true;
                controller.abort();
            }, requestTimeoutMs);

            try {
                if (auth) {
                    const token = await getAccessToken();
                    if (token) headers.set('Authorization', `Bearer ${token}`);
                }

                let requestBody = body;
                if (body !== undefined && typeof body !== 'string' && !(body instanceof globalObject.FormData)) {
                    requestBody = JSON.stringify(body);
                    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
                }

                const response = await fetchImpl(url, {
                    method,
                    headers,
                    body: requestBody,
                    signal: controller.signal,
                });
                let payload;
                try {
                    payload = await parseResponse(response);
                } catch (error) {
                    if (response.ok) throw error;
                    payload = null;
                }

                if (!response.ok) {
                    const error = errorFromResponse(response, payload);
                    if (response.status === 401) await runHandler(onUnauthorized, error);
                    if (response.status === 403) await runHandler(onForbidden, error);
                    throw error;
                }

                return payload;
            } catch (cause) {
                if (cause instanceof ApiError) throw cause;
                if (timedOut) {
                    throw new ApiError('The API request timed out.', {
                        code: 'API_TIMEOUT',
                        cause,
                    });
                }
                if (signal?.aborted) {
                    throw new ApiError('The API request was cancelled.', {
                        code: 'API_REQUEST_ABORTED',
                        cause,
                    });
                }
                throw new ApiError('The API could not be reached.', {
                    code: 'API_NETWORK_ERROR',
                    cause,
                });
            } finally {
                globalObject.clearTimeout(timer);
                signal?.removeEventListener('abort', abortFromCaller);
            }
        }

        return Object.freeze({
            request,
            get: (path, options) => request(path, { ...options, method: 'GET' }),
            post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
            patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
            delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
        });
    }

    globalObject.ApiError = ApiError;
    globalObject.createApiClient = createApiClient;
})(window);
