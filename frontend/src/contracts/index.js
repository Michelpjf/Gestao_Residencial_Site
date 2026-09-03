/* ==========================================================================
   MÓDULO DE CONTRATOS & ASSINATURAS (FUNCIONALIDADES DA ABA CONTRATOS)
   ========================================================================== */
let currentViewContractId = null;
let currentUploadContractId = null;
let signatureCanvas = null;
let signatureCtx = null;
let isDrawing = false;
let drawnSignatureBase64 = null;

function initContractsTab() {
    // 1. Navegação de sub-abas internas
    const subnavBtns = document.querySelectorAll('[data-contract-subtab]');
    const subtabContents = document.querySelectorAll('.contract-subtab-content');
    
    subnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubtab = btn.getAttribute('data-contract-subtab');
            
            subnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            subtabContents.forEach(tab => tab.classList.remove('active'));
            const activeTabEl = document.getElementById(`contract-subtab-${targetSubtab}`);
            if (activeTabEl) {
                activeTabEl.classList.add('active');
            }
            
            if (targetSubtab === 'listar') {
                loadContractsList();
            } else if (targetSubtab === 'vencendo') {
                loadExpiringContractsList();
            } else if (targetSubtab === 'pendentes') {
                loadPendingContractsList();
            } else if (targetSubtab === 'emitir') {
                populateContractBuildings();
                populateContractTenants();
            }
        });
    });

    // 2. Ouvintes de busca e filtro na listagem
    const searchInput = document.getElementById('filter-contract-search');
    const buildingSelect = document.getElementById('filter-contract-building');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            loadContractsList();
        });
    }
    
    if (buildingSelect) {
        buildingSelect.addEventListener('change', () => {
            loadContractsList();
        });
    }

    // 3. Formulário de Novo Contrato
    const buildingSelectForm = document.getElementById('contract-building');
    const unitSelectForm = document.getElementById('contract-unit');
    const templateSelectForm = document.getElementById('contract-template');
    const tenantSelectForm = document.getElementById('contract-tenant-select');
    const rentInputForm = document.getElementById('contract-rent');
    const durationInputForm = document.getElementById('contract-duration');
    const startDateInputForm = document.getElementById('contract-start-date');
    const endDateInputForm = document.getElementById('contract-end-date');
    const guaranteeSelectForm = document.getElementById('contract-guarantee');
    
    // Ouvinte do menu suspenso de modelo de contrato
    if (templateSelectForm) {
        templateSelectForm.addEventListener('change', () => {
            const template = templateSelectForm.value;
            if (template === 'toquio') {
                if (rentInputForm) rentInputForm.value = 1050;
                if (durationInputForm) durationInputForm.value = 30;
            } else if (template === 'usa') {
                if (rentInputForm) rentInputForm.value = 1350;
                if (durationInputForm) durationInputForm.value = 30;
            } else if (template === 'temporada_jp') {
                if (rentInputForm) rentInputForm.value = 1300;
                if (durationInputForm) durationInputForm.value = 1;
            } else if (template === 'padrao') {
                if (durationInputForm) durationInputForm.value = 12;
                // Busca valor da unidade selecionada
                if (unitSelectForm && unitSelectForm.value) {
                    const activeUnit = UNITS_DATA.find(u => u.id === unitSelectForm.value);
                    if (activeUnit && rentInputForm) rentInputForm.value = activeUnit.rent;
                } else {
                    if (rentInputForm) rentInputForm.value = '';
                }
            }
            updateEndDateField();
        });
    }

    // Dia padrão hoje no start-date
    if (startDateInputForm) {
        const today = new Date().toISOString().split('T')[0];
        startDateInputForm.value = today;
        updateEndDateField();
    }
    
    // Atualizar data de término
    function updateEndDateField() {
        if (!startDateInputForm || !durationInputForm || !endDateInputForm) return;
        const startVal = startDateInputForm.value;
        const durVal = parseInt(durationInputForm.value) || 12;
        if (!startVal) return;
        
        const start = new Date(startVal + 'T12:00:00'); // Evitar timezone
        start.setMonth(start.getMonth() + durVal);
        
        // Formatar para pt-BR
        const day = String(start.getDate()).padStart(2, '0');
        const month = String(start.getMonth() + 1).padStart(2, '0');
        const year = start.getFullYear();
        endDateInputForm.value = `${day}/${month}/${year}`;
    }
    
    if (startDateInputForm) startDateInputForm.addEventListener('change', updateEndDateField);
    if (durationInputForm) durationInputForm.addEventListener('input', updateEndDateField);

    // Carrega unidades do prédio selecionado
    if (buildingSelectForm) {
        buildingSelectForm.addEventListener('change', () => {
            const buildingId = buildingSelectForm.value;
            if (!buildingId) {
                unitSelectForm.innerHTML = '<option value="">Selecione o prédio primeiro...</option>';
                unitSelectForm.disabled = true;
                return;
            }
            
            unitSelectForm.disabled = false;
            unitSelectForm.innerHTML = '<option value="">Selecione a unidade...</option>';
            
            // Unidades desse prédio
            const units = UNITS_DATA.filter(u => u.buildingId === buildingId);
            
            units.forEach(u => {
                const isPrefilled = window.prefilledContractData && window.prefilledContractData.unitId === u.id;
                // Exibe apenas livres, a não ser que seja um preenchimento direcionado
                if (u.status === 'vacant' || isPrefilled) {
                    const opt = document.createElement('option');
                    opt.value = u.id;
                    opt.textContent = `Apto ${u.number} (${u.status === 'occupied' ? 'Ocupado' : 'Livre'} - R$ ${u.rent})`;
                    if (isPrefilled) opt.selected = true;
                    unitSelectForm.appendChild(opt);
                }
            });
            
            // Preencher aluguel inicial
            if (unitSelectForm.value) {
                const activeUnit = UNITS_DATA.find(u => u.id === unitSelectForm.value);
                if (activeUnit && rentInputForm) {
                    if (!templateSelectForm || templateSelectForm.value === 'padrao') {
                        rentInputForm.value = activeUnit.rent;
                    }
                }
            }
        });
    }
    
    if (unitSelectForm) {
        unitSelectForm.addEventListener('change', () => {
            const activeUnit = UNITS_DATA.find(u => u.id === unitSelectForm.value);
            if (activeUnit && rentInputForm) {
                if (!templateSelectForm || templateSelectForm.value === 'padrao') {
                    rentInputForm.value = activeUnit.rent;
                }
            }
        });
    }

    // (Garantia removida — sem garantia locáticía por padrão)

    // Vincular Inquilino Existente
    if (tenantSelectForm) {
        tenantSelectForm.addEventListener('change', () => {
            const tId = tenantSelectForm.value;
            const nameInput = document.getElementById('contract-tenant-name');
            const phoneInput = document.getElementById('contract-tenant-phone');
            const cpfInput = document.getElementById('contract-tenant-cpf');
            const rgInput = document.getElementById('contract-tenant-rg');
            const emailInput = document.getElementById('contract-tenant-email');
            
            if (!tId) {
                nameInput.value = '';
                phoneInput.value = '';
                cpfInput.value = '';
                rgInput.value = '';
                emailInput.value = '';
                nameInput.disabled = false;
                phoneInput.disabled = false;
                cpfInput.disabled = false;
                rgInput.disabled = false;
                emailInput.disabled = false;
                return;
            }
            
            const tenant = TENANTS_DATA.find(t => t.id === tId);
            if (tenant) {
                nameInput.value = tenant.name;
                phoneInput.value = tenant.phone;
                cpfInput.value = tenant.cpf;
                rgInput.value = tenant.rg;
                emailInput.value = tenant.email;
                
                // Desabilitar inputs para evitar inconsistência visual
                nameInput.disabled = true;
                phoneInput.disabled = true;
                cpfInput.disabled = true;
                rgInput.disabled = true;
                emailInput.disabled = true;
            }
        });
    }

    // Enviar formulário -> Abrir Modal de Visualização
    const formNewContract = document.getElementById('form-new-contract');
    if (formNewContract) {
        formNewContract.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const buildingId = buildingSelectForm.value;
            const building = BUILDINGS_DATA.find(b => b.id === buildingId);
            const unitId = unitSelectForm.value;
            const unit = UNITS_DATA.find(u => u.id === unitId);
            
            const nameInput = document.getElementById('contract-tenant-name');
            const phoneInput = document.getElementById('contract-tenant-phone');
            const cpfInput = document.getElementById('contract-tenant-cpf');
            const rgInput = document.getElementById('contract-tenant-rg');
            const emailInput = document.getElementById('contract-tenant-email');
            
            const rentVal = parseFloat(rentInputForm.value) || 0;
            const durationVal = parseInt(durationInputForm.value) || 12;
            const startVal = startDateInputForm.value;
            const parts = startVal.split('-');
            const startDateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
            const endDateStr = endDateInputForm.value;
            const dueDay = document.getElementById('contract-due-day').value;
            const clauses = document.getElementById('contract-clauses').value;
            
            // Gerar Contrato Temporário
            const tempContract = {
                id: `ctr-temp-${Date.now()}`,
                buildingId,
                buildingName: building ? building.name : 'Bueno Residence',
                unitId,
                unitNumber: unit ? unit.number : '',
                tenantName: nameInput.value,
                tenantCpf: cpfInput.value,
                tenantRg: rgInput.value,
                tenantPhone: phoneInput.value,
                tenantEmail: emailInput.value,
                rentValue: rentVal,
                duration: durationVal,
                startDate: startDateStr,
                endDate: endDateStr,
                paymentDueDay: dueDay,
                guaranteeType: 'Sem Garantia',
                clauses: clauses || '',
                signatureStatus: 'rascunho',
                signedFileUrl: null,
                templateType: templateSelectForm ? templateSelectForm.value : 'padrao'
            };
            
            renderLeaseContractDocument(tempContract);
            
            // Visibilidade de botões por papel
            const requestSigBtn = document.getElementById('btn-request-admin-sig');
            const adminSignBtn = document.getElementById('btn-admin-sign-now');
            
            if (currentUser.role === 'admin') {
                requestSigBtn.style.display = 'none';
                adminSignBtn.style.display = 'block';
            } else {
                requestSigBtn.style.display = 'block';
                adminSignBtn.style.display = 'none';
                requestSigBtn.disabled = false;
                requestSigBtn.textContent = 'Solicitar Assinatura Admin';
            }
            
            currentViewContractId = null; 
            window.activeTempContract = tempContract;
            
            document.getElementById('modal-view-contract').classList.add('active');
        });
    }

    // Cancelar no Form
    const btnCancelContract = document.getElementById('btn-cancel-contract');
    if (btnCancelContract) {
        btnCancelContract.addEventListener('click', () => {
            formNewContract.reset();
            if (tenantSelectForm) tenantSelectForm.value = '';
            document.getElementById('contract-tenant-name').disabled = false;
            document.getElementById('contract-tenant-phone').disabled = false;
            document.getElementById('contract-tenant-cpf').disabled = false;
            document.getElementById('contract-tenant-rg').disabled = false;
            document.getElementById('contract-tenant-email').disabled = false;
            
            document.querySelector('[data-contract-subtab="listar"]').click();
        });
    }

    // Configuração do Canvas de Assinatura
    setupSignatureCanvas();
    
    // Tab switching no Signature Modal
    const sigTabBtns = document.querySelectorAll('[data-sig-method]');
    sigTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.getAttribute('data-sig-method');
            sigTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.sig-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`sig-method-${method}`).classList.add('active');
        });
    });

    // Solicitar assinatura do Admin (Gerente/Gestor)
    const btnRequestSig = document.getElementById('btn-request-admin-sig');
    if (btnRequestSig) {
        btnRequestSig.addEventListener('click', () => {
            if (!window.activeTempContract) return;
            const temp = window.activeTempContract;
            
            // Criar contrato pendente no banco
            const newContract = {
                ...temp,
                id: `ctr-${Date.now()}`,
                signatureStatus: 'pendente_assinatura',
                createdAt: new Date().toLocaleDateString('pt-BR')
            };
            
            CONTRACTS_DATA.push(newContract);
            
            logActivity(`Emitiu contrato para ${newContract.tenantName} (Apto ${newContract.unitNumber}) e solicitou assinatura do Admin.`);
            saveState();
            
            closeContractModal();
            formNewContract.reset();
            document.querySelector('[data-contract-subtab="listar"]').click();
            alert('Solicitação de assinatura enviada com sucesso para o Administrador!');
        });
    }

    // Assinar digitalmente (Admin)
    const btnAdminSign = document.getElementById('btn-admin-sign-now');
    if (btnAdminSign) {
        btnAdminSign.addEventListener('click', () => {
            document.getElementById('modal-signature-pad').classList.add('active');
            clearSignatureCanvas();
        });
    }

    // Salvar Assinatura e finalizar
    const btnSaveSignature = document.getElementById('btn-save-admin-signature');
    if (btnSaveSignature) {
        btnSaveSignature.addEventListener('click', () => {
            const activeTab = document.querySelector('.sig-tab-btn.active').getAttribute('data-sig-method');
            let signatureImg = '';
            
            if (activeTab === 'desenhar') {
                if (!drawnSignatureBase64) {
                    alert('Por favor, desenhe sua assinatura no quadro.');
                    return;
                }
                signatureImg = drawnSignatureBase64;
            } else {
                signatureImg = 'mock_stamp';
            }
            
            if (currentViewContractId) {
                // Assinando um contrato existente
                const contract = CONTRACTS_DATA.find(c => c.id === currentViewContractId);
                if (contract) {
                    contract.signatureStatus = 'assinado';
                    contract.signedFileUrl = `Contrato_Digital_${contract.unitNumber}_${contract.buildingName.replace(/\s+/g, '')}.pdf`;
                    
                    appendSignatureToModalDoc(contract, signatureImg);
                    
                    // Ocupar unidade após a assinatura do admin
                    occupyUnit(contract.unitId, contract.tenantName, contract.tenantPhone, contract.rentValue);
                    
                    logActivity(`Assinou digitalmente o contrato de ${contract.tenantName} (Apto ${contract.unitNumber}).`);
                    saveState();
                    
                    alert('Contrato assinado com sucesso!');
                    closeSignatureModal();
                    
                    document.getElementById('btn-admin-sign-now').style.display = 'none';
                    loadPendingContractsList();
                    loadContractsList();
                    updateContractBadge();
                }
            } else if (window.activeTempContract) {
                // Criando e assinando um novo contrato imediatamente
                const temp = window.activeTempContract;
                const newContract = {
                    ...temp,
                    id: `ctr-${Date.now()}`,
                    signatureStatus: 'assinado',
                    signedFileUrl: `Contrato_Digital_${temp.unitNumber}_${temp.buildingName.replace(/\s+/g, '')}.pdf`,
                    createdAt: new Date().toLocaleDateString('pt-BR')
                };
                
                CONTRACTS_DATA.push(newContract);
                
                occupyUnit(newContract.unitId, newContract.tenantName, newContract.tenantPhone, newContract.rentValue);
                
                logActivity(`Emitiu e assinou digitalmente o contrato de ${newContract.tenantName} (Apto ${newContract.unitNumber}).`);
                saveState();
                
                appendSignatureToModalDoc(newContract, signatureImg);
                
                alert('Contrato assinado e gerado com sucesso!');
                closeSignatureModal();
                
                document.getElementById('btn-admin-sign-now').style.display = 'none';
                formNewContract.reset();
                document.querySelector('[data-contract-subtab="listar"]').click();
            }
        });
    }

    // Configurar o upload
    setupUploadDropzone();

    // Ouvinte para links de ações nas tabelas
    document.addEventListener('click', (e) => {
        const btnView = e.target.closest('.btn-view-contract');
        if (btnView) {
            const ctrId = btnView.getAttribute('data-contract-id');
            const contract = CONTRACTS_DATA.find(c => c.id === ctrId);
            if (contract) {
                currentViewContractId = ctrId;
                window.activeTempContract = contract;
                renderLeaseContractDocument(contract);
                
                const requestSigBtn = document.getElementById('btn-request-admin-sig');
                const adminSignBtn = document.getElementById('btn-admin-sign-now');
                const printBtn = document.getElementById('btn-print-contract-doc');
                
                if (contract.signatureStatus === 'pendente_assinatura' && currentUser.role === 'admin') {
                    adminSignBtn.style.display = 'block';
                    requestSigBtn.style.display = 'none';
                } else if (contract.signatureStatus === 'pendente_assinatura' && currentUser.role !== 'admin') {
                    adminSignBtn.style.display = 'none';
                    requestSigBtn.style.display = 'block';
                    requestSigBtn.disabled = true;
                    requestSigBtn.textContent = 'Aguardando Admin...';
                } else {
                    adminSignBtn.style.display = 'none';
                    requestSigBtn.style.display = 'none';
                }
                
                document.getElementById('modal-view-contract').classList.add('active');
            }
        }
        
        const btnUpload = e.target.closest('.btn-upload-contract');
        if (btnUpload) {
            const ctrId = btnUpload.getAttribute('data-contract-id');
            const contract = CONTRACTS_DATA.find(c => c.id === ctrId);
            if (contract) {
                currentUploadContractId = ctrId;
                document.getElementById('upload-signed-info').value = `Apto ${contract.unitNumber} - ${contract.tenantName}`;
                document.getElementById('modal-upload-signed').classList.add('active');
                
                document.getElementById('upload-signed-progress').style.display = 'none';
                document.getElementById('btn-submit-upload-signed').disabled = true;
                document.getElementById('btn-submit-upload-signed').style.opacity = '0.5';
                document.getElementById('upload-signed-file').value = '';
            }
        }
    });
    
    // Ouvinte para imprimir o contrato do modal
    const btnPrintDoc = document.getElementById('btn-print-contract-doc');
    if (btnPrintDoc) {
        btnPrintDoc.addEventListener('click', () => {
            window.print();
        });
    }

    // Ouvinte para baixar o contrato do modal (.docx)
    const btnDownloadDocx = document.getElementById('btn-download-docx');
    if (btnDownloadDocx) {
        btnDownloadDocx.addEventListener('click', () => {
            if (window.activeTempContract) {
                downloadDocxContract(window.activeTempContract);
            } else {
                alert('Nenhum contrato ativo para download.');
            }
        });
    }

    loadContractsList();
    loadPendingContractsList();
    updateContractBadge();
}

function populateContractBuildings() {
    const selectForm = document.getElementById('contract-building');
    if (!selectForm) return;
    
    const curVal = selectForm.value;
    selectForm.innerHTML = '<option value="">Selecione o prédio...</option>';
    
    let filtered = BUILDINGS_DATA;
    if (currentUser.role === 'gestor') {
        filtered = BUILDINGS_DATA.filter(b => b.id === currentUser.buildingId);
    }
    
    filtered.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = b.name;
        selectForm.appendChild(opt);
    });
    
    if (curVal) selectForm.value = curVal;
}

function populateContractTenants() {
    const selectForm = document.getElementById('contract-tenant-select');
    if (!selectForm) return;
    
    selectForm.innerHTML = '<option value="">-- Cadastrar Novo Morador --</option>';
    
    TENANTS_DATA.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `${t.name} (CPF: ${t.cpf})`;
        selectForm.appendChild(opt);
    });
}

function loadContractsList() {
    const tbody = document.getElementById('contracts-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const searchQuery = document.getElementById('filter-contract-search') ? document.getElementById('filter-contract-search').value.toLowerCase() : '';
    const buildingFilter = document.getElementById('filter-contract-building') ? document.getElementById('filter-contract-building').value : 'all';
    
    let filtered = CONTRACTS_DATA;
    
    if (currentUser.role === 'gestor') {
        filtered = filtered.filter(c => c.buildingId === currentUser.buildingId);
    }
    
    if (buildingFilter !== 'all') {
        filtered = filtered.filter(c => c.buildingId === buildingFilter);
    }
    
    if (searchQuery) {
        filtered = filtered.filter(c => 
            c.tenantName.toLowerCase().includes(searchQuery) ||
            c.tenantCpf.includes(searchQuery) ||
            c.unitNumber.toString().includes(searchQuery) ||
            c.buildingName.toLowerCase().includes(searchQuery)
        );
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum contrato encontrado.
                </td>
            </tr>
        `;
        return;
    }
    
    filtered.forEach(c => {
        let sigBadge = `<span class="badge" style="background-color: var(--neutral-100); color: var(--neutral-700);">Rascunho</span>`;
        if (c.signatureStatus === 'pendente_assinatura') {
            sigBadge = `<span class="badge" style="background-color: var(--warning-light); color: var(--warning); border-color: rgba(245, 166, 35, 0.3);">Aguardando Assinatura</span>`;
        } else if (c.signatureStatus === 'assinado') {
            sigBadge = `<span class="badge" style="background-color: var(--success-light); color: var(--success); border-color: var(--success); font-weight: bold;">Assinado (Digital)</span>`;
        }
        
        let fileCol = `<span class="text-neutral-500" style="font-size: 11px;">Pendente</span>`;
        if (c.signedFileUrl) {
            fileCol = `
                <a href="#" onclick="alert('Download do arquivo assinado simulado com sucesso: ${c.signedFileUrl}'); event.preventDefault();" class="flex align-center gap-5 text-primary" style="font-weight: 600; text-decoration: none; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    ${c.signedFileUrl.length > 20 ? c.signedFileUrl.substring(0, 18) + '...' : c.signedFileUrl}
                </a>
            `;
        }
        
        const rowHtml = `
            <tr>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <strong>${c.tenantName}</strong>
                        <span class="tenant-phone" style="font-size: 11px; color: var(--neutral-500);">${c.tenantPhone}</span>
                    </div>
                </td>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <span>Apto ${c.unitNumber}</span>
                        <small class="text-neutral-500" style="font-size: 10px;">${c.buildingName}</small>
                    </div>
                </td>
                <td>
                    <div class="tenant-cell-info" style="font-size: 12px; display: flex; flex-direction: column;">
                        <span>De: ${c.startDate}</span>
                        <span>Até: <strong style="color: var(--primary-light);">${c.endDate}</strong></span>
                    </div>
                </td>
                <td><strong>R$ ${c.rentValue}</strong></td>
                <td>${sigBadge}</td>
                <td>${fileCol}</td>
                <td>
                    <div class="flex gap-5" style="display: flex; gap: 6px;">
                        <button class="btn-action-mini btn-view-contract" data-contract-id="${c.id}" title="Visualizar / Imprimir">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button class="btn-action-mini btn-upload-contract" data-contract-id="${c.id}" title="Subir Contrato Assinado">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHtml);
    });
    
    // Atualiza filtro select se necessário
    const bFilterSelect = document.getElementById('filter-contract-building');
    if (bFilterSelect && bFilterSelect.children.length <= 1) {
        BUILDINGS_DATA.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = b.name;
            bFilterSelect.appendChild(opt);
        });
    }
}

function loadPendingContractsList() {
    const tbody = document.getElementById('contracts-pending-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filtered = CONTRACTS_DATA.filter(c => c.signatureStatus === 'pendente_assinatura');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum contrato pendente de assinatura.
                </td>
            </tr>
        `;
        return;
    }
    
    filtered.forEach(c => {
        const rowHtml = `
            <tr>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <strong>${c.tenantName}</strong>
                        <span class="tenant-phone" style="font-size: 11px; color: var(--neutral-500);">${c.tenantPhone}</span>
                    </div>
                </td>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <span>Apto ${c.unitNumber}</span>
                        <small class="text-neutral-500" style="font-size: 10px;">${c.buildingName}</small>
                    </div>
                </td>
                <td><span style="font-size: 12px;">${c.createdAt || c.startDate}</span></td>
                <td><strong>R$ ${c.rentValue}</strong></td>
                <td>
                    <div class="flex gap-5" style="display: flex; gap: 6px;">
                        <button class="btn-action-mini btn-view-contract" data-contract-id="${c.id}" title="Revisar e Assinar" style="background-color: var(--warning-light); border-color: rgba(245, 166, 35, 0.3); color: var(--warning);">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function updateContractBadge() {
    const pendingCount = CONTRACTS_DATA.filter(c => c.signatureStatus === 'pendente_assinatura').length;
    
    const sidebarBadge = document.getElementById('sidebar-contracts-badge');
    const tabBadge = document.getElementById('contracts-pending-badge');
    
    if (sidebarBadge) {
        if (pendingCount > 0 && currentUser.role === 'admin') {
            sidebarBadge.textContent = pendingCount;
            sidebarBadge.style.display = 'inline-block';
        } else {
            sidebarBadge.style.display = 'none';
        }
    }
    
    if (tabBadge) {
        if (pendingCount > 0) {
            tabBadge.textContent = pendingCount;
            tabBadge.style.display = 'inline-block';
        } else {
            tabBadge.style.display = 'none';
        }
    }
}

function occupyUnit(unitId, tenantName, tenantPhone, rentValue) {
    const unit = UNITS_DATA.find(u => u.id === unitId);
    if (unit) {
        unit.status = 'occupied';
        unit.tenant = tenantName;
        unit.phone = tenantPhone;
        unit.rent = rentValue;
        
        // Sincronizar o histórico do inquilino correspondente
        let tenant = TENANTS_DATA.find(t => t.name === tenantName);
        if (!tenant) {
            // Se não existisse nos inquilinos, cria um agora
            const tenantId = `tenant-${Date.now()}`;
            tenant = {
                id: tenantId,
                name: tenantName,
                cpf: generateMockCPF(),
                rg: generateMockRG(),
                phone: tenantPhone,
                email: `${tenantName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.')}@buenoresidence.com`,
                documents: [],
                history: [],
                active: true
            };
            TENANTS_DATA.push(tenant);
        }
        
        const building = BUILDINGS_DATA.find(b => b.id === unit.buildingId);
        const bName = building ? building.name : 'Bueno Residence';
        
        // Verifica se a unidade já está no histórico deste inquilino
        const histExists = tenant.history.find(h => h.unitId === unitId && h.status === 'active');
        if (!histExists) {
            tenant.history.push({
                buildingId: unit.buildingId,
                buildingName: bName,
                unitId: unit.id,
                unitNumber: unit.number,
                period: `${new Date().toLocaleDateString('pt-BR', {month: 'short', year: 'numeric'})} - Atual`,
                rent: rentValue,
                status: 'active'
            });
        }
        
        // Atualizar ocupação do prédio
        if (building) {
            const bUnits = UNITS_DATA.filter(u => u.buildingId === building.id);
            const occupiedCount = bUnits.filter(u => u.status === 'occupied').length;
            building.occupied = occupiedCount;
            building.rate = parseFloat(((occupiedCount / bUnits.length) * 100).toFixed(1));
        }
        
        if (activeBuildingId === unit.buildingId) {
            loadUnitsGrid();
            updateBlockStatsUI(activeBuildingId);
        } else {
            updateBlockStatsUI(unit.buildingId);
        }
        
        loadDashboardData();
    }
}

function renderLeaseContractDocument(c) {
    const docContainer = document.getElementById('printable-contract-document');
    if (!docContainer) return;
    
    let stampHtml = '';
    if (c.signatureStatus === 'assinado') {
        const savedStamp = localStorage.getItem(`sig_img_${c.id}`);
        if (savedStamp) {
            stampHtml = `<img src="${savedStamp}" class="contract-stamp-img" style="max-height: 55px; max-width: 140px; mix-blend-mode: multiply;" />`;
        } else {
            stampHtml = `
                <div style="border: 2px solid #2d6a4f; border-radius: 4px; padding: 4px 8px; color: #2d6a4f; font-family: sans-serif; font-size: 8px; text-transform: uppercase; font-weight: bold; transform: rotate(-3deg); text-align: center; line-height: 1.2;">
                    Assinado Eletronicamente<br/>
                    ADMIN BUENO RESIDENCE<br/>
                    IP: 192.168.1.100<br/>
                    Data: ${c.startDate}
                </div>
            `;
        }
    }
    
    let guarantorHtml = '';
    if (c.guaranteeType === 'Fiador' && c.guarantorName) {
        guarantorHtml = `
            <div class="contract-section" style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA QUINTA - DA GARANTIA (FIADOR)</h4>
                <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">5.1. Como garantia fiel das obrigações assumidas neste instrumento, assina também o presente contrato como FIADOR e principal pagador, o Sr(a). <strong>${c.guarantorName}</strong>, inscrito no CPF sob o nº <strong>${c.guarantorCpf}</strong>.</p>
            </div>
        `;
    } else {
        guarantorHtml = `
            <div class="contract-section" style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA QUINTA - DA GARANTIA</h4>
                <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">5.1. O presente contrato de locação residencial é garantido por meio de <strong>${c.guaranteeType}</strong>, restando acordada a prestação de obrigações acessórias decorrentes de referida modalidade.</p>
            </div>
        `;
    }

    const startVal = c.startDate || '14/07/2026';
    const day = startVal.split('/')[0] || '14';
    const monthIndex = startVal.split('/')[1] || '07';
    const year = startVal.split('/')[2] || '2026';
    const monthName = getMonthName(monthIndex);

    // Variáveis dinâmicas baseadas no modelo (Tokyo, USA, Temporada JP)
    let contractTitle = 'INSTRUMENTO PARTICULAR DE CONTRATO DE LOCAÇÃO RESIDENCIAL';
    let docCode = c.templateType === 'toquio' ? 'CONTRATO Particular DE LOCAÇÃO 23/2026 - TÓQUIO - JP' :
                  c.templateType === 'usa' ? 'CONTRATO Particular DE LOCAÇÃO 06/2025 - USA - JP' :
                  c.templateType === 'temporada_jp' ? 'CONTRATO DE LOCAÇÃO TEMPORADA 04/2026 - JP' :
                  'CONTRATO DE LOCAÇÃO RESIDENCIAL';
                  
    let locadorDescription = 'Bueno Residence Empreendimentos Imobiliários Ltda, com sede administrativa no Bueno Residence, Goiânia-GO.';
    if (c.templateType === 'toquio' || c.templateType === 'usa' || c.templateType === 'temporada_jp') {
        locadorDescription = 'Carlos Juliano Filho, Solteiro, RG 32.238, Residente e Domiciliado na Rua Direta Qd.06 lt.04 Setor Sol Nascente. Goiânia - GO - CEP 74210-126.';
    }

    let objetoText = '';
    let vigenciaText = '';
    let aluguelText = '';
    let clausulaQuartaText = '';

    if (c.templateType === 'toquio') {
        objetoText = `1.1. O objeto deste contrato é a locação residencial de imóvel <strong>"QUARTO"</strong> composto de áreas comuns em sistema de condomínio, identificado como <strong>Quarto nº ${c.unitNumber}</strong>, no endereço <strong>Rua Direta, Qd.06, Lt.04 Setor Sol Nascente, Goiânia - GO - CEP 74210-126</strong>.
        <br/>1.2. Descrição dos Móveis: Quarto mobiliado com cama, guarda-roupa, mesa e cadeira. Utilização estritamente para moradia exclusivamente individual.`;
        
        vigenciaText = `2.1. A presente locação terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término previsto para <strong>${c.endDate}</strong>.
        <br/>2.2. Será isento da multa contratual o Locatário que morar por <strong>06 (seis) meses</strong> com todos os pagamentos devidamente realizados e solicitar por escrito, com 30 (trinta) dias de antecedência, a vontade de rescindir o contrato.`;
        
        aluguelText = `3.1. O valor mensal do aluguel é de <strong>R$ ${(parseFloat(c.rentValue) || 1050).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 1050)})</strong>.
        <br/>3.2. Fica pactuado que haverá um **desconto por pontualidade** no valor de **R$ 100,00 (cem reais)** para pagamentos efetuados até o dia 10 de cada mês, reduzindo o valor líquido do aluguel para R$ ${(parseFloat(c.rentValue) - 100).toFixed(2)}.`;
        
        clausulaQuartaText = `4.1. O Locatário compromete-se a cumprir o regulamento interno de convivência das áreas comuns do condomínio. Cláusulas Especiais pactuadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
        
    } else if (c.templateType === 'usa') {
        objetoText = `1.1. O objeto deste contrato é a locação residencial de imóvel <strong>"QUARTO COM COZINHA"</strong>, em condomínio residencial, identificado como <strong>Quarto nº ${c.unitNumber} - Bloco USA</strong>, no endereço <strong>Rua Direta, Q.04, lt.09/10 Setor Sol Nascente, Goiânia - GO - CEP 74210-126</strong>.
        <br/>1.2. A utilização destina-se exclusivamente para moradia de até 2 pessoas (conforme termo de ocupação do quarto).`;
        
        vigenciaText = `2.1. A presente locação terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término previsto para <strong>${c.endDate}</strong>.
        <br/>2.2. Será isento da multa contratual o Locatário que morar por <strong>12 (doze) meses</strong> com todos os pagamentos devidamente realizados e solicitar por escrito, com 30 (trinta) dias de antecedência, a vontade de rescindir o contrato.`;
        
        aluguelText = `3.1. O valor mensal do aluguel é de <strong>R$ ${(parseFloat(c.rentValue) || 1350).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 1350)})</strong>.
        <br/>3.2. Fica pactuado que haverá um **desconto por pontualidade** no valor de **R$ 150,00 (cento e cinquenta reais)** para pagamentos efetuados até o dia 10 de cada mês, reduzindo o valor líquido do aluguel para R$ ${(parseFloat(c.rentValue) - 150).toFixed(2)}.`;
        
        clausulaQuartaText = `4.1. O Locatário declara estar ciente de que as despesas comuns de água e luz estão rateadas ou inclusas no condomínio. Cláusulas Especiais pactuadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
        
    } else if (c.templateType === 'temporada_jp') {
        contractTitle = 'CONTRATO DE LOCAÇÃO POR TEMPORADA (ART. 48 LEI 8.245)';
        
        objetoText = `1.1. O objeto deste contrato é a locação temporária residencial do imóvel <strong>"QUARTO"</strong> mobiliado com cama, mesa, cadeira e guarda-roupa, identificado como <strong>Quarto nº ${c.unitNumber} - JP</strong>, situado na <strong>Rua Direta, Q06, lt 04/6 Setor Sol Nascente, Goiânia - GO - CEP 74210-126</strong>.
        <br/>1.2. Destina-se exclusivamente para fins residenciais na modalidade temporada, conforme Art. 48 da Lei do Inquilinato, podendo ser ocupado apenas pelo locatário em moradia exclusivamente individual.`;
        
        vigenciaText = `2.1. A presente locação por temporada terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término em <strong>${c.endDate}</strong>, data na qual o Locatário obriga-se a desocupar o imóvel independentemente de notificação.`;
        
        aluguelText = `3.1. O valor da temporada contratada é de <strong>R$ ${(parseFloat(c.rentValue) || 1300).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 1300)})</strong>, pago de forma antecipada ou no ato da entrega das chaves conforme acordo comercial.`;
        
        clausulaQuartaText = `4.1. Fica proibida a permanência de animais de qualquer porte ou visitas com pernoite sem autorização do Locador. Cláusulas Especiais pactuadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
        
    } else {
        // Padrão Residencial original
        objetoText = `1.1. O objeto deste contrato é a locação residencial da unidade identificada como <strong>Apto ${c.unitNumber}</strong>, situado no empreendimento <strong>${c.buildingName}</strong>, entregue em perfeitas condições de habitação e conservação.`;
        vigenciaText = `2.1. A presente locação terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término previsto para <strong>${c.endDate}</strong>.
        <br/>2.2. Findo o prazo estipulado, o contrato poderá ser prorrogado mediante acordo mútuo das partes ou desocupação do imóvel no estado em que foi recebido.`;
        aluguelText = `3.1. O valor mensal do aluguel residencial livremente pactuado é de <strong>R$ ${(parseFloat(c.rentValue) || 0).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 0)})</strong>, a ser pago mensalmente pelo Locatário.
        <br/>3.2. O pagamento deverá ser efetuado impreterivelmente até o <strong>dia ${c.paymentDueDay || '10'}</strong> de cada mês subsequente ao vencido.`;
        clausulaQuartaText = `4.1. O Locatário declara receber o imóvel vistoriado, comprometendo-se a zelar por sua integridade e efetuar os reparos necessários decorrentes do uso. Fica vedada a sublocação, empréstimo ou transferência do imóvel a terceiros sem prévio consentimento formal do Locador.
        <br/>4.2. Cláusulas Especiais acordadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
    }

    docContainer.innerHTML = `
        <div style="font-family: sans-serif; font-size: 10px; color: var(--neutral-400); text-align: right; margin-bottom: 5px;" class="no-print">${docCode}</div>
        <div class="contract-title" style="text-align: center; font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 10px;">${contractTitle}</div>
        
        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">1. DAS PARTES</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;"><strong>LOCADOR:</strong> ${locadorDescription}</p>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;"><strong>LOCATÁRIO:</strong> <strong>${c.tenantName}</strong>, inscrito(a) no CPF sob o nº <strong>${c.tenantCpf}</strong>, portador(a) do RG nº <strong>${c.tenantRg || 'Não Informado'}</strong>, telefone de contato <strong>${c.tenantPhone}</strong>, doravante denominado simplesmente Locatário.</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${objetoText}</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA SEGUNDA - DO PRAZO DE VIGÊNCIA</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${vigenciaText}</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA TERCEIRA - DO VALOR DO ALUGUEL</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${aluguelText}</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA QUARTA - DAS OBRIGAÇÕES GERAIS</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${clausulaQuartaText}</p>
        </div>

        ${guarantorHtml}

        <div class="contract-section" style="margin-bottom: 25px;">
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">E, por estarem assim justas e contratadas, as partes assinam o presente instrumento para que surta seus efeitos legais.</p>
            <p style="text-align: right; margin-top: 30px; font-size: 12px; font-weight: bold;">Goiânia-GO, ${day} de ${monthName} de ${year}.</p>
        </div>

        <div class="contract-signatures-row" style="display: flex; justify-content: space-between; margin-top: 60px; gap: 40px;">
            <div class="contract-sig-col" style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div class="contract-stamp-container" id="contract-admin-signature-stamp" style="height: 60px; display: flex; align-items: center; justify-content: center;">
                    ${stampHtml}
                </div>
                <div class="contract-sig-line" style="border-top: 1px solid #333; width: 100%; margin-top: 20px; padding-top: 8px; font-size: 12px; font-weight: bold; font-family: sans-serif;">${c.templateType === 'padrao' || !c.templateType ? 'BUENO RESIDENCE' : 'CARLOS JULIANO FILHO'}<br/>(Locador)</div>
            </div>
            <div class="contract-sig-col" style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div style="height: 60px;"></div>
                <div class="contract-sig-line" style="border-top: 1px solid #333; width: 100%; margin-top: 20px; padding-top: 8px; font-size: 12px; font-weight: bold; font-family: sans-serif;">${c.tenantName}<br/>(Locatário)</div>
            </div>
        </div>
    `;
}

function getMonthName(monthStr) {
    const months = {
        '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
        '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
        '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    return months[monthStr] || 'Julho';
}

function convertNumberToWords(num) {
    if (num === 1050) return 'um mil e cinquenta reais';
    if (num === 1100) return 'um mil e cem reais';
    if (num === 1150) return 'um mil cento e cinquenta reais';
    if (num === 1200) return 'um mil e duzentos reais';
    if (num === 1250) return 'um mil duzentos e cinquenta reais';
    if (num === 1300) return 'um mil e trezentos reais';
    if (num === 1350) return 'um mil trezentos e cinquenta reais';
    if (num === 1400) return 'um mil e quatrocentos reais';
    if (num === 1450) return 'um mil quatrocentos e cinquenta reais';
    if (num === 1500) return 'um mil e quinhentos reais';
    if (num === 1600) return 'um mil e seiscentos reais';
    if (num === 1700) return 'um mil e setecentos reais';
    if (num === 1800) return 'um mil e oitocentos reais';
    if (num === 1900) return 'um mil e novecentos reais';
    if (num === 2000) return 'dois mil reais';
    if (num === 2500) return 'dois mil e quinhentos reais';
    if (num === 3000) return 'três mil reais';
    // Fallback genérico
    const intPart = Math.floor(num);
    const decPart = Math.round((num - intPart) * 100);
    const decStr = decPart > 0 ? ` e ${decPart} centavos` : '';
    return `${intPart} reais${decStr}`;
}

function setupSignatureCanvas() {
    const canvas = document.getElementById('signature-canvas');
    if (!canvas) return;
    
    signatureCanvas = canvas;
    signatureCtx = canvas.getContext('2d');
    
    document.getElementById('btn-clear-canvas').addEventListener('click', clearSignatureCanvas);
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}

function startDrawing(e) {
    isDrawing = true;
    signatureCtx.beginPath();
    const rect = signatureCanvas.getBoundingClientRect();
    signatureCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    signatureCtx.lineWidth = 2.5;
    signatureCtx.lineCap = 'round';
    signatureCtx.strokeStyle = '#0d2c54'; 
}

function draw(e) {
    if (!isDrawing) return;
    const rect = signatureCanvas.getBoundingClientRect();
    signatureCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    signatureCtx.stroke();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    drawnSignatureBase64 = signatureCanvas.toDataURL();
}

function clearSignatureCanvas() {
    if (!signatureCanvas || !signatureCtx) return;
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    drawnSignatureBase64 = null;
}

function appendSignatureToModalDoc(contract, imgData) {
    const stampContainer = document.getElementById('contract-admin-signature-stamp');
    if (!stampContainer) return;
    
    if (imgData === 'mock_stamp') {
        stampContainer.innerHTML = `
            <div style="border: 2px solid #2d6a4f; border-radius: 4px; padding: 4px 8px; color: #2d6a4f; font-family: sans-serif; font-size: 8px; text-transform: uppercase; font-weight: bold; transform: rotate(-3deg); text-align: center; line-height: 1.2;">
                Assinado Eletronicamente<br/>
                ADMIN BUENO RESIDENCE<br/>
                IP: 192.168.1.100<br/>
                Data: ${new Date().toLocaleDateString('pt-BR')}
            </div>
        `;
    } else {
        localStorage.setItem(`sig_img_${contract.id}`, imgData);
        stampContainer.innerHTML = `<img src="${imgData}" class="contract-stamp-img" style="max-height: 55px; max-width: 140px; mix-blend-mode: multiply;" />`;
    }
}

function setupUploadDropzone() {
    const dropzone = document.getElementById('upload-signed-dropzone');
    const fileInput = document.getElementById('upload-signed-file');
    const submitBtn = document.getElementById('btn-submit-upload-signed');
    
    if (!dropzone || !fileInput || !submitBtn) return;
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelection(fileInput.files[0]);
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFileSelection(fileInput.files[0]);
        }
    });
    
    function handleFileSelection(file) {
        document.getElementById('upload-signed-filename').textContent = file.name;
        document.getElementById('upload-signed-percent').textContent = '0%';
        document.getElementById('upload-signed-bar-fill').style.width = '0%';
        document.getElementById('upload-signed-progress').style.display = 'block';
        
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
    
    submitBtn.addEventListener('click', () => {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('upload-signed-percent').textContent = `${progress}%`;
            document.getElementById('upload-signed-bar-fill').style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                
                const contract = CONTRACTS_DATA.find(c => c.id === currentUploadContractId);
                if (contract) {
                    contract.signedFileUrl = fileInput.files[0] ? fileInput.files[0].name : 'Contrato_Assinado_Upload.pdf';
                    saveState();
                    loadContractsList();
                }
                
                alert('Arquivo do contrato assinado enviado com sucesso para a pasta do Google Drive!');
                closeUploadModal();
            }
        }, 150);
    });
}

function downloadDocxContract(contract) {
    let templateName = '';
    switch (contract.templateType) {
        case 'toquio':
            templateName = 'toquio.docx';
            break;
        case 'usa':
            templateName = 'usa.docx';
            break;
        case 'temporada_jp':
            templateName = 'temporada_jp.docx';
            break;
        case 'padrao':
        default:
            templateName = 'padrao.docx';
            break;
    }
    
    const templatePath = `templates/${templateName}`;
    const btnDownload = document.getElementById('btn-download-docx');
    let originalText = 'Baixar Word (.docx)';
    if (btnDownload) {
        originalText = btnDownload.innerHTML;
        btnDownload.disabled = true;
        btnDownload.innerHTML = 'Gerando Word...';
    }
    
    fetch(templatePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o template: ${templatePath}. Certifique-se de que o arquivo existe na pasta /templates.`);
            }
            return response.arrayBuffer();
        })
        .then(content => {
            const zip = new window.PizZip(content);
            const Docxtemplater = window.docxtemplater.default || window.docxtemplater;
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            
            const startVal = contract.startDate || '';
            let day = '';
            let monthIndex = '';
            let year = '';
            let monthName = '';
            
            if (startVal.includes('/')) {
                const parts = startVal.split('/');
                day = parts[0] || '';
                monthIndex = parts[1] || '';
                year = parts[2] || '';
                monthName = getMonthName(monthIndex);
            } else if (startVal.includes('-')) {
                const parts = startVal.split('-');
                day = parts[2] || '';
                monthIndex = parts[1] || '';
                year = parts[0] || '';
                monthName = getMonthName(monthIndex);
            }
            
            const rentVal = parseFloat(contract.rentValue) || 0;
            const rentInWords = convertNumberToWords(rentVal);
            
            let discount = 0;
            if (contract.templateType === 'toquio') {
                discount = 100;
            } else if (contract.templateType === 'usa') {
                discount = 150;
            }
            const rentWithDiscount = rentVal - discount;
            const rentWithDiscountInWords = convertNumberToWords(rentWithDiscount);
            
            const formatCurrency = (val) => {
                return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            };
            
            doc.render({
                NOME_INQUILINO: contract.tenantName || '',
                CPF_INQUILINO: contract.tenantCpf || '',
                RG_INQUILINO: contract.tenantRg || '',
                FONE_INQUILINO: contract.tenantPhone || '',
                EMAIL_INQUILINO: contract.tenantEmail || '',
                VALOR_ALUGUEL: formatCurrency(rentVal),
                VALOR_ALUGUEL_EXTENSO: rentInWords,
                VALOR_DESCONTO: formatCurrency(discount),
                VALOR_ALUGUEL_LIQUIDO: formatCurrency(rentWithDiscount),
                VALOR_ALUGUEL_LIQUIDO_EXTENSO: rentWithDiscountInWords,
                VIGENCIA_MESES: contract.duration || '',
                DATA_INICIO: contract.startDate || '',
                DATA_FIM: contract.endDate || '',
                DIA_VENCIMENTO: contract.paymentDueDay || '',
                NUMERO_UNIDADE: contract.unitNumber || '',
                NOME_PREDIO: contract.buildingName || '',
                DIA_ATUAL: day,
                MES_ATUAL: monthName,
                ANO_ATUAL: year,
                CLAUSULAS_ESPECIAIS: contract.clauses || 'Nenhuma cláusula especial cadastrada.'
            });
            
            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            
            const blobUrl = window.URL.createObjectURL(out);
            const a = document.createElement('a');
            a.href = blobUrl;
            
            const sanitizedTenantName = (contract.tenantName || 'Inquilino').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const unitClean = (contract.unitNumber || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            a.download = `Contrato_Apto_${unitClean}_${sanitizedTenantName}.docx`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            
            if (btnDownload) {
                btnDownload.disabled = false;
                btnDownload.innerHTML = originalText;
            }
        })
        .catch(err => {
            console.error(err);
            alert(`Erro ao gerar contrato: ${err.message}`);
            if (btnDownload) {
                btnDownload.disabled = false;
                btnDownload.innerHTML = originalText;
            }
        });
}

function closeContractModal() {
    const modal = document.getElementById('modal-view-contract');
    modal.style.display = 'none';
    modal.classList.remove('active');
    currentViewContractId = null;
}

function closeSignatureModal() {
    const modal = document.getElementById('modal-signature-pad');
    modal.style.display = 'none';
    modal.classList.remove('active');
}

function closeUploadModal() {
    const modal = document.getElementById('modal-upload-signed');
    modal.style.display = 'none';
    modal.classList.remove('active');
    currentUploadContractId = null;
}

// Expor modais e funções globalmente
window.closeContractModal = closeContractModal;
window.closeSignatureModal = closeSignatureModal;
window.closeUploadModal = closeUploadModal;
window.initContractsTab = initContractsTab;
window.loadContractsList = loadContractsList;
window.loadPendingContractsList = loadPendingContractsList;
window.updateContractBadge = updateContractBadge;
window.occupyUnit = occupyUnit;
window.renderLeaseContractDocument = renderLeaseContractDocument;
