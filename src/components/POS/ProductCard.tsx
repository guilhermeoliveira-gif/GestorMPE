import React from 'react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils';
import { Plus } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
    return (
        <div
            onClick={() => onAdd(product)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-95 touch-manipulation flex flex-col h-full"
        >
            <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                {/* Placeholder for Image if not available */}
                <span className="text-4xl text-gray-300">📦</span>
                {/* Mobile "Add" Overlay Hint */}
                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                    <Plus size={16} />
                </div>
            </div>
            <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight">{product.nome}</h3>
                    <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                </div>
                <div className="mt-2 font-bold text-indigo-600 text-lg">
                    {formatCurrency(product.preco_venda)}
                </div>
            </div>
        </div>
    );
};
