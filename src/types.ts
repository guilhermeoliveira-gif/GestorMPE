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

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'split';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product; // Join
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  company_id?: string; // Legacy or future
  user_id: string;
  client_id?: string;
  client?: Client; // Join
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: PaymentMethod;
  items?: OrderItem[];
  created_at: string;
}

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  user_id: string;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'pending' | 'paid';
  due_date: string; // ISO Date
  payment_date?: string; // ISO Date
  category_id?: string;
  category?: FinancialCategory; // Join
  user_id: string;
  created_at: string;
}
