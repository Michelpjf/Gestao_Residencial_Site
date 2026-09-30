/* Dashboard e relatório essencial alimentados exclusivamente pela API. */
let dashboardLoadVersion = 0;

function applyUserRoleSettings() {
    const body = document.body;
    body.classList.remove('role-admin', 'role-gerente', 'role-gestor', 'role-financeiro', 'role-manutencao');
    body.classList.add(`role-${currentUser.role}`);

    document.getElementById('user-name-display').textContent = currentUser.name;
    document.getElementById('welcome-user-name').textContent = currentUser.name.split(' ')[0];
    document.getElementById('user-building').textContent = currentUser.building;

    const initials = currentUser.name.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('avatar-letters').textContent = initials;

    const roleBadge = document.getElementById('user-role-display');
    roleBadge.textContent = currentUser.role.toUpperCase();
    roleBadge.className = 'user-role';
    roleBadge.classList.add(`badge-${currentUser.role}`);
}

function showDashboardState(state) {
    for (const name of ['loading', 'error', 'content']) {
        const element = document.getElementById(`dashboard-${name}`);
        if (element) element.hidden = name !== state;
    }
}

function createReportCell(value, className) {
    const cell = document.createElement('td');
    cell.textContent = value;
    if (className) cell.className = className;
    return cell;
}

function formatUnit(row) {
    if (!row.unitId) return '—';
    return row.unitSubdivision
        ? `${row.unitSubdivision} · ${row.unitIdentification}`
        : row.unitIdentification;
}

function renderDashboardReport(report) {
    const { summary, rows } = report;
    document.getElementById('stat-active-buildings').textContent = summary.activeBuildings;
    document.getElementById('stat-units').textContent = summary.units;
    document.getElementById('stat-vacant-units').textContent = summary.vacantUnits;
    document.getElementById('stat-occupied-units').textContent = summary.occupiedUnits;
    document.getElementById('stat-scheduled-contracts').textContent = summary.scheduledContracts;
    document.getElementById('stat-active-contracts').textContent = summary.activeContracts;
    document.getElementById('stat-active-tenants').textContent = summary.activeTenants;
    document.getElementById('stat-archived-tenants').textContent = summary.archivedTenants;

    const body = document.getElementById('essential-report-body');
    body.replaceChildren();
    document.getElementById('essential-report-empty').hidden = rows.length !== 0;

    for (const row of rows) {
        const tableRow = document.createElement('tr');
        tableRow.append(
            createReportCell(row.buildingName, 'report-building'),
            createReportCell(formatUnit(row)),
            createReportCell(row.tenantName || '—'),
            createReportCell(row.contractNumber === null ? '—' : `#${row.contractNumber}`)
        );
        body.appendChild(tableRow);
    }
}

function resetDashboardView() {
    dashboardLoadVersion += 1;
    for (const id of ['stat-active-buildings', 'stat-units', 'stat-vacant-units', 'stat-occupied-units',
        'stat-scheduled-contracts', 'stat-active-contracts', 'stat-active-tenants', 'stat-archived-tenants']) {
        const element = document.getElementById(id);
        if (element) element.textContent = '—';
    }
    const body = document.getElementById('essential-report-body');
    if (body) body.replaceChildren();
    showDashboardState('loading');
}

async function loadDashboardData() {
    const version = ++dashboardLoadVersion;
    const errorMessage = document.getElementById('dashboard-error-message');
    showDashboardState('loading');

    try {
        const report = await window.dashboardApi.getEssentialReport();
        if (version !== dashboardLoadVersion) return;
        renderDashboardReport(report);
        showDashboardState('content');
    } catch (error) {
        if (version !== dashboardLoadVersion) return;
        errorMessage.textContent = error?.status === 403
            ? 'Você não tem permissão para acessar este resumo.'
            : 'Não foi possível carregar o painel. Tente novamente.';
        showDashboardState('error');
    }
}

document.getElementById('dashboard-retry')?.addEventListener('click', loadDashboardData);
