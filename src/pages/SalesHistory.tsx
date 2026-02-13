import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Input, Card } from '../components/UI';
import { Product, CartItem } from '../types';
import toast from 'react-hot-toast';
import { Search, Plus, Minus, Trash, ShoppingCart, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const SalesHistory: React.FC = () => {
   const { user } = useAuth();
   const [products, setProducts] = useState<Product[]>([]);
   const [cart, setCart] = useState<CartItem[]>([]);
   const [searchTerm, setSearchTerm] = useState('');

   // Mock products for the demo interaction
   const mockProducts: Product[] = [
      { id: '1', company_id: '1', nome: 'Coca-Cola 350ml', sku: 'BEB-001', preco_venda: 5.00, unidade_medida: 'UN', descricao: '' },
      { id: '2', company_id: '1', nome: 'X-Bacon', sku: 'LAN-001', preco_venda: 25.00, unidade_medida: 'UN', descricao: '' },
      { id: '3', company_id: '1', nome: 'Batata Frita G', sku: 'POR-001', preco_venda: 18.00, unidade_medida: 'UN', descricao: '' },
      { id: '4', company_id: '1', nome: 'Suco de Laranja', sku: 'BEB-002', preco_venda: 8.00, unidade_medida: 'UN', descricao: '' },
      { id: '5', company_id: '1', nome: 'Água Mineral', sku: 'BEB-003', preco_venda: 3.00, unidade_medida: 'UN', descricao: '' },
      { id: '6', company_id: '1', nome: 'Pastel de Carne', sku: 'PAS-001', preco_venda: 8.50, unidade_medida: 'UN', descricao: '' },
      { id: '7', company_id: '1', nome: 'Açaí 500ml', sku: 'SOB-001', preco_venda: 15.00, unidade_medida: 'UN', descricao: '' },
      { id: '8', company_id: '1', nome: 'Combo Família', sku: 'CMB-001', preco_venda: 85.00, unidade_medida: 'UN', descricao: '' },
   ];

   useEffect(() => {
      // In real scenario, fetch from DB
      setProducts(mockProducts);
   }, []);

   // Top selling products (first 4 of mock)
   const topSellers = products.slice(0, 4);

   const addToCart = (product: Product) => {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
         setCart(cart.map(item =>
            item.id === product.id
               ? { ...item, quantidade: item.quantidade + 1, total: (item.quantidade + 1) * item.preco_venda }
               : item
         ));
      } else {
         setCart([...cart, { ...product, quantidade: 1, total: product.preco_venda }]);
      }
      toast.success(`${product.nome} adicionado!`, { duration: 1000, position: 'bottom-center' });
   };

   const removeFromCart = (id: string) => {
      setCart(cart.filter(item => item.id !== id));
   };

   const updateQuantity = (id: string, delta: number) => {
      setCart(cart.map(item => {
         if (item.id === id) {
            const newQty = Math.max(1, item.quantidade + delta);
            return { ...item, quantidade: newQty, total: newQty * item.preco_venda };
         }
         return item;
      }));
   };

   const totalOrder = cart.reduce((acc, item) => acc + item.total, 0);

   const handleFinishOrder = () => {
      if (cart.length === 0) {
         toast.error("O carrinho está vazio!");
         return;
      }
      toast.success("✅ Pedido realizado com sucesso!");
      setCart([]);
   };

   // Filter for the list below top sellers
   const filteredProducts = products.filter(p =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">

         {/* Left Column: Product Selection */}
         <div className="flex-1 flex flex-col gap-6 overflow-hidden">

            {/* Top Sellers Grid (Quick Access) */}
            <div>
               <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-yellow-500">★</span> Mais Vendidos
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {topSellers.map(product => (
                     <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="bg-white border-l-4 border-indigo-500 p-4 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all text-left group"
                     >
                        <div className="font-bold text-gray-800 text-sm md:text-base group-hover:text-indigo-700 truncate">{product.nome}</div>
                        <div className="text-xs text-gray-500 font-mono mb-1">{product.sku}</div>
                        <div className="text-emerald-600 font-bold">R$ {product.preco_venda.toFixed(2)}</div>
                     </button>
                  ))}
               </div>
            </div>

            {/* Search & List */}
            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                     <Search className="text-gray-400 w-5 h-5" />
                     <input
                        type="text"
                        placeholder="Pesquise por Nome do produto ou SKU..."
                        className="bg-transparent border-none focus:outline-none w-full text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                     />
                  </div>
               </div>

               <div className="overflow-y-auto flex-1 p-2">
                  {searchTerm && filteredProducts.length === 0 && (
                     <div className="text-center py-10 text-gray-500">Nenhum produto encontrado.</div>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                     {filteredProducts.map(product => (
                        <div
                           key={product.id}
                           onClick={() => addToCart(product)}
                           className="flex justify-between items-center p-3 hover:bg-indigo-50 rounded-lg cursor-pointer border border-transparent hover:border-indigo-100 transition-colors"
                        >
                           <div>
                              <div className="font-medium text-gray-800">{product.nome}</div>
                              <div className="text-xs text-gray-500 font-mono">SKU: {product.sku}</div>
                           </div>
                           <div className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                              R$ {product.preco_venda.toFixed(2)}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column: Cart/Summary */}
         <div className="w-full md:w-96 flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 bg-indigo-600 text-white rounded-t-xl flex justify-between items-center">
               <h2 className="font-bold text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Pedido Atual</h2>
               <span className="bg-indigo-700 px-2 py-1 rounded text-xs font-mono">{cart.length} ITENS</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                     <ShoppingCart className="w-16 h-16 mb-2" />
                     <p>Carrinho vazio</p>
                  </div>
               ) : (
                  cart.map(item => (
                     <div key={item.id} className="flex flex-col border-b border-gray-100 pb-2 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                           <span className="font-medium text-gray-800 text-sm line-clamp-1">{item.nome}</span>
                           <span className="font-bold text-gray-900 text-sm">R$ {item.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="text-xs text-gray-500">Unit: R$ {item.preco_venda.toFixed(2)}</div>
                           <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Minus className="w-3 h-3" /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantidade}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-indigo-600"><Plus className="w-3 h-3" /></button>
                           </div>
                           <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash className="w-4 h-4" /></button>
                        </div>
                     </div>
                  ))
               )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total Geral</span>
                  <span className="text-3xl font-bold text-emerald-600">R$ {totalOrder.toFixed(2)}</span>
               </div>
               <Button onClick={handleFinishOrder} className="w-full h-12 text-lg flex justify-center items-center gap-2" disabled={cart.length === 0}>
                  <Check className="w-5 h-5" /> Finalizar Pedido
               </Button>
            </div>
         </div>

      </div>
   );
};