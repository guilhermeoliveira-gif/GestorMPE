import { supabase } from '../lib/supabase';
import { FinancialTransaction, FinancialCategory } from '../types';

export const financeService = {
    // --- Transactions ---

    async getTransactions() {
        const { data, error } = await supabase
            .from('financial_transactions')
            .select('*, category:financial_categories(*)')
            .order('due_date', { ascending: true });

        if (error) throw error;
        return data as FinancialTransaction[];
    },

    async createTransaction(transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'user_id' | 'category'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('financial_transactions')
            .insert([{ ...transaction, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data as FinancialTransaction;
    },

    async updateTransaction(id: string, updates: Partial<FinancialTransaction>) {
        const { error } = await supabase
            .from('financial_transactions')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    },

    async deleteTransaction(id: string) {
        const { error } = await supabase
            .from('financial_transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Categories ---

    async getCategories() {
        const { data, error } = await supabase
            .from('financial_categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as FinancialCategory[];
    },

    async createCategory(category: Omit<FinancialCategory, 'id' | 'user_id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('financial_categories')
            .insert([{ ...category, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data as FinancialCategory;
    }
};
