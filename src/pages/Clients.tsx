import React, { useState, useEffect } from 'react';
import { clientService } from '../services/clientService';
import { Button, Input, Card, Dialog, Skeleton } from '../components/UI';
import { Client } from '../types';
import toast from 'react-hot-toast';
import { Plus, Search, Eye, Edit, Trash2, Wallet, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils';

export const Clients: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const initialClientState: Partial<Client> = {
    nome_completo: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    limite_credito: 0,
    saldo_devedor: 0,
    dia_vencimento: 10
  };

  const [currentClient, setCurrentClient] = useState<Partial<Client>>(initialClientState);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
    } catch (error: any) {
      toast.error('Erro ao carregar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchClients();
  }, [user]);

  const handleOpenAdd = () => {
    setCurrentClient(initialClientState);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setCurrentClient(client);
    setSelectedId(client.id);
    setIsModalOpen(true);
  };

  const handleSaveClient = async () => {
    if (!currentClient.nome_completo || !currentClient.cpf_cnpj) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      if (selectedId) {
        await clientService.updateClient(selectedId, currentClient);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await clientService.saveClient({
          ...currentClient,
          company_id: user?.user_metadata?.company_id || user?.id
        } as Client);
        toast.success('Cliente cadastrado com sucesso!');
      }
      fetchClients();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await clientService.deleteClient(id);
      toast.success('Cliente excluído!');
      fetchClients();
    } catch (error: any) {
      toast.error('Erro ao excluir: ' + error.message);
    }
  };

  const filteredClients = clients.filter(c =>
    c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf_cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-gray-900">Gerenciamento de Clientes</h2>
          <p className="text-gray-500 mt-1">Cadastre clientes e gerencie limites de crédito.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-6 max-w-md">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por Nome ou CPF/CNPJ..."
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
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Eye size={32} />
            </div>
            <p className="text-gray-500">Nenhum cliente encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Contato</th>
                  <th className="py-4 px-6">Carteira / Fiado</th>
                  <th className="py-4 px-6">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const availableCredit = (client.limite_credito || 0) - (client.saldo_devedor || 0);
                  const isNegative = availableCredit < 0;

                  return (
                    <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{client.nome_completo}</span>
                          <span className="text-xs text-gray-400 font-mono mt-1">{client.cpf_cnpj}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col text-sm text-gray-500">
                          <span>{client.telefone}</span>
                          <span className="text-xs">{client.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400 uppercase font-bold tracking-tighter">Saldo: <b className="text-red-500">{formatCurrency(client.saldo_devedor || 0)}</b></span>
                            <span className="text-gray-400 uppercase font-bold tracking-tighter">Lim: <b className="text-indigo-600">{formatCurrency(client.limite_credito || 0)}</b></span>
                          </div>
                          <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${isNegative ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, ((client.saldo_devedor || 0) / (client.limite_credito || 1)) * 100)}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-bold ${isNegative ? 'text-red-500' : 'text-emerald-500'} uppercase`}>
                            Disp: {formatCurrency(availableCredit)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenEdit(client)} className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? 'Editar Cliente' : 'Novo Cliente'}>
        <div className="max-h-[80vh] overflow-y-auto px-1 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Dados Básicos</h3>
          <Input
            label="Nome Completo"
            value={currentClient.nome_completo}
            onChange={e => setCurrentClient({ ...currentClient, nome_completo: e.target.value })}
            placeholder="Ex: João da Silva"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="CPF/CNPJ"
              value={currentClient.cpf_cnpj}
              onChange={e => setCurrentClient({ ...currentClient, cpf_cnpj: e.target.value })}
              placeholder="000.000.000-00"
            />
            <Input
              label="Telefone"
              value={currentClient.telefone}
              onChange={e => setCurrentClient({ ...currentClient, telefone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>
          <Input
            label="Endereço"
            value={currentClient.endereco}
            onChange={e => setCurrentClient({ ...currentClient, endereco: e.target.value })}
            placeholder="Rua, Número, Bairro, Cidade"
          />
          <Input
            label="Email"
            type="email"
            value={currentClient.email}
            onChange={e => setCurrentClient({ ...currentClient, email: e.target.value })}
            placeholder="cliente@email.com"
          />

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1 pt-4">Configurações Financeiras (Fiado)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Limite de Crédito (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                value={currentClient.limite_credito}
                onChange={e => setCurrentClient({ ...currentClient, limite_credito: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Dia de Vencimento</label>
              <input
                type="number"
                min="1"
                max="31"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                value={currentClient.dia_vencimento}
                onChange={e => setCurrentClient({ ...currentClient, dia_vencimento: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveClient}>Salvar Alterações</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};