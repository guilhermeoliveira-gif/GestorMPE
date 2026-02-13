import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils';
import { Button } from '../UI';
import { CreditCard, Banknote, Smartphone, X, Check, Plus, Trash2 } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentPart {
    method: PaymentMethod;
    amount: number;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    hasClient: boolean;
    onConfirm: (method: PaymentMethod, parts?: PaymentPart[]) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, hasClient, onConfirm }) => {
    const [payments, setPayments] = useState<PaymentPart[]>([]);
    const [currentAmount, setCurrentAmount] = useState<string>('');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    const paidAmount = payments.reduce((acc, p) => acc + p.amount, 0);
    const remaining = Math.max(0, total - paidAmount);

    useEffect(() => {
        if (isOpen) {
            setPayments([]);
            setCurrentAmount(total.toString());
            setSelectedMethod(null);
        }
    }, [isOpen, total]);

    if (!isOpen) return null;

    const methods = [
        { id: 'cash' as PaymentMethod, label: 'Dinheiro', icon: Banknote, color: 'text-green-600 bg-green-50' },
        { id: 'credit_card' as PaymentMethod, label: 'Crédito', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
        { id: 'debit_card' as PaymentMethod, label: 'Débito', icon: CreditCard, color: 'text-cyan-600 bg-cyan-50' },
        { id: 'pix' as PaymentMethod, label: 'Pix', icon: Smartphone, color: 'text-purple-600 bg-purple-50' },
        { id: 'split' as PaymentMethod, label: 'Carteira (Fiado)', icon: CreditCard, color: 'text-orange-600 bg-orange-50', needsClient: true },
    ];

    const handleAddPayment = (method: PaymentMethod) => {
        const amt = parseFloat(currentAmount.replace(',', '.'));
        if (isNaN(amt) || amt <= 0) return;

        // If it's the first payment and it covers everything, just select it and wait for confirm
        // But for split payment, we add it to the list
        setPayments([...payments, { method, amount: amt }]);

        const newRemaining = Math.max(0, total - (paidAmount + amt));
        setCurrentAmount(newRemaining.toString());
    };

    const removePayment = (index: number) => {
        const removed = payments[index];
        setPayments(payments.filter((_, i) => i !== index));
        setCurrentAmount((parseFloat(currentAmount || '0') + removed.amount).toString());
    };

    const handleConfirm = () => {
        if (payments.length === 1 && payments[0].amount >= total) {
            onConfirm(payments[0].method);
        } else {
            // For now backends might only support one method in the 'orders' table.
            // I'll send the primary method (the one with highest value) or 'multiple'.
            const primary = payments.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
            onConfirm(primary.method); // Simplified: send the main method to the order record
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Pagamento</h2>
                        <div className="flex gap-4 mt-1 font-bold">
                            <span className="text-sm text-gray-400">Total: {formatCurrency(total)}</span>
                            {remaining > 0 && <span className="text-sm text-red-500 underline decoration-red-200 underline-offset-4">Faltam: {formatCurrency(remaining)}</span>}
                            {remaining <= 0 && <span className="text-sm text-emerald-500">Valor coberto!</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Payments List */}
                    {payments.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pagamentos Lançados</h3>
                            {payments.map((p, idx) => {
                                const m = methods.find(method => method.id === p.method);
                                return (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${m?.color}`}>
                                                {m && <m.icon size={20} />}
                                            </div>
                                            <span className="font-bold text-gray-700">{m?.label}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-lg font-bold text-gray-900">{formatCurrency(p.amount)}</span>
                                            <button onClick={() => removePayment(idx)} className="text-red-400 hover:text-red-600">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Add Payment Form */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adicionar Forma de Pagamento</h3>
                        <div className="bg-gray-50 p-6 rounded-3xl space-y-6 border border-gray-100">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">R$</span>
                                <input
                                    type="text"
                                    className="w-full pl-14 pr-4 py-4 bg-white border-none rounded-2xl text-3xl font-bold text-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="0,00"
                                    value={currentAmount}
                                    onChange={e => setCurrentAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {methods.map((method) => {
                                    const isDisabled = (method as any).needsClient && !hasClient;
                                    return (
                                        <button
                                            key={method.id}
                                            disabled={isDisabled}
                                            onClick={() => handleAddPayment(method.id)}
                                            className={`
                                                p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200
                                                ${isDisabled ? 'opacity-30 grayscale cursor-not-allowed bg-gray-200' :
                                                    'bg-white border-transparent hover:border-indigo-600 hover:shadow-lg active:scale-95'}
                                            `}
                                        >
                                            <method.icon className={`w-6 h-6 ${method.color.split(' ')[0]}`} />
                                            <span className="text-[10px] font-bold text-gray-600 text-center uppercase tracking-tighter">{method.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white flex gap-4 shrink-0">
                    <Button variant="ghost" className="flex-1 py-4 font-bold" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-[2] py-4 text-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:grayscale"
                        disabled={paidAmount < total && remaining > 0}
                        onClick={handleConfirm}
                    >
                        <Check size={28} />
                        Confirmar {formatCurrency(paidAmount)}
                    </Button>
                </div>

            </div>
        </div>
    );
};
