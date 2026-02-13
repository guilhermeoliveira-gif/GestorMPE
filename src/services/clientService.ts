import { supabase } from '../lib/supabase';
import { Client } from '../types';

export const clientService = {
    async getClients() {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('nome_completo');

        if (error) throw error;
        return data as Client[];
    },

    async getClientById(id: string) {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Client;
    },

    async saveClient(client: Omit<Client, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('clients')
            .insert([client])
            .select()
            .single();

        if (error) throw error;
        return data as Client;
    },

    async updateClient(id: string, client: Partial<Client>) {
        const { data, error } = await supabase
            .from('clients')
            .update(client)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Client;
    },

    async deleteClient(id: string) {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async updateBalance(id: string, amount: number) {
        // Increment or decrement balance
        const { data: currentClient, error: fetchError } = await supabase
            .from('clients')
            .select('saldo_devedor')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const newBalance = (currentClient.saldo_devedor || 0) + amount;

        const { data, error } = await supabase
            .from('clients')
            .update({ saldo_devedor: newBalance })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Client;
    }
};
