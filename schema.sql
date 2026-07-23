-- Criação das tabelas para o Bueno Residence

-- 1. Tabela de Prédios (Buildings)
CREATE TABLE public.buildings (
    id text PRIMARY KEY,
    name text NOT NULL,
    units integer,
    occupied integer,
    manager text,
    rate numeric,
    start_num integer,
    suffix text,
    theme text,
    subdivisions jsonb
);

-- 2. Tabela de Contratos (Contracts)
CREATE TABLE public.contracts (
    id text PRIMARY KEY,
    tenant text NOT NULL,
    phone text,
    unit text,
    building_id text,
    rent_value numeric,
    due_day integer,
    start_date text,
    end_date text,
    status text,
    file_url text
);

-- 3. Tabela de Caixa (Cashbox)
CREATE TABLE public.cashbox (
    id text PRIMARY KEY,
    date text NOT NULL,
    type text NOT NULL,
    description text,
    unit text,
    value numeric NOT NULL
);

-- Configuração de Segurança Básica (Permitir acesso anônimo para desenvolvimento)
-- ATENÇÃO: Em produção, isso deve ser restrito.
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON public.buildings FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.buildings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON public.buildings FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON public.buildings FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON public.contracts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON public.contracts FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON public.contracts FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON public.cashbox FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.cashbox FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON public.cashbox FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON public.cashbox FOR DELETE USING (true);
