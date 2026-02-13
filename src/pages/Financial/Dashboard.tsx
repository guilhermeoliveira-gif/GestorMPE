import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Dialog } from '../../components/UI';
import { TransactionList } from './TransactionList';
import { TransactionForm } from './TransactionForm';
import { financeService } from '../../services/financeService';
import { FinancialTransaction } from '../../types';
import { formatCurrency } from '../../utils';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export const FinancialDashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState<'income' | 'expense'>('expense');
    const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await financeService.getTransactions();
            setTransactions(data);
        } catch (error) {
            toast.error('Erro ao carregar transações');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir?')) return;
        try {
            await financeService.deleteTransaction(id);
            toast.success('Transação excluída');
            loadTransactions();
        } catch (error) {
            toast.error('Erro ao excluir');
        }
    };

    const handleEdit = (transaction: FinancialTransaction) => {
        setSelectedTransaction(transaction);
        setFormType(transaction.type);
        setIsFormOpen(true);
    };

    const handleOpenForm = (type: 'income' | 'expense') => {
        setSelectedTransaction(undefined);
        setFormType(type);
        setIsFormOpen(true);
    };

    const metrics = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income' && t.status === 'paid')
            .reduce((acc, t) => acc + t.amount, 0);

        const expense = transactions
            .filter(t => t.type === 'expense' && t.status === 'paid')
            .reduce((acc, t) => acc + t.amount, 0);

        const pendingIncome = transactions
            .filter(t => t.type === 'income' && t.status === 'pending')
            .reduce((acc, t) => acc + t.amount, 0);

        const pendingExpense = transactions
            .filter(t => t.type === 'expense' && t.status === 'pending')
            .reduce((acc, t) => acc + t.amount, 0);

        return {
            balance: income - expense,
            income,
            expense,
            pendingIncome,
            pendingExpense
        };
    }, [transactions]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-heading font-bold text-gray-900">Financeiro</h2>
                <div className="space-x-2">
                    <Button onClick={() => handleOpenForm('income')} className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus size={18} className="mr-1" /> Nova Receita
                    </Button>
                    <Button onClick={() => handleOpenForm('expense')} className="bg-red-600 hover:bg-red-700 text-white">
                        <Plus size={18} className="mr-1" /> Nova Despesa
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Entradas (Realizado)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.income)}</h3>
                            <p className="text-xs text-green-600 mt-1">
                                + {formatCurrency(metrics.pendingIncome)} previsto
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Saídas (Realizado)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.expense)}</h3>
                            <p className="text-xs text-red-600 mt-1">
                                + {formatCurrency(metrics.pendingExpense)} previsto
                            </p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                </Card>

                <Card className={`p-6 border-l-4 ${metrics.balance >= 0 ? 'border-indigo-500' : 'border-orange-500'}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Saldo Atual</p>
                            <h3 className={`text-2xl font-bold mt-1 ${metrics.balance >= 0 ? 'text-indigo-600' : 'text-orange-600'}`}>
                                {formatCurrency(metrics.balance)}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Fluxo de Caixa</p>
                        </div>
                        <div className={`p-2 rounded-lg ${metrics.balance >= 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transaction Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionList
                    title="Contas a Pagar (Próximos Vencimentos)"
                    transactions={transactions.filter(t => t.type === 'expense').slice(0, 5)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <TransactionList
                    title="Contas a Receber (Recentes)"
                    transactions={transactions.filter(t => t.type === 'income').slice(0, 5)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadTransactions}
                type={formType}
                transactionToEdit={selectedTransaction}
            />
        </div>
    );
};
