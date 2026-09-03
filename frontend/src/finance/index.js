/* ==========================================================================
   MÓDULO FINANCEIRO
   ========================================================================== */
function initFinanceTab() {
    const subnavBtns = document.querySelectorAll('[data-finance-subtab]');
    const subtabContents = document.querySelectorAll('.finance-subtab-content');
    
    subnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubtab = btn.getAttribute('data-finance-subtab');
            
            subnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Esconde todas e exibe apenas a ativa
            subtabContents.forEach(tab => tab.style.display = 'none');
            const activeTabEl = document.getElementById(`finance-subtab-${targetSubtab}`);
            if (activeTabEl) {
                activeTabEl.style.display = 'block';
            }
            
            // Recarregar os dados da aba correspondente
            if (targetSubtab === 'semanal') {
                loadWeeklyReport();
            } else if (targetSubtab === 'caixa') {
                loadCashBook();
            } else if (targetSubtab === 'depositos') {
                loadPixDepositsReport();
            } else if (targetSubtab === 'relatorios') {
                loadGlobalReports();
            }
        });
    });
    
    // Carga inicial
    if (typeof loadWeeklyReport === 'function') loadWeeklyReport();
    if (typeof loadCashBook === 'function') loadCashBook();
    loadPixDepositsReport();
}

function loadWeeklyReport() {
    const tableBody = document.getElementById('table-semanal-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (MOCK_WEEKLY_REPORTS.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum relatório semanal gerado.
                </td>
            </tr>
        `;
        return;
    }
    
    MOCK_WEEKLY_REPORTS.forEach(r => {
        const typeClass = r.type.includes('Entrada') ? 'text-success' : (r.type.includes('Saída') ? 'text-danger' : 'text-primary');
        const rowHtml = `
            <tr>
                <td>${r.date}</td>
                <td><strong>${r.tenant}</strong></td>
                <td><span class="unit-tag">${r.unit}</span></td>
                <td><span class="${typeClass}" style="font-weight: bold;">${r.type}</span></td>
                <td>${r.detail}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function loadCaixaData() {
    const tableEntradas = document.getElementById('table-caixa-entradas-body');
    const tableSaidas = document.getElementById('table-caixa-saidas-body');
    if (!tableEntradas || !tableSaidas) return;
    
    tableEntradas.innerHTML = '';
    tableSaidas.innerHTML = '';
    
    const entradas = CAIXA_DATA.filter(c => c.type === 'Entrada');
    const saidas = CAIXA_DATA.filter(c => c.type === 'Saída');
    
    // Renderizar Entradas
    if (entradas.length === 0) {
        tableEntradas.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--neutral-500); padding: 20px;">Nenhuma entrada registrada.</td></tr>`;
    } else {
        entradas.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))).forEach(c => {
            const formattedValue = parseFloat(c.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            let docLink = c.comprovante ? `<button onclick="viewDocument('${c.comprovante.data}')" class="btn-action-mini btn-action-view" title="Ver Comprovante"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Anexo</button>` : '-';
            
            const desc = c.unit ? `<strong>${c.description}</strong><br><span style="font-size:12px; color:var(--neutral-500);">${c.unit}</span>` : c.description;
            
            tableEntradas.innerHTML += `
                <tr>
                    <td>${c.date}</td>
                    <td>${desc}</td>
                    <td style="font-weight: 600; color: var(--success);">${formattedValue}</td>
                    <td>${docLink}</td>
                </tr>
            `;
        });
    }

    // Renderizar Saídas
    if (saidas.length === 0) {
        tableSaidas.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--neutral-500); padding: 20px;">Nenhuma saída registrada.</td></tr>`;
    } else {
        saidas.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))).forEach(c => {
            const formattedValue = parseFloat(c.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            let docLink = c.comprovante ? `<button onclick="viewDocument('${c.comprovante.data}')" class="btn-action-mini btn-action-view" title="Ver Comprovante"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Anexo</button>` : '-';
            
            tableSaidas.innerHTML += `
                <tr>
                    <td>${c.date}</td>
                    <td>${c.description}</td>
                    <td style="font-weight: 600; color: var(--danger);">${formattedValue}</td>
                    <td>${docLink}</td>
                </tr>
            `;
        });
    }
}

function loadPixDepositsReport() {
    const tableBody = document.getElementById('table-depositos-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (PIX_DEPOSITS_DATA.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--neutral-500); padding: 30px;">
                    Nenhum depósito PIX registrado.
                </td>
            </tr>
        `;
        return;
    }
    
    // Agrupar por morador
    const groups = {};
    PIX_DEPOSITS_DATA.forEach(d => {
        const key = d.tenant;
        if (!groups[key]) groups[key] = { tenant: d.tenant, unit: d.unit, entries: [] };
        groups[key].entries.push(d);
    });
    
    Object.values(groups).forEach((group, gi) => {
        // Ordenar por data + hora ascendente dentro do grupo
        group.entries.sort((a, b) => {
            const da = new Date(`${a.date.split('/').reverse().join('-')}T${a.time || '00:00'}`);
            const db = new Date(`${b.date.split('/').reverse().join('-')}T${b.time || '00:00'}`);
            return da - db;
        });
        
        const isMultiple = group.entries.length > 1;
        const total = group.entries.reduce((s, e) => s + e.value, 0);
        const totalFmt = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        group.entries.forEach((d, idx) => {
            const isFirst = idx === 0;
            
            const typeMeta = {
                integral: { label: 'Integral', color: '#02c39a', bg: 'rgba(46,196,182,0.12)' },
                parte:    { label: 'Parte',    color: '#e67e22', bg: 'rgba(230,126,34,0.12)' },
                restante: { label: 'Restante', color: '#2980b9', bg: 'rgba(41,128,185,0.12)' }
            }[d.type] || { label: d.type, color: '#888', bg: '#f0f0f0' };
            
            const typeBadge  = `<span style="background:${typeMeta.bg};color:${typeMeta.color};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;">${typeMeta.label}</span>`;
            const valueFmt   = d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const statusBadge= `<span style="background:rgba(46,196,182,0.12);color:#02c39a;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;">Conciliado</span>`;
            
            // Comprovante
            let comprovHtml = '<span style="color:var(--neutral-400);font-size:12px;">—</span>';
            if (d.comprovante) {
                if (d.comprovante.type === 'application/pdf') {
                    comprovHtml = `<a href="${d.comprovante.data}" download="${d.comprovante.name}" title="Baixar comprovante" style="color:var(--primary);font-size:20px;text-decoration:none;">📄</a>`;
                } else {
                    comprovHtml = `<a href="${d.comprovante.data}" target="_blank" title="Ver comprovante">
                        <img src="${d.comprovante.data}" alt="comprovante" style="height:36px;width:36px;object-fit:cover;border-radius:6px;border:1px solid var(--neutral-200);cursor:pointer;">
                    </a>`;
                }
            }
            
            // Para grupos múltiplos: borda esquerda + fundo levemente diferenciado
            const groupBg    = isMultiple ? (gi % 2 === 0 ? 'rgba(13,44,84,0.03)' : 'rgba(0,0,0,0)') : '';
            const leftBorder = isMultiple ? 'border-left: 3px solid var(--primary);' : '';
            const nameCell   = isFirst
                ? `<strong style="display:block;">${group.tenant}</strong>
                   ${isMultiple ? `<span style="font-size:11px;color:var(--neutral-500);">Total: ${totalFmt}</span>` : ''}`
                : `<span style="color:var(--neutral-400);font-size:12px;padding-left:12px;">↳ continuação</span>`;
            
            const rowHtml = `
                <tr style="${leftBorder}background:${groupBg};">
                    <td>${nameCell}</td>
                    <td>${isFirst ? `<span class="unit-tag">${d.unit}</span>` : ''}</td>
                    <td style="color:var(--neutral-600);font-size:13px;">${d.date} ${d.time || ''}</td>
                    <td>${typeBadge}</td>
                    <td><strong style="color:#02c39a;font-size:14px;">${valueFmt}</strong></td>
                    <td>${comprovHtml}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowHtml);
        });
    });
}

/* --- Funções do Modal de Novo Lançamento PIX --- */

function openNewPixModal() {
    const modal = document.getElementById('modal-new-pix');
    if (!modal) return;
    
    // Resetar formulário
    document.getElementById('form-new-pix').reset();
    document.getElementById('pix-unit').value = '';
    
    // Limpar comprovante anterior
    window._pixComprovanteData = null;
    const preview = document.getElementById('pix-comprovante-preview');
    if (preview) preview.innerHTML = '';
    
    // Preencher select de inquilinos
    const tenantSelect = document.getElementById('pix-tenant');
    tenantSelect.innerHTML = '<option value="">Selecione o inquilino...</option>';
    TENANTS_DATA.forEach(t => {
        const hist = t.history && t.history[0] ? t.history[0] : {};
        const unit = hist.unitNumber ? `Apto ${hist.unitNumber} - ${hist.buildingName}` : 'N/A';
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        opt.dataset.unit = unit;
        tenantSelect.appendChild(opt);
    });
    
    // Pré-definir a data de hoje no campo
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('pix-date').value = `${yyyy}-${mm}-${dd}`;
    
    modal.style.display = 'flex';
}

function closeNewPixModal() {
    const modal = document.getElementById('modal-new-pix');
    if (modal) modal.style.display = 'none';
}

function onPixTenantChange() {
    const tenantSelect = document.getElementById('pix-tenant');
    const unitInput = document.getElementById('pix-unit');
    const selected = tenantSelect.options[tenantSelect.selectedIndex];
    unitInput.value = selected && selected.dataset.unit ? selected.dataset.unit : '';
}

async function saveNewPixDeposit(event) {
    event.preventDefault();
    
    const dateRaw  = document.getElementById('pix-date').value;
    const type     = document.getElementById('pix-type').value;
    const tenantId = document.getElementById('pix-tenant').value;
    const tenantSelect = document.getElementById('pix-tenant');
    const tenantName   = tenantSelect.options[tenantSelect.selectedIndex]?.textContent || '';
    const unit     = document.getElementById('pix-unit').value;
    const value    = parseFloat(document.getElementById('pix-value').value);
    const obs      = document.getElementById('pix-obs').value;
    
    if (!dateRaw || !type || !tenantId || !value) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }
    
    const [y, m, d] = dateRaw.split('-');
    const dateFormatted = `${d}/${m}/${y}`;
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    let receiptUrl = '';
    const file = window._pixComprovanteFile;
    if (file && supabaseClient) {
        const fileExt = file.name.split('.').pop();
        const fileName = `pix_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        try {
            const { data, error } = await supabaseClient.storage.from('comprovantes').upload(fileName, file);
            if (!error) {
                receiptUrl = `${supabaseUrl}/storage/v1/object/public/comprovantes/${fileName}`;
            } else {
                console.error('Erro no upload do PIX:', error);
                alert('Aviso: Falha ao fazer upload do comprovante. ' + error.message);
            }
        } catch (err) {
            console.error('Erro fatal no upload:', err);
        }
    }
    window._pixComprovanteFile = null;
    
    const newDeposit = {
        id: `pix-${Date.now()}`,
        date: dateFormatted,
        time: timeFormatted,
        tenantId,
        tenant: tenantName,
        unit,
        value,
        type,
        obs,
        receipt_url: receiptUrl,
        comprovante: receiptUrl // mantendo compatibilidade
    };
    
    PIX_DEPOSITS_DATA.push(newDeposit);
    saveState();
    logActivity(`Registrou depósito PIX de ${tenantName} — ${(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${type})`);
    
    closeNewPixModal();
    loadPixDepositsReport();
    alert(`Depósito de ${tenantName} registrado com sucesso!`);
}

function onPixComprovanteChange(input) {
    const file = input.files[0];
    if (!file) { window._pixComprovanteFile = null; return; }
    
    window._pixComprovanteFile = file; // Salva o arquivo para o momento do upload real
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // Mostrar preview
        const preview = document.getElementById('pix-comprovante-preview');
        if (preview) {
            if (file.type === 'application/pdf') {
                preview.innerHTML = `<span style="font-size:28px;">📄</span> <span style="font-size:13px;color:var(--neutral-700);">${file.name}</span>`;
            } else {
                preview.innerHTML = `<img src="${e.target.result}" style="max-height:80px;max-width:100%;border-radius:6px;border:1px solid var(--neutral-200);"/>`;
            }
        }
    };
    reader.readAsDataURL(file);
}

function getNextFridayDate() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    let daysToFriday = 5 - dayOfWeek;
    if (daysToFriday < 0) {
        daysToFriday += 7; // Se for Sábado, a próxima sexta é em 6 dias
    }
    const friday = new Date(today);
    friday.setDate(today.getDate() + daysToFriday);
    return friday.toLocaleDateString('pt-BR');
}

function gerarRelatorioPix() {
    const groups = {};
    PIX_DEPOSITS_DATA.forEach(d => {
        if (!groups[d.tenant]) groups[d.tenant] = { tenant: d.tenant, unit: d.unit, entries: [] };
        groups[d.tenant].entries.push(d);
    });
    Object.values(groups).forEach(g => {
        g.entries.sort((a, b) => {
            const da = new Date(`${a.date.split('/').reverse().join('-')}T${a.time || '00:00'}`);
            const db = new Date(`${b.date.split('/').reverse().join('-')}T${b.time || '00:00'}`);
            return da - db;
        });
    });
    
    // Monta linhas da tabela
    let tableRows = '';
    let totalGeral = 0;
    Object.values(groups).forEach(g => {
        const total = g.entries.reduce((s, e) => s + e.value, 0);
        totalGeral += total;
        const isMultiple = g.entries.length > 1;
        g.entries.forEach((e, idx) => {
            const typeLabel = { integral: 'Integral', parte: 'Parte', restante: 'Restante' }[e.type] || e.type;
            const vFmt = e.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            const nameCell = idx === 0
                ? `<strong>${g.tenant}</strong>${isMultiple ? `<br><span style="font-size:11px; color:#64748b;">Subtotal: ${total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>` : ''}`
                : `<span style="color:#94a3b8; padding-left:16px;">↳ continuação</span>`;
            const unitCell = idx === 0 ? g.unit : '';
            
            tableRows += `<tr>
                <td>${nameCell}</td>
                <td><span style="font-size:12px; color:#64748b;">${unitCell}</span></td>
                <td>${e.date} ${e.time || ''}</td>
                <td><span style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #475569; font-weight: 600;">${typeLabel}</span></td>
                <td><strong>${vFmt}</strong></td>
                <td style="color: #64748b;">${e.obs || '—'}</td>
            </tr>`;
        });
    });
    
    // Comprovantes ao final
    let comprovanteSection = '';
    const depositsWithProof = PIX_DEPOSITS_DATA.filter(d => d.comprovante && d.comprovante.data);
    if (depositsWithProof.length > 0) {
        comprovanteSection = `<h2 class="section-title" style="margin-top: 40px; color: #0f172a;">Anexos e Comprovantes</h2><div class="comprovantes-grid">`;
        
        depositsWithProof.sort((a, b) => {
            const da = new Date(`${a.date.split('/').reverse().join('-')}T${a.time || '00:00'}`);
            const db = new Date(`${b.date.split('/').reverse().join('-')}T${b.time || '00:00'}`);
            return da - db;
        }).forEach((d, idx) => {
            const vFmt = d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const typeLabel = { integral: 'Integral', parte: 'Parte', restante: 'Restante' }[d.type] || d.type;
            
            if (d.comprovante.type === 'application/pdf') {
                comprovanteSection += `
                <div class="comprovante-item">
                    <div class="comprovante-label">${idx + 1}. ${d.tenant}</div>
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${d.date} - ${vFmt}</div>
                    <div style="padding: 20px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; text-align: center; color: #64748b;">
                        📄 Documento PDF anexado<br>
                        <span style="font-size: 10px;">${d.comprovante.name}</span>
                    </div>
                </div>`;
            } else {
                comprovanteSection += `
                <div class="comprovante-item">
                    <div class="comprovante-label">${idx + 1}. ${d.tenant}</div>
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${d.date} - ${vFmt}</div>
                    <img src="${d.comprovante.data}" alt="Comprovante" class="comprovante-img"/>
                </div>`;
            }
        });
        comprovanteSection += `</div>`;
    }
    
    const dataGeracao = new Date().toLocaleString('pt-BR');
    const totalGeralFmt = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Relatório de Depósitos PIX - Bueno Residence</title>
        <style>
            body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1e293b; background-color: #f8fafc; line-height: 1.5; }
            .report-container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .title-area h1 { margin: 0 0 5px 0; color: #0f172a; font-size: 24px; }
            .title-area p { margin: 0; color: #64748b; font-size: 14px; }
            .meta-info { text-align: right; font-size: 14px; color: #64748b; }
            
            .summary-cards { display: flex; gap: 20px; margin-bottom: 30px; }
            .card { flex: 1; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
            .card-title { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 8px; }
            .card-value { font-size: 26px; font-weight: 700; }
            
            .section-title { font-size: 18px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 15px; color: #0f172a; }
            
            table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f1f5f9; font-weight: 600; color: #475569; }
            .total-row td { font-weight: 700; background-color: #f8fafc; border-top: 2px solid #cbd5e1; }
            
            .comprovantes-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .comprovante-item { padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; page-break-inside: avoid; }
            .comprovante-label { font-weight: 700; font-size: 13px; color: #0f172a; }
            .comprovante-img { max-width: 100%; max-height: 250px; border: 1px solid #e2e8f0; border-radius: 6px; display: block; margin: 0 auto; }
            
            @media print {
                body { background-color: white; padding: 0; }
                .report-container { box-shadow: none; padding: 0; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <div class="title-area">
                    <h1>Relatório PIX - ${getNextFridayDate()}</h1>
                    <p>Bueno Residence - Conciliação de Recebimentos da Semana</p>
                </div>
                <div class="meta-info">
                    Gerado em: <strong>${dataGeracao}</strong>
                </div>
            </div>
            
            <div class="summary-cards">
                <div class="card" style="background-color: rgba(67, 97, 238, 0.05); border-color: rgba(67, 97, 238, 0.2);">
                    <div class="card-title">Volume de Lançamentos</div>
                    <div class="card-value" style="color: #4361ee;">${PIX_DEPOSITS_DATA.length}</div>
                </div>
                <div class="card" style="background-color: rgba(46, 196, 182, 0.05); border-color: rgba(46, 196, 182, 0.2);">
                    <div class="card-title">Total Recebido no PIX</div>
                    <div class="card-value" style="color: #02c39a;">${totalGeralFmt}</div>
                </div>
            </div>
            
            <h2 class="section-title">Demonstrativo de Lançamentos</h2>
            <table>
                <thead>
                    <tr>
                        <th width="25%">Inquilino</th>
                        <th width="15%">Unidade</th>
                        <th width="15%">Data / Hora</th>
                        <th width="10%">Tipo</th>
                        <th width="15%">Valor</th>
                        <th width="20%">Observações</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows || '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">Nenhum lançamento PIX encontrado.</td></tr>'}
                    ${tableRows ? `<tr class="total-row"><td colspan="4" style="text-align: right; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Soma Total PIX:</td><td colspan="2" style="color: #02c39a;">${totalGeralFmt}</td></tr>` : ''}
                </tbody>
            </table>
            
            ${comprovanteSection}
            
            <div class="no-print" style="text-align: center; margin-top: 40px;">
                <button onclick="window.print()" style="padding: 10px 20px; background-color: #0f172a; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Imprimir PDF</button>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

/* ==========================================================================
   FUNÇÕES DO CAIXA (NOVO LANÇAMENTO E RELATÓRIO)
   ========================================================================== */

let pendingCaixaComprovante = null;

function openNewCaixaModal() {
    document.getElementById('modal-new-caixa').style.display = 'flex';
    document.getElementById('form-new-caixa').reset();
    
    // Set today's date
    const today = new Date();
    document.getElementById('caixa-date').value = today.toISOString().split('T')[0];
    
    // Populate tenants
    const tenantSelect = document.getElementById('caixa-tenant');
    tenantSelect.innerHTML = '<option value="">Nenhum inquilino específico</option>';
    TENANTS_DATA.forEach(t => {
        tenantSelect.innerHTML += `<option value="${t.id}">${t.name} (${t.unit})</option>`;
    });
    
    onCaixaTypeChange();
    
    pendingCaixaComprovante = null;
    document.getElementById('caixa-comprovante-preview').innerHTML = '';
}

function closeNewCaixaModal() {
    document.getElementById('modal-new-caixa').style.display = 'none';
}

function onCaixaTypeChange() {
    const type = document.getElementById('caixa-type').value;
    const tenantGroup = document.getElementById('group-caixa-tenant');
    if (type === 'Saída') {
        tenantGroup.style.display = 'none';
        document.getElementById('caixa-tenant').value = '';
    } else {
        tenantGroup.style.display = 'flex';
    }
}

function onCaixaComprovanteChange(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Verifica tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem ou PDF não pode ter mais que 5MB.');
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const result = e.target.result;
            pendingCaixaComprovante = {
                type: file.type,
                name: file.name,
                data: result
            };
            
            const previewDiv = document.getElementById('caixa-comprovante-preview');
            if (file.type.startsWith('image/')) {
                previewDiv.innerHTML = `<div style="position:relative; display:inline-block;">
                    <img src="${result}" style="max-width: 100%; max-height: 150px; border-radius: var(--border-radius-sm); border: 1px solid var(--neutral-300);">
                    <button type="button" onclick="pendingCaixaComprovante=null; document.getElementById('caixa-comprovante-preview').innerHTML=''; document.getElementById('caixa-comprovante').value='';" style="position:absolute; top:-8px; right:-8px; background:var(--danger); color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>`;
            } else {
                previewDiv.innerHTML = `<div style="display:flex; align-items:center; gap:8px; padding:8px 12px; background:var(--neutral-100); border-radius:var(--border-radius-sm); border: 1px solid var(--neutral-300);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <span style="font-size:13px; font-weight:600; color:var(--neutral-700); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;">${file.name}</span>
                    <button type="button" onclick="pendingCaixaComprovante=null; document.getElementById('caixa-comprovante-preview').innerHTML=''; document.getElementById('caixa-comprovante').value='';" style="margin-left:auto; background:var(--neutral-300); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>`;
            }
        };
        reader.readAsDataURL(file);
    }
}

function saveNewCaixa(event) {
    event.preventDefault();
    
    const dateInput = document.getElementById('caixa-date').value;
    // Format YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = dateInput.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const type = document.getElementById('caixa-type').value;
    const value = parseFloat(document.getElementById('caixa-value').value);
    const obs = document.getElementById('caixa-obs').value.trim();
    
    let unit = '';
    let description = obs;
    
    if (type === 'Entrada') {
        const tenantId = document.getElementById('caixa-tenant').value;
        if (tenantId) {
            const tenantObj = TENANTS_DATA.find(t => t.id === tenantId);
            if (tenantObj) {
                unit = tenantObj.unit;
                description = `[${tenantObj.name}] ${obs}`;
            }
        }
    }
    
    const newEntry = {
        id: 'caixa-' + Date.now(),
        date: formattedDate,
        type: type,
        description: description,
        unit: unit,
        value: value,
        comprovante: pendingCaixaComprovante
    };
    
    CAIXA_DATA.push(newEntry);
    saveState();
    logActivity(`Registrou lançamento no Caixa de ${(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${type})`);
    
    closeNewCaixaModal();
    loadCaixaData();
}

function generateCaixaReport() {
    const entradas = CAIXA_DATA.filter(c => c.type === 'Entrada').sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
    const saidas = CAIXA_DATA.filter(c => c.type === 'Saída').sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
    
    const totalEntradas = entradas.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
    const totalSaidas = saidas.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
    const saldo = totalEntradas - totalSaidas;

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Relatório de Caixa - Bueno Residence</title>
        <style>
            body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1e293b; background-color: #f8fafc; line-height: 1.5; }
            .report-container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .title-area h1 { margin: 0 0 5px 0; color: #0f172a; font-size: 24px; }
            .title-area p { margin: 0; color: #64748b; font-size: 14px; }
            .meta-info { text-align: right; font-size: 14px; color: #64748b; }
            
            .summary-cards { display: flex; gap: 20px; margin-bottom: 30px; }
            .card { flex: 1; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0; }
            .card-title { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 5px; }
            .card-value { font-size: 22px; font-weight: 700; }
            
            .section-title { font-size: 18px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 15px; }
            .section-entradas { color: #02c39a; }
            .section-saidas { color: #e63946; }
            
            table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f1f5f9; font-weight: 600; color: #475569; }
            
            @media print {
                body { background-color: white; padding: 0; }
                .report-container { box-shadow: none; padding: 0; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <div class="title-area">
                    <h1>Relatório Livro Caixa - ${getNextFridayDate()}</h1>
                    <p>Bueno Residence - Gestão Financeira da Semana</p>
                </div>
                <div class="meta-info">
                    Gerado em: <strong>${dataAtual}</strong>
                </div>
            </div>
            
            <div class="summary-cards">
                <div class="card" style="background-color: rgba(46, 196, 182, 0.05); border-color: rgba(46, 196, 182, 0.2);">
                    <div class="card-title">Total de Entradas</div>
                    <div class="card-value" style="color: #02c39a;">${totalEntradas.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                </div>
                <div class="card" style="background-color: rgba(230, 57, 70, 0.05); border-color: rgba(230, 57, 70, 0.2);">
                    <div class="card-title">Total de Saídas</div>
                    <div class="card-value" style="color: #e63946;">${totalSaidas.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                </div>
                <div class="card" style="background-color: ${saldo >= 0 ? 'rgba(46, 196, 182, 0.1)' : 'rgba(230, 57, 70, 0.1)'}; border-color: ${saldo >= 0 ? '#02c39a' : '#e63946'};">
                    <div class="card-title">Saldo Líquido</div>
                    <div class="card-value" style="color: ${saldo >= 0 ? '#02c39a' : '#e63946'};">${saldo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                </div>
            </div>
            
            <h2 class="section-title section-entradas">Demonstrativo de Entradas (Receitas)</h2>
            <table>
                <thead>
                    <tr>
                        <th width="15%">Data</th>
                        <th width="65%">Descrição</th>
                        <th width="20%">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${entradas.map(c => `
                        <tr>
                            <td>${c.date}</td>
                            <td>${c.description} ${c.unit ? `<span style="color:#64748b; font-size:11px; display:block;">${c.unit}</span>` : ''}</td>
                            <td style="font-weight: 600; color: #02c39a;">${c.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                        </tr>
                    `).join('') || '<tr><td colspan="3" style="text-align:center; color:#94a3b8;">Nenhuma entrada registrada.</td></tr>'}
                </tbody>
            </table>
            
            <h2 class="section-title section-saidas">Demonstrativo de Saídas (Despesas)</h2>
            <table>
                <thead>
                    <tr>
                        <th width="15%">Data</th>
                        <th width="65%">Observação / Motivo</th>
                        <th width="20%">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${saidas.map(c => `
                        <tr>
                            <td>${c.date}</td>
                            <td>${c.description}</td>
                            <td style="font-weight: 600; color: #e63946;">${c.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                        </tr>
                    `).join('') || '<tr><td colspan="3" style="text-align:center; color:#94a3b8;">Nenhuma saída registrada.</td></tr>'}
                </tbody>
            </table>
            
            <div class="no-print" style="text-align: center; margin-top: 40px;">
                <button onclick="window.print()" style="padding: 10px 20px; background-color: #0f172a; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Imprimir PDF</button>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}
