/* Liga o cliente HTTP à sessão autenticada do Supabase. */
window.apiClient = window.createApiClient({
    baseUrl: window.BUENO_API_URL || API_URL,
    getAccessToken: async () => {
        if (!supabaseClient) return null;

        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        return data?.session?.access_token || null;
    },
    onUnauthorized: (error) => {
        document.dispatchEvent(new CustomEvent('bueno:api-unauthorized', { detail: error }));
    },
    onForbidden: (error) => {
        document.dispatchEvent(new CustomEvent('bueno:api-forbidden', { detail: error }));
    },
});
