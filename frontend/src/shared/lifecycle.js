/* ==========================================================================
   INICIALIZAÇÃO & EVENTOS DE TELA
   ========================================================================== */
document.addEventListener('bueno:ready', async () => {
    initLiveDate();
    // A restauração da sessão deve começar antes dos módulos secundários.
    setupForms();
    setupNavigation();
    setupConfigTabs();
    setupDevTabs();
    setupBuildingsEvents();
    setupUnitsEvents();
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
