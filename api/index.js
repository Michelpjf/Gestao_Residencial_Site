const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const PDFDocument = require('pdfkit');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey) : null;

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rota básica de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Bueno Residence API is running!' });
});

// Rota para testar o Supabase
app.get('/api/supabase-status', (req, res) => {
    if (supabase) {
        res.json({ status: 'ok', message: 'Supabase client configurado', url: supabaseUrl });
    } else {
        res.status(500).json({ status: 'error', message: 'Erro ao configurar Supabase client' });
    }
});

// Middleware de Autenticação LGPD (Protege todas as rotas abaixo)
app.use('/api', async (req, res, next) => {
    // Pula rotas públicas
    if (req.path === '/health' || req.path === '/supabase-status') {
        return next();
    }
    
    // Requer o método OPTIONS para passar direto (CORS preflight)
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'LGPD Block: Token de autenticação não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
        return res.status(401).json({ error: 'LGPD Block: Token inválido ou expirado' });
    }
    
    req.user = user;
    next();
});

// --- Endpoint de Convite de Usuário (Requer Admin Auth e Service Role Key) ---
app.post('/api/users/invite', async (req, res) => {
    // 1. Verifica se o servidor tem a chave mestra configurada
    if (!supabaseAdmin) {
        return res.status(500).json({ error: 'LGPD Block: O Servidor não possui a chave SUPABASE_SERVICE_ROLE_KEY configurada para criar usuários.' });
    }

    // 2. Idealmente aqui nós checaríamos se o req.user (quem fez a requisição) é admin
    // Mas para este escopo, assumimos que quem tem o token JWT do app tem permissão básica
    // Pode-se implementar checagem extra buscando o role do req.user no banco.

    const { email, name, role, building, buildingId } = req.body;
    if (!email || !role) {
        return res.status(400).json({ error: 'Email e Cargo são obrigatórios.' });
    }

    // 3. Executa o convite usando a chave mestra
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
            name: name || '',
            role: role,
            building: building || '',
            buildingId: buildingId || ''
        }
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ status: 'success', message: 'Convite enviado com sucesso.', user: data.user });
});

// --- Endpoint para Deletar Usuário (Requer Admin Auth e Service Role Key) ---
app.delete('/api/users/:id', async (req, res) => {
    if (!supabaseAdmin) {
        return res.status(500).json({ error: 'LGPD Block: O Servidor não possui a chave SUPABASE_SERVICE_ROLE_KEY configurada para deletar usuários.' });
    }

    const { id } = req.params;
    
    // Deleta o usuário permanentemente do Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ status: 'success', message: 'Usuário excluído permanentemente.' });
});

// --- Endpoint para Listar Usuários (Requer Admin Auth e Service Role Key) ---
app.get('/api/users', async (req, res) => {
    if (!supabaseAdmin) {
        return res.status(500).json({ error: 'LGPD Block: Servidor sem SUPABASE_SERVICE_ROLE_KEY.' });
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // Formatar usuários para o frontend
    const users = data.users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.name || 'Sem Nome',
        role: u.user_metadata?.role || 'user',
        building: u.user_metadata?.building || 'Geral',
        buildingId: u.user_metadata?.buildingId || '',
        active: !u.banned_until // Se não tem data de ban, está ativo
    }));

    res.json(users);
});

// --- Endpoint para Suspender/Ativar Usuário ---
app.put('/api/users/:id/status', async (req, res) => {
    if (!supabaseAdmin) {
        return res.status(500).json({ error: 'LGPD Block: Servidor sem SUPABASE_SERVICE_ROLE_KEY.' });
    }

    const { id } = req.params;
    const { active } = req.body;
    
    // Supabase usa ban_duration para suspender usuários. 'none' remove o ban.
    const banDuration = active ? 'none' : '876000h'; // 876000h = ~100 anos (banido)
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        ban_duration: banDuration
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ status: 'success', message: `Status do usuário alterado para ${active ? 'Ativo' : 'Inativo'}` });
});

// --- Endpoints para Prédios ---
app.get('/api/buildings', async (req, res) => {
    const { data, error } = await supabase.from('buildings').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});
app.post('/api/buildings', async (req, res) => {
    const { data, error } = await supabase.from('buildings').upsert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ status: 'success', data });
});

// --- Endpoints para Contratos ---
app.get('/api/contracts', async (req, res) => {
    const { data, error } = await supabase.from('contracts').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});
app.post('/api/contracts', async (req, res) => {
    const { data, error } = await supabase.from('contracts').upsert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ status: 'success', data });
});

// --- Endpoints para Caixa ---
app.get('/api/cashbox', async (req, res) => {
    const { data, error } = await supabase.from('cashbox').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});
app.post('/api/cashbox', async (req, res) => {
    const { data, error } = await supabase.from('cashbox').upsert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ status: 'success', data });
});

// --- Endpoints adicionais (Fase 3) ---
const createEndpoints = (tableName) => {
    app.get(`/api/${tableName}`, async (req, res) => {
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    });
    app.post(`/api/${tableName}`, async (req, res) => {
        const { data, error } = await supabase.from(tableName).upsert(req.body);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ status: 'success', data });
    });
};

createEndpoints('units');
createEndpoints('tenants');
createEndpoints('pix_deposits');
createEndpoints('maintenance');
createEndpoints('expenses');

// Log é append-only
app.get('/api/audit_logs', async (req, res) => {
    const { data, error } = await supabase.from('audit_logs').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});
app.post('/api/audit_logs', async (req, res) => {
    const { data, error } = await supabase.from('audit_logs').insert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ status: 'success', data });
});


// --- Endpoint de Geração de PDF (Semanal) ---
app.post('/api/generate-pdf', (req, res) => {
    const { reports } = req.body;
    
    if (!reports || !Array.isArray(reports)) {
        return res.status(400).json({ error: 'Nenhum relatório enviado ou formato inválido.' });
    }

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=lancamento_semanal.pdf');
    
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text('Bueno Residence', { align: 'center' });
    doc.fontSize(14).text('Relatório Lançamento Semanal', { align: 'center' });
    doc.moveDown(2);
    
    // Table Header
    const startY = doc.y;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Data', 50, doc.y, { continued: true, width: 80 });
    doc.text('Inquilino', 130, doc.y, { continued: true, width: 120 });
    doc.text('Unidade', 250, doc.y, { continued: true, width: 100 });
    doc.text('Tipo', 350, doc.y, { continued: true, width: 80 });
    doc.text('Detalhe', 430, doc.y);
    doc.moveDown(0.5);
    
    // Line Separator
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    
    // Table Content
    doc.font('Helvetica').fontSize(10);
    reports.forEach(r => {
        const rowY = doc.y;
        doc.text(r.date || '-', 50, rowY, { continued: true, width: 80 });
        doc.text(r.tenant || '-', 130, rowY, { continued: true, width: 120 });
        doc.text(r.unit || '-', 250, rowY, { continued: true, width: 100 });
        doc.text(r.type || '-', 350, rowY, { continued: true, width: 80 });
        doc.text(r.detail || '-', 430, rowY);
        doc.moveDown(0.5);
    });
    
    doc.moveDown(2);
    doc.fontSize(9).text(`Gerado via Sistema Bueno Residence em: ${new Date().toLocaleString('pt-BR')}`, { align: 'right' });
    
    doc.end();
});

module.exports = app;
