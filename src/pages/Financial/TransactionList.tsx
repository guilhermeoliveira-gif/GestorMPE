import React, { useState } from 'react';
import { Card, Button } from '../../components/UI';
import { FinancialTransaction } from '../../types';
import { formatDate, formatCurrency } from '../../utils';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface TransactionListProps {
    transactions: FinancialTransaction[];
    onEdit: (t: FinancialTransaction) => void;
    onDelete: (id: string) => void;
    title: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete, title }) => {
    return (
        <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-100">
                            <th className="px-6 py-3 font-medium">Descrição</th>
                            <th className="px-6 py-3 font-medium">Categoria</th>
                            <th className="px-6 py-3 font-medium">Vencimento</th>
                            <th className="px-6 py-3 font-medium">Valor</th>
                            <th className="px-6 py-3 font-medium text-center">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    Nenhum lançamento encontrado.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-gray-900">{t.description}</td>
                                    <td className="px-6 py-3 text-gray-500">{t.category?.name || '-'}</td>
                                    <td className="px-6 py-3 text-gray-500">{formatDate(t.due_date)}</td>
                                    <td className={`px-6 py-3 font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'expense' ? '-' : ''}{formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {t.status === 'paid' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right space-x-2">
                                        <button onClick={() => onEdit(t)} className="text-indigo-600 hover:text-indigo-900">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => onDelete(t.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
