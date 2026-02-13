import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button, Input, Card, Dialog, Skeleton } from '../components/UI';
import { Product } from '../types';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Products: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    nome: '',
    sku: '',
    preco_venda: 0,
    custo: 0,
    unidade_medida: 'UN',
    descricao: ''
  });

  // Mock data for demo purposes if DB is empty or fails
  const mockProducts: Product[] = [
    { id: '1', company_id: '1', nome: 'Camiseta Básica Preta', sku: 'CAM-001', preco_venda: 49.90, custo: 20.00, unidade_medida: 'UN', descricao: 'Algodão' },
    { id: '2', company_id: '1', nome: 'Calça Jeans Skinny', sku: 'JNS-002', preco_venda: 129.90, custo: 60.00, unidade_medida: 'UN', descricao: 'Denim' },
    { id: '3', company_id: '1', nome: 'Tênis Esportivo', sku: 'TEN-003', preco_venda: 299.90, custo: 150.00, unidade_medida: 'PAR', descricao: 'Corrida' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Try fetching from Supabase
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Fallback to mock data for layout demonstration if DB is empty
        setProducts(mockProducts);
      }
    } catch (error) {
      console.log('Using mock data due to error or empty DB');
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProduct = async () => {
    if (!currentProduct.nome || !currentProduct.sku || !currentProduct.preco_venda) {
      toast.error('Preencha Nome, SKU e Preço de Venda');
      return;
    }

    try {
      toast.success('Produto salvo com sucesso! (Simulação)');
      // Simulate adding to local list
      const newProd = { 
        ...currentProduct, 
        id: Math.random().toString(), 
        company_id: 'demo' 
      } as Product;
      
      setProducts([newProd, ...products]);
      setIsModalOpen(false);
      setCurrentProduct({ nome: '', sku: '', preco_venda: 0, custo: 0, unidade_medida: 'UN', descricao: '' });
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-heading font-bold text-gray-900">Produtos</h2>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Produto
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-6 max-w-md">
          <Search className="text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por Nome ou SKU..." 
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <Package className="w-24 h-24 text-gray-200 mb-4" />
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-700">SKU</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Preço Venda</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">Custo</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">UN</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-600 font-bold bg-gray-100 rounded-sm w-fit">{product.sku}</td>
                    <td className="py-3 px-4 font-medium">{product.nome}</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda)}
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                       {product.custo ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.custo) : '-'}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-xs">{product.unidade_medida}</td>
                    <td className="py-3 px-4 flex gap-2">
                       <button className="text-indigo-600 hover:text-indigo-800 p-1"><Edit className="w-4 h-4"/></button>
                       <button className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastro de Produto">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
                label="SKU (Código)" 
                value={currentProduct.sku}
                onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})}
                placeholder="EX: CAM-001"
            />
             <Input 
                label="Unidade Medida" 
                value={currentProduct.unidade_medida}
                onChange={e => setCurrentProduct({...currentProduct, unidade_medida: e.target.value})}
                placeholder="UN, KG, PAR"
            />
          </div>
          <Input 
            label="Nome do Produto" 
            value={currentProduct.nome}
            onChange={e => setCurrentProduct({...currentProduct, nome: e.target.value})}
          />
          <Input 
            label="Descrição" 
            value={currentProduct.descricao}
            onChange={e => setCurrentProduct({...currentProduct, descricao: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">Preço Venda (R$)</label>
                <input 
                    type="number"
                    step="0.01"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={currentProduct.preco_venda}
                    onChange={e => setCurrentProduct({...currentProduct, preco_venda: parseFloat(e.target.value)})}
                />
             </div>
             <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">Custo (R$)</label>
                <input 
                    type="number"
                    step="0.01"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={currentProduct.custo}
                    onChange={e => setCurrentProduct({...currentProduct, custo: parseFloat(e.target.value)})}
                />
             </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProduct}>Salvar Produto</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};