import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { Card, Skeleton } from '../components/UI';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils';
import { Search, Calendar, Package, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const SalesHistory: React.FC = () => {
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');

   const fetchOrders = async () => {
      try {
         setLoading(true);
         const data = await orderService.getOrders();
         setOrders(data);
      } catch (error: any) {
         toast.error('Erro ao carregar histórico: ' + error.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchOrders();
   }, []);

   const filteredOrders = orders.filter(order =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.client?.nome_completo && order.client.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()))
   );

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'completed':
            return <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"><CheckCircle2 size={12} /> Pago</span>;
         case 'pending':
            return <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"><Clock size={12} /> Pendente</span>;
         case 'cancelled':
            return <span className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"><XCircle size={12} /> Cancelado</span>;
         default:
            return <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{status}</span>;
      }
   };

   return (
      <div className="space-y-6 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-3xl font-heading font-bold text-gray-900">Histórico de Vendas</h2>
               <p className="text-gray-500 mt-1">Visualize e gerencie todos os pedidos realizados.</p>
            </div>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                  type="text"
                  placeholder="Buscar por ID ou Cliente..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <Card className="overflow-hidden border-none shadow-sm">
            {loading ? (
               <div className="p-6 space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
               </div>
            ) : filteredOrders.length === 0 ? (
               <div className="p-20 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <Package className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Nenhum pedido encontrado</h3>
                  <p className="text-gray-500 mt-1 max-w-xs">Parece que você ainda não realizou nenhuma venda com o novo sistema.</p>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                           <th className="py-4 px-6">ID / Data</th>
                           <th className="py-4 px-6">Cliente</th>
                           <th className="py-4 px-6">Itens</th>
                           <th className="py-4 px-6 text-right">Total</th>
                           <th className="py-4 px-6 text-center">Status</th>
                           <th className="py-4 px-6"></th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredOrders.map(order => (
                           <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                              <td className="py-4 px-6">
                                 <div className="flex flex-col">
                                    <span className="text-xs font-mono text-gray-400">#{order.id.slice(0, 8)}</span>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium mt-1">
                                       <Calendar size={14} className="text-gray-400" />
                                       {new Date(order.created_at || '').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                 </div>
                              </td>
                              <td className="py-4 px-6">
                                 <span className="text-sm font-medium text-gray-900">
                                    {order.client?.nome_completo || 'Venda Rápida / Balcão'}
                                 </span>
                              </td>
                              <td className="py-4 px-6">
                                 <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                    {order.items?.length || 0} {Number(order.items?.length) === 1 ? 'item' : 'itens'}
                                 </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                 <span className="text-md font-bold text-indigo-700">
                                    {formatCurrency(order.total_amount)}
                                 </span>
                              </td>
                              <td className="py-4 px-6 flex justify-center">
                                 {getStatusBadge(order.status)}
                              </td>
                              <td className="py-4 px-6 text-right">
                                 <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={20} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </Card>
      </div>
   );
};