import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const productService = {
    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('nome');

        if (error) throw error;
        return data as Product[];
    },

    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Product;
    },

    async saveProduct(product: Omit<Product, 'id' | 'created_at'>) {
        if (product.company_id === 'demo-user-id') {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                ...product,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString()
            } as Product;
        }

        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async updateProduct(id: string, product: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async deleteProduct(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
