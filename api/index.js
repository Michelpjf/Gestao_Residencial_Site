const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const PDFDocument = require('pdfkit');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
