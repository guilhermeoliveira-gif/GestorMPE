import React, { useState } from 'react';
import { Button, Input, Select, Card, Dialog } from '../components/UI';
import { UserRole } from '../types';
import toast from 'react-hot-toast';

export const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.SALES
  });

  const handleAddUser = async () => {
    // In a real application, this would call a Supabase Edge Function to create the user
    // using the service_role key, because standard clients cannot create other users.
    // For this UI demo, we simulate the success.
    try {
        if (!newUser.email || !newUser.password) {
            toast.error('Preencha email e senha.');
            return;
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock success
        toast.success('✅ Usuário cadastrado com sucesso!');
        setIsModalOpen(false);
        setNewUser({ name: '', email: '', password: '', role: UserRole.SALES });
    } catch (e) {
        toast.error('❌ Erro ao cadastrar usuário.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-heading font-bold text-gray-900">Gestão de Usuários</h2>
        <Button onClick={() => setIsModalOpen(true)} variant="secondary">Adicionar Usuário</Button>
      </div>

      <Card>
        <table className="w-full text-left border-collapse">
            <thead>
            <tr className="border-b border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-700">Nome</th>
                <th className="py-3 px-4 font-semibold text-gray-700">E-mail</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Perfil</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Ações</th>
            </tr>
            </thead>
            <tbody>
                {/* Mock Data */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">Admin User</td>
                    <td className="py-3 px-4">admin@empresa.com</td>
                    <td className="py-3 px-4"><span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded">ADMIN</span></td>
                    <td className="py-3 px-4 text-gray-500 hover:text-indigo-600 cursor-pointer">Editar</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">Vendedor 1</td>
                    <td className="py-3 px-4">vendas@empresa.com</td>
                    <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">SALES</span></td>
                    <td className="py-3 px-4 text-gray-500 hover:text-indigo-600 cursor-pointer">Editar</td>
                </tr>
            </tbody>
        </table>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Usuário">
        <div className="space-y-4">
            <Input 
                label="Nome do Usuário" 
                value={newUser.name} 
                onChange={e => setNewUser({...newUser, name: e.target.value})}
            />
            <Input 
                label="E-mail" 
                type="email"
                value={newUser.email} 
                onChange={e => setNewUser({...newUser, email: e.target.value})}
            />
            <Input 
                label="Senha" 
                type="password"
                value={newUser.password} 
                onChange={e => setNewUser({...newUser, password: e.target.value})}
            />
            <Select 
                label="Perfil de Acesso"
                options={[
                    { value: UserRole.ADMIN, label: 'Administrador' },
                    { value: UserRole.SALES, label: 'Vendas' },
                    { value: UserRole.FINANCE, label: 'Financeiro' },
                    { value: UserRole.FISCAL, label: 'Fiscal' },
                ]}
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
            />
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddUser} variant="secondary">Salvar</Button>
            </div>
        </div>
      </Dialog>
    </div>
  );
};