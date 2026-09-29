/* Navegação entre as telas persistidas do MVP. */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach((link) => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const targetTab = link.getAttribute('data-tab');

            navLinks.forEach((item) => item.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            tabContents.forEach((tab) => tab.classList.remove('active'));
            document.getElementById(`tab-${targetTab}`)?.classList.add('active');

            if (targetTab === 'dashboard') await loadDashboardData();
            if (targetTab === 'predios') await loadBuildingsFromApi();
            if (targetTab === 'inquilinos') await initTenantsTab();
            if (targetTab === 'contratos') await initContractsTab();
            if (targetTab === 'configuracoes') await loadConfigData();

            const context = document.getElementById('topbar-context');
            const label = link.querySelector('span');
            if (context && label) context.textContent = label.textContent;
        });
    });

    document.getElementById('btn-quick-contract')?.addEventListener('click', () => {
        document.querySelector('[data-tab="contratos"]')?.click();
    });
}
