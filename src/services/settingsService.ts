import { supabase } from '../lib/supabase';

export interface CompanySettings {
    id?: string;
    company_name: string;
    company_phone: string;
    company_address: string;
    company_logo_url: string;
    company_document: string;
    user_id?: string;
}

export const settingsService = {
    async getSettings() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return data as CompanySettings | null;
    },

    async saveSettings(settings: Omit<CompanySettings, 'id' | 'user_id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const existing = await this.getSettings();

        if (existing) {
            const { data, error } = await supabase
                .from('settings')
                .update(settings)
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            return data as CompanySettings;
        } else {
            const { data, error } = await supabase
                .from('settings')
                .insert([{ ...settings, user_id: user.id }])
                .select()
                .single();
            if (error) throw error;
            return data as CompanySettings;
        }
    }
};
