/* ==========================================================================
   INICIALIZAÇÃO & EVENTOS DE TELA
   ========================================================================== */
document.addEventListener('bueno:ready', async () => {
    initLiveDate();
    // A restauração da sessão deve começar antes dos módulos secundários.
    setupForms();
    setupNavigation();
    setupConfigTabs();
    setupBuildingsEvents();
    setupUnitsEvents();
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
