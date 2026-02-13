import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button, Input, Card, Dialog, Skeleton } from '../components/UI';
import { Client } from '../types';
import toast from 'react-hot-toast';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Clients: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    nome_completo: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveClient = async () => {
    if (!newClient.nome_completo || !newClient.cpf_cnpj) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      // In a real app with RBAC, we need the company_id. 
      // For this frontend demo, we assume the backend trigger handles company_id assignment based on the user's company,
      // or we query it first. Here we will mock it or let Supabase RLS handle the error if not provided.
      // We will try to insert. If RLS fails because we didn't send company_id (and it's not defaulted), 
      // we'd normally need to fetch user's company_id first.
      
      // Fetch user company (quick fix for demo)
      const { data: userData } = await supabase.from('users').select('company_id').eq('id', user!.id).single();
      
      if (!userData) throw new Error("Usuário sem empresa");

      const { error } = await supabase.from('clientes').insert([{
        ...newClient,
        company_id: userData.company_id,
        created_by: user!.id
      }]);

      if (error) throw error;

      toast.success('Cliente cadastrado com sucesso!');
      setIsModalOpen(false);
      setNewClient({ nome_completo: '', cpf_cnpj: '', email: '', telefone: '', endereco: '' });
      fetchClients();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  const filteredClients = clients.filter(c => 
    c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-heading font-bold text-gray-900">Clientes</h2>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-6 max-w-md">
          <Search className="text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            className="bg-transparent border-none focus:outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            {/* SVG Empty State */}
            <svg className="w-32 h-32 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500">Nenhum cliente cadastrado. Comece adicionando um novo cliente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">CPF/CNPJ</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">Telefone</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">E-mail</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{client.nome_completo}</td>
                    <td className="py-3 px-4 font-mono text-sm">{client.cpf_cnpj}</td>
                    <td className="py-3 px-4 hidden md:table-cell">{client.telefone}</td>
                    <td className="py-3 px-4 hidden md:table-cell">{client.email}</td>
                    <td className="py-3 px-4 flex gap-2">
                       <button className="text-indigo-600 hover:text-indigo-800 p-1"><Eye className="w-4 h-4"/></button>
                       <button className="text-gray-500 hover:text-gray-700 p-1"><Edit className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Cliente">
        <div className="space-y-4">
          <Input 
            label="Nome Completo" 
            value={newClient.nome_completo}
            onChange={e => setNewClient({...newClient, nome_completo: e.target.value})}
          />
          <Input 
            label="CPF/CNPJ" 
            value={newClient.cpf_cnpj}
            onChange={e => setNewClient({...newClient, cpf_cnpj: e.target.value})}
          />
          <Input 
            label="Endereço" 
            value={newClient.endereco}
            onChange={e => setNewClient({...newClient, endereco: e.target.value})}
          />
          <Input 
            label="Telefone" 
            value={newClient.telefone}
            onChange={e => setNewClient({...newClient, telefone: e.target.value})}
          />
          <Input 
            label="Email" 
            type="email"
            value={newClient.email}
            onChange={e => setNewClient({...newClient, email: e.target.value})}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveClient}>Salvar</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};