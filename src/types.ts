export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  FINANCE = 'FINANCE',
  FISCAL = 'FISCAL'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_id: string;
  role?: UserRole;
}

export interface Client {
  id: string;
  company_id: string;
  nome_completo: string;
  cpf_cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
}

export interface Product {
  id: string;
  company_id: string;
  nome: string;
  descricao: string;
  sku: string;
  preco_venda: number;
  custo?: number;
  unidade_medida: string;
}

export interface CartItem extends Product {
  quantidade: number;
  total: number;
}

export enum OrderStatus {
  ABERTO = 'ABERTO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  PRONTO_PARA_ENVIO = 'PRONTO_PARA_ENVIO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}

export interface Order {
  id: string;
  company_id: string;
  cliente_id: string;
  data_pedido: string;
  valor_total: number;
  status: OrderStatus;
}

export interface FinancialAccount {
  id: string;
  company_id: string;
  tipo: 'RECEBER' | 'PAGAR';
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  pedido_id?: string;
}
