import React, { useState, useEffect } from 'react';
import { Dialog, Input, Button, Select } from '../../components/UI';
import { financeService } from '../../services/financeService';
import { FinancialCategory, FinancialTransaction } from '../../types';
import toast from 'react-hot-toast';

interface TransactionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'income' | 'expense';
    transactionToEdit?: FinancialTransaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSuccess, type, transactionToEdit }) => {
    const [categories, setCategories] = useState<FinancialCategory[]>();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        category_id: '',
        status: 'pending' as 'pending' | 'paid'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                description: transactionToEdit.description,
                amount: transactionToEdit.amount.toString(),
                due_date: transactionToEdit.due_date,
                category_id: transactionToEdit.category_id || '',
                status: transactionToEdit.status
            });
        } else {
            setFormData({
                description: '',
                amount: '',
                due_date: new Date().toISOString().split('T')[0],
                category_id: '',
                status: 'pending'
            });
        }
    }, [transactionToEdit, isOpen]);

    const loadCategories = async () => {
        try {
            const data = await financeService.getCategories();
            setCategories(data.filter(c => c.type === type));
        } catch (error) {
            toast.error('Erro ao carregar categorias');
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payload = {
                description: formData.description,
                amount: Number(formData.amount),
                type,
                status: formData.status,
                due_date: formData.due_date,
                payment_date: formData.status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
                category_id: formData.category_id || undefined
            };

            if (transactionToEdit) {
                await financeService.updateTransaction(transactionToEdit.id, payload);
                toast.success('Transação atualizada!');
            } else {
                await financeService.createTransaction(payload);
                toast.success('Transação criada!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Erro ao salvar transação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={transactionToEdit ? 'Editar Lançamento' : `Nova ${type === 'income' ? 'Receita' : 'Despesa'}`}>
            <div className="space-y-4">
                <Input
                    label="Descrição"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
                <Input
                    label="Valor (R$)"
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Vencimento"
                        type="date"
                        value={formData.due_date}
                        onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                    />
                    <Select
                        label="Status"
                        options={[
                            { value: 'pending', label: 'Pendente' },
                            { value: 'paid', label: 'Pago/Recebido' }
                        ]}
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    />
                </div>

                <Select
                    label="Categoria"
                    options={categories?.map(c => ({ value: c.id, label: c.name })) || []}
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};
