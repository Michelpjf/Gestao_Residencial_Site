/* Entrada modular do frontend Bueno Residence. */
(function bootstrapFrontend() {
    const version = '4';
    const views = ['dashboard', 'buildings', 'tenants', 'contracts', 'finance', 'settings', 'developer'];
    const scripts = [
        'shared/api-client.js',
        'shared/state.js',
        'shared/api-session.js',
        'buildings/api.js',
        'shared/lifecycle.js',
        'auth/index.js',
        'dashboard/index.js',
        'shared/navigation.js',
        'settings/index.js',
        'buildings/index.js',
        'finance/index.js',
        'tenants/index.js',
        'contracts/index.js',
        'developer/index.js'
    ];

    async function loadView(name) {
        const slot = document.querySelector('[data-view-module="' + name + '"]');
        if (!slot) throw new Error('Slot da tela ' + name + ' não encontrado.');
        const response = await fetch('src/' + name + '/view.html?v=' + version);
        if (!response.ok) throw new Error('Falha ao carregar a tela ' + name + '.');
        slot.outerHTML = await response.text();
    }

    function loadScript(relativePath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'src/' + relativePath + '?v=' + version;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Falha ao carregar ' + relativePath + '.'));
            document.body.appendChild(script);
        });
    }

    async function start() {
        await Promise.all(views.map(loadView));
        for (const script of scripts) await loadScript(script);
        document.dispatchEvent(new CustomEvent('bueno:ready'));
    }

    start().catch((error) => {
        console.error('[Bueno Bootstrap]', error);
        const loginError = document.getElementById('login-error');
        if (loginError) {
            loginError.textContent = 'Não foi possível carregar o painel. Atualize a página e tente novamente.';
            loginError.style.display = 'block';
        }
    });
})();
