import React, { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Button, Input, Card, Dialog, Skeleton } from '@/components/UI';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2, Package, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils';

export const Products: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const initialProductState: Partial<Product> = {
    nome: '',
    sku: '',
    preco_venda: 0,
    custo: 0,
    unidade_medida: 'UN',
    descricao: '',
    estoque: 0,
    imagem_url: '',
    categoria: ''
  };

  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(initialProductState);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const handleOpenAdd = () => {
    setCurrentProduct(initialProductState);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setCurrentProduct(product);
    setSelectedId(product.id);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!currentProduct.nome || !currentProduct.sku || currentProduct.preco_venda === undefined) {
      toast.error('Preencha Nome, SKU e Preço de Venda');
      return;
    }

    try {
      if (selectedId) {
        await productService.updateProduct(selectedId, currentProduct);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await productService.saveProduct({
          ...currentProduct,
          company_id: user?.user_metadata?.company_id || undefined
        } as Product);
        toast.success('Produto cadastrado com sucesso!');
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await productService.deleteProduct(id);
      toast.success('Produto excluído!');
      fetchProducts();
    } catch (error: any) {
      toast.error('Erro ao excluir: ' + error.message);
    }
  };

  const filteredProducts = products.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-heading font-bold text-gray-900">Produtos</h2>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Produto
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-6 max-w-md">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por Nome, SKU ou Categoria..."
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
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4 font-semibold">Produto</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Estoque</th>
                  <th className="py-3 px-4 font-semibold">Preço</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Categoria</th>
                  <th className="py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {product.imagem_url ? (
                          <img src={product.imagem_url} alt={product.nome} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{product.nome}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{product.sku}</span></td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${Number(product.estoque || 0) <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                        {product.estoque || 0} {product.unidade_medida}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-indigo-600 font-bold">
                      {formatCurrency(product.preco_venda)}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
                        {product.categoria || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenEdit(product)} className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? 'Editar Produto' : 'Novo Produto'}>
        <div className="max-h-[80vh] overflow-y-auto px-1 space-y-4">
          <Input
            label="Nome do Produto"
            value={currentProduct.nome}
            onChange={e => setCurrentProduct({ ...currentProduct, nome: e.target.value })}
            placeholder="Ex: Tênis Nike Revolution"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU / Código"
              value={currentProduct.sku}
              onChange={e => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
              placeholder="PROD-001"
            />
            <Input
              label="Categoria"
              value={currentProduct.categoria}
              onChange={e => setCurrentProduct({ ...currentProduct, categoria: e.target.value })}
              placeholder="Calçados"
            />
          </div>

          <Input
            label="URL da Imagem"
            value={currentProduct.imagem_url}
            onChange={e => setCurrentProduct({ ...currentProduct, imagem_url: e.target.value })}
            placeholder="https://exemplo.com/foto.jpg"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Preço Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                value={currentProduct.preco_venda}
                onChange={e => setCurrentProduct({ ...currentProduct, preco_venda: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                value={currentProduct.custo}
                onChange={e => setCurrentProduct({ ...currentProduct, custo: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Estoque Inicial</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                value={currentProduct.estoque}
                onChange={e => setCurrentProduct({ ...currentProduct, estoque: parseInt(e.target.value) })}
              />
            </div>
            <Input
              label="Unidade"
              value={currentProduct.unidade_medida}
              onChange={e => setCurrentProduct({ ...currentProduct, unidade_medida: e.target.value })}
              placeholder="UN, PAR, KG"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 h-20"
              value={currentProduct.descricao}
              onChange={e => setCurrentProduct({ ...currentProduct, descricao: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProduct}>Salvar Alterações</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};