import React, { useState, useEffect } from 'react';
import { Product, OrderItem, PaymentMethod } from '../../types';
import { productService } from '@/src/services/productService';
import { orderService } from '../../services/orderService';
import { ProductCard } from '../../components/POS/ProductCard';
import { Cart } from '../../components/POS/Cart';
import { PaymentModal } from '../../components/POS/PaymentModal';
import { Search, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export const POSPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<(OrderItem & { product: Product })[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        setFilteredProducts(products.filter(p =>
            p.nome.toLowerCase().includes(lower) ||
            p.sku.toLowerCase().includes(lower)
        ));
    }, [search, products]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            toast.error('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product: Product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.product_id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.unit_price }
                        : item
                );
            }
            return [...prev, {
                id: crypto.randomUUID(),
                order_id: '',
                product_id: product.id,
                product,
                quantity: 1,
                unit_price: product.preco_venda,
                total_price: product.preco_venda
            }];
        });
        toast.success(`${product.nome} adicionado!`, { duration: 1000, position: 'bottom-center' });
    };

    const handleUpdateQuantity = (productId: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.product_id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty, total_price: newQty * item.unit_price };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleRemove = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.product_id !== productId));
    };

    const handleCheckout = () => {
        setIsPaymentOpen(true);
    };

    const handleConfirmPayment = async (method: PaymentMethod) => {
        try {
            const total = cartItems.reduce((acc, item) => acc + item.total_price, 0);

            await orderService.createOrder({
                total_amount: total,
                status: 'completed',
                payment_method: method
            }, cartItems);

            toast.success('Venda realizada com sucesso!');
            setCartItems([]);
            setIsPaymentOpen(false);
            setIsCartOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao finalizar venda');
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.total_price, 0);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="bg-white p-4 shadow-sm flex items-center justify-between z-10 shrink-0">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar produto (Nome, SKU)..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        className="ml-4 md:hidden relative p-2 text-gray-600"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag size={28} />
                        {cartItems.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                            </span>
                        )}
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {loading ? (
                        <div className="flex justify-center mt-20 text-gray-500">Carregando produtos...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center mt-20 text-gray-400">Nenhum produto encontrado.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Cart
                items={cartItems}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onCheckout={handleCheckout}
            />

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                total={total}
                onConfirm={handleConfirmPayment}
            />
        </div>
    );
};
