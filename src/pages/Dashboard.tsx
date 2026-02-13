import React, { useState, useEffect } from 'react';
import { Card, Skeleton } from '../components/UI';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { statsService } from '../services/statsService';
import { formatCurrency } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statsService.getDashboardStats();
        setStats(data);
      } catch (error: any) {
        toast.error('Erro ao carregar estatísticas: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-heading font-bold text-gray-900">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const kpis = [
    {
      label: 'Receita Mensal',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: 'Este mês'
    },
    {
      label: 'A Receber (Fiado)',
      value: formatCurrency(stats.totalPending + stats.totalReceivableFinance),
      icon: ArrowUpRight,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: 'Pendentes'
    },
    {
      label: 'Contas a Pagar',
      value: formatCurrency(stats.totalPayable),
      icon: ArrowDownRight,
      color: 'text-red-600',
      bg: 'bg-red-50',
      trend: 'Vencimentos'
    },
    {
      label: 'Total de Clientes',
      value: stats.clientCount,
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      trend: 'Base ativa'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500">Acompanhe o desempenho do seu negócio em tempo real.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase mt-2">{kpi.trend}</p>
            </div>
            {/* Decorative background element */}
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity ${kpi.color}`}>
              <kpi.icon size={100} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Vendas nos últimos 7 dias</h3>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.salesByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  hide
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any) => [formatCurrency(value), 'Vendas']}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {stats.salesByDay.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === stats.salesByDay.length - 1 ? '#4f46e5' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Produtos + Vendidos</h3>
            <Package size={20} className="text-indigo-500" />
          </div>
          <div className="space-y-4">
            {stats.topProducts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">Buscando dados...</p>
            ) : stats.topProducts.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{p.nome}</p>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(p.total / stats.topProducts[0].total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">{p.total} un</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};