import { supabase } from '../lib/supabase';
import { Order, OrderItem } from '../types';

export const orderService = {
    async createOrder(order: Omit<Order, 'id' | 'created_at' | 'user_id' | 'items'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // 1. Create Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: user.id,
                client_id: order.client_id,
                total_amount: order.total_amount,
                status: order.status,
                payment_method: order.payment_method
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create Create Items
        const itemsToInsert = items.map(item => ({
            order_id: orderData.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError; // Should rollback order ideally, but simple for now

        // 3. Update Financials (Auto-create transaction)
        if (order.status === 'completed') {
            // We could call financeService here or let a Database Trigger handle it.
            // For now, let's keep it simple and just record the order.
        }

        return orderData;
    },

    async getOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select('*, client:clients(*), items:order_items(*, product:products(*))')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    }
};
