import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Dialog } from '../../components/UI';
import { clientService } from '../../services/clientService';
import { Product, OrderItem, PaymentMethod, Client } from '../../types';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { ProductCard } from '../../components/POS/ProductCard';
import { Cart } from '../../components/POS/Cart';
import { PaymentModal } from '../../components/POS/PaymentModal';
import { SaleSuccessModal } from '../../components/POS/SaleSuccessModal';
import { settingsService, CompanySettings } from '../../services/settingsService';
import { Search, ShoppingBag, User as UserIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils';

export const POSPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<(OrderItem & { product: Product })[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [lastOrderData, setLastOrderData] = useState<any>(null);
    const [lastOrderItems, setLastOrderItems] = useState<any[]>([]);
    const [settings, setSettings] = useState<CompanySettings | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
        loadClients();
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await settingsService.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Erro ao carregar configurações', error);
        }
    };

    const loadClients = async () => {
        try {
            const data = await clientService.getClients();
            setClients(data);
        } catch (error) {
            console.error('Erro ao carregar clientes', error);
        }
    };


    const categories = ['all', ...Array.from(new Set(products.map(p => p.categoria).filter(Boolean)))];

    useEffect(() => {
        const lower = search.toLowerCase();
        setFilteredProducts(products.filter(p => {
            const matchesSearch = p.nome.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower);
            const matchesCategory = selectedCategory === 'all' || p.categoria === selectedCategory;
            return matchesSearch && matchesCategory;
        }));
    }, [search, selectedCategory, products]);

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

    const handleSetQuantity = (productId: string, quantity: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.product_id === productId) {
                const newQty = Math.max(0, quantity);
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
            const totalAmount = cartItems.reduce((acc, item) => acc + item.total_price, 0);

            if (method === 'split') {
                if (!selectedClient) {
                    toast.error('Selecione um cliente para venda na carteira');
                    return;
                }

                const availableCredit = (selectedClient.limite_credito || 0) - (selectedClient.saldo_devedor || 0);
                if (totalAmount > availableCredit) {
                    toast.error(`Saldo insuficiente! Crédito disponível: ${formatCurrency(availableCredit)}`);
                    return;
                }

                // Update client balance (Debit)
                await clientService.updateBalance(selectedClient.id, totalAmount);
            }

            const result = await orderService.createOrder({
                total_amount: totalAmount,
                status: method === 'split' ? 'pending' : 'completed',
                payment_method: method,
                client_id: selectedClient?.id
            }, cartItems);

            setLastOrderData(result);
            setLastOrderItems(cartItems.map(i => ({
                product_name: i.product.nome,
                quantity: i.quantity,
                unit_price: i.unit_price,
                total_price: i.total_price
            })));

            toast.success('Venda realizada com sucesso!');
            setCartItems([]);
            setIsPaymentOpen(false);
            setIsCartOpen(false);
            setIsSuccessModalOpen(true);
            // Don't reset selectedClient yet, need it for the success modal
            loadClients(); // Refresh client data (for updated balances)
        } catch (error: any) {
            console.error(error);
            toast.error('Erro ao finalizar venda: ' + error.message);
        }
    };

    const handleCloseSuccess = () => {
        setIsSuccessModalOpen(false);
        setSelectedClient(null);
        setLastOrderData(null);
        setLastOrderItems([]);
    };

    const total = cartItems.reduce((acc, item) => acc + item.total_price, 0);

    const [clientSearch, setClientSearch] = useState('');

    const filteredClientsModal = clients.filter(c =>
        c.nome_completo.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.cpf_cnpj.includes(clientSearch)
    );

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

                    <div className="flex items-center gap-3">
                        {selectedClient ? (
                            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                                <div className="flex flex-col">
                                    <span className="text-xs text-indigo-400 font-bold uppercase">Cliente</span>
                                    <span className="text-sm font-bold text-indigo-700">{selectedClient.nome_completo}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedClient(null)}
                                    className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsClientModalOpen(true)}
                                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
                            >
                                <UserIcon size={20} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Selecionar Cliente</span>
                            </button>
                        )}

                        <button
                            className="relative p-2 text-gray-600"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag size={28} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                <div className="bg-white border-t border-gray-100 flex gap-2 overflow-x-auto p-3 scrollbar-hide shrink-0 z-10">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all
                                ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                            `}
                        >
                            {cat === 'all' ? 'Todos' : cat}
                        </button>
                    ))}
                </div>

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
                onSetQuantity={handleSetQuantity}
                onRemove={handleRemove}
                onCheckout={handleCheckout}
            />

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                total={total}
                hasClient={!!selectedClient}
                onConfirm={handleConfirmPayment}
            />
            <SaleSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccess}
                order={lastOrderData}
                items={lastOrderItems}
                client={selectedClient}
                settings={settings}
            />
            <Dialog
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                title="Selecionar Cliente"
            >
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            autoFocus
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {filteredClientsModal.length === 0 ? (
                            <p className="text-center py-4 text-gray-500 text-sm">Nenhum cliente encontrado.</p>
                        ) : filteredClientsModal.map(client => (
                            <button
                                key={client.id}
                                onClick={() => {
                                    setSelectedClient(client);
                                    setIsClientModalOpen(false);
                                    setClientSearch('');
                                }}
                                className="w-full flex justify-between items-center p-3 hover:bg-indigo-50 rounded-lg border border-transparent hover:border-indigo-100 transition-all text-left group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 group-hover:text-indigo-700">{client.nome_completo}</span>
                                    <span className="text-xs text-gray-400 font-mono">{client.cpf_cnpj}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Crédito Disponível</span>
                                    <span className="text-xs font-bold text-emerald-600">
                                        {formatCurrency((client.limite_credito || 0) - (client.saldo_devedor || 0))}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <Button variant="ghost" onClick={() => setIsClientModalOpen(false)}>Fechar</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
