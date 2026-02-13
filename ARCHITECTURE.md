# Arquitetura do Sistema - GestorMpe

## 🚀 Visão Geral
O **GestorMpe** é um Sistema Integrado de Gestão Comercial (ERP/CRM) projetado especificamente para Micro e Pequenas Empresas. O foco é fornecer uma interface intuitiva, rápida e segura para operações do dia a dia.

## 🛠️ Stack Tecnológica
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Estilização**: Tailwind CSS (Sistema de Design Personalizado)
- **Backend/BAAS**: Supabase (Auth & Database)
- **Roteamento**: React Router Dom 7 (HashRouter)
- **Notificações**: React Hot Toast
- **Ícones**: Lucide React

## 📂 Estrutura do Projeto
- `/src/pages`: Componentes de página (Dashboard, Clientes, Produtos, Pedidos, Usuários).
- `/src/components`: Componentes reutilizáveis e biblioteca de UI.
- `/src/contexts`: Provedores de estado global (Ex: Autenticação).
- `/src/types.ts`: Definições globais de interfaces e enums.
- `supabase.ts`: Configuração do cliente Supabase.

## 🔐 Segurança e Acesso (RBAC)
O sistema utiliza um modelo de Controle de Acesso Baseado em Funções (Role-Based Access Control):
- **ADMIN**: Acesso total ao sistema.
- **SALES**: Acesso a Clientes, Produtos e Pedidos.
- **FINANCE**: Acesso a registros financeiros.
- **FISCAL**: Acesso a emissão de NF-e.

## 📦 Módulos Principais
1. **Pedidos (POS)**: Interface otimizada para vendas rápidas com carrinho lateral.
2. **Produtos**: Cadastro completo com SKU, controle de custo e preço de venda.
3. **Clientes**: CRM básico para gestão de contatos.
4. **Dashboard**: Visão executiva dos indicadores de desempenho.

## 🚧 Roadmap / Em Desenvolvimento
- Módulo Financeiro (Contas a Pagar/Receber).
- Emissão de Nota Fiscal Eletrônica (NF-e).
- Relatórios Avançados.
