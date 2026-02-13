import React, { useState } from 'react';
import { formatCurrency } from '../../utils';
import { Button } from '../UI';
import { CreditCard, Banknote, Smartphone, X, Check } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onConfirm: (method: PaymentMethod) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, onConfirm }) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    if (!isOpen) return null;

    const methods = [
        { id: 'cash' as PaymentMethod, label: 'Dinheiro', icon: Banknote, color: 'text-green-600 bg-green-50 border-green-200' },
        { id: 'credit_card' as PaymentMethod, label: 'Crédito', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-200' },
        { id: 'debit_card' as PaymentMethod, label: 'Débito', icon: CreditCard, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
        { id: 'pix' as PaymentMethod, label: 'Pix', icon: Smartphone, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Finalizar Venda</h2>
                        <p className="text-sm text-gray-500 mt-1">Selecione a forma de pagamento</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* Total Display */}
                <div className="p-8 text-center bg-white">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total a Pagar</span>
                    <div className="text-5xl font-extrabold text-indigo-600 mt-2">
                        {formatCurrency(total)}
                    </div>
                </div>

                {/* Payment Methods Grid */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-4">
                    {methods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`
                        p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200
                        ${selectedMethod === method.id
                                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-200 shadow-md transform scale-[1.02]'
                                    : 'border-transparent bg-white hover:bg-gray-100 hover:border-gray-200 shadow-sm'}
                    `}
                        >
                            <method.icon className={`w-8 h-8 ${method.color.split(' ')[0]}`} />
                            <span className="font-bold text-gray-700">{method.label}</span>
                        </button>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
                    <Button variant="ghost" className="flex-1 py-3" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-[2] py-3 text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                        disabled={!selectedMethod}
                        onClick={() => selectedMethod && onConfirm(selectedMethod)}
                    >
                        <Check size={20} />
                        Confirmar Pagamento
                    </Button>
                </div>

            </div>
        </div>
    );
};
