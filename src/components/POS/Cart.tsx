import React from 'react';
import { Product, OrderItem } from '../../types';
import { formatCurrency } from '../../utils';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '../UI';

interface CartProps {
    items: (OrderItem & { product: Product })[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemove: (productId: string) => void;
    onCheckout: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, isOpen, onClose }) => {
    const total = items.reduce((acc, item) => acc + item.total_price, 0);

    return (
        <>
            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
        fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:static md:h-screen md:border-l md:border-gray-200
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                            <ShoppingCart size={20} />
                            Carrinho
                        </h2>
                        <button onClick={onClose} className="md:hidden p-2 text-gray-500">
                            Fechar
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center text-gray-400 mt-10">
                                Seu carrinho está vazio.
                                <br />
                                Adicione produtos para começar.
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.product_id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 line-clamp-1">{item.product.nome}</h4>
                                        <p className="text-sm text-indigo-600 font-bold">
                                            {formatCurrency(item.unit_price)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                className="p-1 hover:bg-gray-100 text-gray-600"
                                                onClick={() => onUpdateQuantity(item.product_id, -1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                className="p-1 hover:bg-gray-100 text-gray-600"
                                                onClick={() => onUpdateQuantity(item.product_id, 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => onRemove(item.product_id)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Total</span>
                            <span className="text-2xl font-bold text-indigo-700">{formatCurrency(total)}</span>
                        </div>
                        <Button
                            variant="primary"
                            className="w-full py-4 text-lg shadow-lg bg-green-600 hover:bg-green-700"
                            onClick={onCheckout}
                            disabled={items.length === 0}
                        >
                            Finalizar Venda
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};
