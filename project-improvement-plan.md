# Plano de Melhorias e Roadmap - GestorMpe
> **Status**: Em Planejamento
> **Autor**: Project Planner & Product Owner Agent

## 1. Visão Geral
Este documento define o plano estratégico para evoluir o **GestorMpe** de um protótipo funcional para um ERP robusto de gestão para micro e pequenas empresas. O foco está na estruturação do código, implementação do módulo financeiro e aprimoramento das funcionalidades de vendas e gestão de clientes.

## 2. Diagnóstico Atual
- **Estrutura de Arquivos**: O projeto utiliza uma estrutura plana na raiz (não convencional), o que dificulta a escalabilidade.
- **Módulos Existentes**:
    - **Clientes**: CRUD básico funcional. Falta gestão financeira/carteira.
    - **Pedidos**: Interface POS com dados mockados. Falta integração real com banco e baixa de estoque.
    - **Produtos**: CRUD básico.
- **Lacunas**:
    - Módulo Financeiro inexistente.
    - Gestão de Carteira de Clientes (limite de crédito, histórico).
    - Controle de Estoque real.

## 3. Roadmap de Funcionalidades (Epics)

### 🏗️ Epic 1: Reestruturação e Base (Tech Debt)
**Objetivo**: Organizar o código para permitir crescimento sustentável.
- [ ] **Refatoração de Pastas**: Mover arquivos para estrutura padrão (`src/pages`, `src/features`, `src/components`).
- [ ] **Padronização de UI**: Centralizar componentes de UI em `src/components/ui`.
- [ ] **Contextos**: Melhorar `AuthContext` e criar `ToastContext` se necessário.

### 💰 Epic 2: Módulo Financeiro (Novo)
**Objetivo**: Implementar controle de fluxo de caixa.
- [ ] **Contas a Pagar**: Cadastro, categorias, data de vencimento, status.
- [ ] **Contas a Receber**: Integração automática com Pedidos, baixa manual.
- [ ] **Fluxo de Caixa**: Visualização de entradas vs saídas.
- [ ] **Modelagem de Dados**: Criar tabelas `financial_accounts`, `categories`.

### 🤝 Epic 3: Carteira de Clientes (Melhoria)
**Objetivo**: Transformar o cadastro em uma ferramenta de gestão de relacionamento e crédito.
- [ ] **Perfil Digital 360º**: Abas Dados, Vendas, Conta (Carteira).
- [ ] **Gestão da Carteira (Fiado)**:
    - Saldo em destaque (Cor: Vermelho/Verde).
    - **Ações**: "Pagar Débito" (Entrada de caixa) e "Ajuste de Saldo" (Manual, com auditoria).
    - **Extrato**: Histórico detalhado de movimentações (Débito vs Pagamento).
- [ ] **Dashboard de Inadimplência**: Filtros e totalizadores na listagem.

### 🛒 Epic 4: Gestão de Pedidos e Estoque (Melhoria & Mobile POS)
**Objetivo**: Tornar o módulo de vendas funcional, integrado e fiel ao layout mobile.
- [ ] **Histórico de Vendas (Novo)**:
    - Listagem agrupada por Data (Hoje, Ontem).
    - Filtro por Vendedor e Resumo financeiro diário/mensal (Rodapé).
    - Detalhe da Venda: Ícone do método de paganento, Itens, Valor, Vendedor.
- [ ] **Interface Mobile POS**:
    - Grid de produtos com seleção rápida (Toque simples).
    - Teclado numérico virtual para input de valores.
    - Carrinho simplificado com swipe para remover (se aplicável) ou botões +/-.
- [ ] **Pagamento Avançado (Split Payment)**:
    - Suporte a múltiplos métodos (Dinheiro + Cartão, etc.).
    - Cálculo automático de "Faltam R$ X,XX".
    - Opção "Venda Fiado" (Integração com Carteira de Cliente).
- [ ] **Integração Real**: Substituir produtos mockados por dados do Supabase.
- [ ] **Baixa de Estoque**: Deduzir quantidade ao finalizar pedido.
- [ ] **Comprovantes e Recibos (Novo)**:
    - Tela de "Venda Concluída" com sucesso (Check visual).
    - Geração de Recibo detalhado (PDF/HTML) com logo e dados da empresa.
    - Opções de compartilhamento: PDF, Email, Imprimir e Compartilhar (WhatsApp).

### 📦 Epic 5: Produtos e Catálogo (Novo)
**Objetivo**: Cadastro completo com variações e controle de estoque visual.
- [ ] **Cadastro Avançado**:
    - Campos: Código de Barras (Leitura por Câmera), Custo vs Venda, Margem.
    - **Variantes**: Grade de Cor/Tamanho (Botão "Variantes" nas fotos).
    - Opção "Vender por Unidade/Kg/Litro".
- [ ] **Controle de Estoque Visual**:
    - Toggle "Gerenciar Estoque".
    - Numeral grande centralizado para ajuste rápido.
    - Histórico de movimentações e Estoque Mínimo.
- [ ] **Catálogo Online**:
    - Toggle "Exibir produto no catálogo".
    - Link público para compartilhamento.

### 📊 Epic 6: Estatísticas e Relatórios (Novo)
**Objetivo**: Painel de inteligência para tomada de decisão.
- [ ] **Dashboard Principal**:
    - Filtro de Período (Mês anterior, Mês atual, Personalizado).
    - **Cards de Métricas**: Faturamento, Qtd Vendas, Ticket Médio, Lucro.
    - **Gráficos (Sparklines)**: Tendência visual em cada card.
- [ ] **Rankings (Top Lists)**:
    - Produtos mais vendidos (Valor/Qtd).
    - Melhores Clientes (VIPs).
    - Desempenho por Vendedor.
- [ ] **Análise de Pagamento**: Gráfico de rosca (Pix vs Cartão vs Dinheiro).

## 4. Plano Técnico de Execução

### Fase 1: Fundação (Imediato)
1.  Criar estrutura de pastas (`src/pages`, `src/services`, `src/hooks`).
2.  Mover arquivos existentes e corrigir importações.
3.  Configurar `Project-Planner` tasks para as próximas fases.

### Fase 2: Implementação Financeira
1.  Criar tabelas no Supabase (`financeiro`).
2.  Desenvolver telas de listagem e cadastro de contas.
3.  Implementar Dashboard Financeiro básico.

### Fase 3: Integração Vendas-Financeiro
1.  Atualizar `Orders.tsx` para salvar no banco.
2.  Criar triggers ou lógica de serviço para gerar conta a receber ao fechar pedido.
3.  Atualizar `Clients.tsx` para mostrar resumo financeiro.

## 5. Próximos Passos
O usuário deve aprovar este plano para iniciarmos pela **Fase 1: Fundação**.

---
**Aprovação necessária**: Confirme se a ordem de prioridade (Estrutura -> Financeiro -> Vendas) está alinhada com sua expectativa.
