/* ==========================================================================
   INICIALIZAÇÃO & EVENTOS DE TELA
   ========================================================================== */
document.addEventListener('bueno:ready', async () => {
    loadState(); // Carrega cache local
    await loadFromBackend(); // Sobrescreve com dados da nuvem Supabase
    
    generateMockUnits();
    // Se for a primeira execução (sem dados salvos), salvar os dados gerados inicialmente
    if (!localStorage.getItem('bueno_buildings_data')) {
        saveState();
    }
    // Se contratos estiverem vazios (ex: primeira carga ou reinstalação), sincroniza com unidades ocupadas
    if (!localStorage.getItem('bueno_contracts_data') || CONTRACTS_DATA.length === 0) {
        syncMockTenantsAndContracts();
        saveState();
    }
    initLiveDate();
    setupNavigation();
    setupForms();
    setupConfigTabs();
    setupDevTabs();
    loadConfigData();
    setupBuildingsEvents();
    populateBuildingManagersDropdown();
    initContractsTab();
    initTenantsTab();
    initFinanceTab();
    
    // Atalho do dashboard para inquilinos em aberto
    const goToTenantsLink = document.getElementById('link-go-to-tenants-open');
    if (goToTenantsLink) {
        goToTenantsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const tabBtn = document.querySelector('[data-tab="inquilinos"]');
            if (tabBtn) tabBtn.click();
            const subBtn = document.querySelector('[data-tenant-subtab="aberto"]');
            if (subBtn) subBtn.click();
        });
    }
});

/* Atualiza Data e Dia da Semana */
function initLiveDate() {
    const dateEl = document.getElementById('live-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        // Em português brasileiro
        dateEl.textContent = today.toLocaleDateString('pt-BR', options);
    }
}
