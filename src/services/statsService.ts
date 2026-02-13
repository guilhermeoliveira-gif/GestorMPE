import { supabase } from '../lib/supabase';

export const statsService = {
    async getDashboardStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // 1. Orders Stats
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount, created_at, status');

        if (ordersError) throw ordersError;

        // 2. Financial Stats (Transactions)
        const { data: transactions, error: transError } = await supabase
            .from('financial_transactions')
            .select('amount, type, status');

        if (transError) throw transError;

        const totalPayable = transactions
            .filter(t => t.type === 'expense' && t.status === 'pending')
            .reduce((acc, t) => acc + t.amount, 0);

        const totalReceivableFinance = transactions
            .filter(t => t.type === 'income' && t.status === 'pending')
            .reduce((acc, t) => acc + t.amount, 0);

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalRevenue = orders.reduce((acc, o) => acc + (o.status === 'completed' ? o.total_amount : 0), 0);
        const monthlyRevenue = orders
            .filter(o => new Date(o.created_at) >= firstDayOfMonth && o.status === 'completed')
            .reduce((acc, o) => acc + o.total_amount, 0);

        const totalPending = orders
            .filter(o => o.status === 'pending')
            .reduce((acc, o) => acc + o.total_amount, 0);

        // 3. Client Count
        const { count: clientCount, error: clientError } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true });

        if (clientError) throw clientError;

        // 4. Top Products (Simple aggregation)
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('product_id, quantity, product:products(nome)');

        if (itemsError) throw itemsError;

        const productMap: Record<string, { nome: string, total: number }> = {};
        items.forEach(item => {
            const id = item.product_id;
            const nome = (item.product as any)?.nome || 'Produto Removido';
            if (!productMap[id]) productMap[id] = { nome, total: 0 };
            productMap[id].total += item.quantity;
        });

        const topProducts = Object.values(productMap)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        // 5. Sales by Day (Last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const salesByDay = last7Days.map(day => {
            const total = orders
                .filter(o => o.created_at.startsWith(day) && o.status === 'completed')
                .reduce((acc, o) => acc + o.total_amount, 0);
            return { day: day.split('-').slice(1).join('/'), total };
        });

        return {
            totalRevenue,
            monthlyRevenue,
            totalPending,
            totalPayable,
            totalReceivableFinance,
            clientCount: clientCount || 0,
            topProducts,
            salesByDay
        };
    }
};
