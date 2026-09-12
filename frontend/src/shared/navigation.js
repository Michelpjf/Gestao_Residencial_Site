/* ==========================================================================
   NAVEGAÇÃO DE ABAS
   ========================================================================== */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetTab = link.getAttribute('data-tab');
            
            // Remove active de todos os links e adiciona no selecionado
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Esconde todas as abas e mostra a selecionada
            tabContents.forEach(tab => tab.classList.remove('active'));
            const activeTabEl = document.getElementById(`tab-${targetTab}`);
            if (activeTabEl) {
                activeTabEl.classList.add('active');
            }
            
            // A tela de Residenciais sempre consulta a fonte persistida.
            if (targetTab === 'predios') {
                loadBuildingsFromApi();
                const viewList = document.getElementById('view-predios-list');
                const viewDetail = document.getElementById('view-predios-detail');
                const drawer = document.getElementById('unit-detail-drawer');
                if (viewList) viewList.style.display = 'block';
                if (viewDetail) viewDetail.style.display = 'none';
                if (drawer) drawer.classList.remove('active');
            }
            
            // Lógica específica para quando entra na aba Contratos
            if (targetTab === 'contratos') {
                loadContractsList();
                loadPendingContractsList();
                updateContractBadge();
                
                // Se houver dados de redirecionamento pré-preenchidos
                if (window.prefilledContractData) {
                    const data = window.prefilledContractData;
                    
                    // Alterna para sub-aba Emitir Contrato
                    document.querySelector('[data-contract-subtab="emitir"]').click();
                    
                    // Preenche prédio e unidade
                    const activeUnit = UNITS_DATA.find(u => u.id === data.unitId);
                    if (activeUnit) {
                        const bSelect = document.getElementById('contract-building');
                        if (bSelect) {
                            bSelect.value = activeUnit.buildingId;
                            bSelect.dispatchEvent(new Event('change'));
                        }
                        
                        const uSelect = document.getElementById('contract-unit');
                        if (uSelect) {
                            uSelect.value = activeUnit.id;
                            uSelect.dispatchEvent(new Event('change'));
                        }
                        
                        // Se a unidade já estivesse ocupada, preenche dados do inquilino
                        const nameInp = document.getElementById('contract-tenant-name');
                        const phoneInp = document.getElementById('contract-tenant-phone');
                        if (activeUnit.status === 'occupied') {
                            if (nameInp) nameInp.value = activeUnit.tenant || '';
                            if (phoneInp) phoneInp.value = activeUnit.phone || '';
                        }
                    }
                    
                    // Limpar prefilled
                    window.prefilledContractData = null;
                }
            }
            
            // Atualiza o título do contexto no cabeçalho superior
            const linkText = link.querySelector('span').textContent;
            document.getElementById('topbar-context').textContent = linkText;
            applyActiveTheme();
        });
    });

    // Links de atalho rápido no Dashboard para ir para outras abas
    document.getElementById('btn-quick-contract').addEventListener('click', () => {
        document.querySelector('[data-tab="contratos"]').click();
    });
    
    document.getElementById('link-go-to-contracts').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('[data-tab="contratos"]').click();
        const vencendoBtn = document.querySelector('[data-contract-subtab="vencendo"]');
        if (vencendoBtn) vencendoBtn.click();
    });

    // Delegar cliques nos botões da tabela para ir à aba de contratos
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-action-fill-contract')) {
            document.querySelector('[data-tab="contratos"]').click();
        }
    });
}
