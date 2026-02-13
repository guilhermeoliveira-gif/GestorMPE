import React from 'react';
import { Card } from '../components/UI';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-3xl font-heading font-bold text-gray-900">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-medium">Faturamento Mensal</span>
            <DollarSign className="text-emerald-500 w-5 h-5" />
          </div>
          <span className="text-3xl font-bold text-emerald-500">R$ 45.230,00</span>
          <div className="h-10 w-full bg-emerald-50 mt-2 rounded flex items-end pb-1 px-1">
             {/* Mock Chart */}
             <div className="w-1/5 bg-emerald-400 h-1/3 mx-1 rounded-t"></div>
             <div className="w-1/5 bg-emerald-400 h-2/3 mx-1 rounded-t"></div>
             <div className="w-1/5 bg-emerald-400 h-1/2 mx-1 rounded-t"></div>
             <div className="w-1/5 bg-emerald-400 h-full mx-1 rounded-t"></div>
             <div className="w-1/5 bg-emerald-400 h-3/4 mx-1 rounded-t"></div>
          </div>
        </Card>

        <Card className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-medium">Contas a Receber</span>
            <TrendingUp className="text-yellow-600 w-5 h-5" />
          </div>
          <span className="text-3xl font-bold text-yellow-600">R$ 12.150,00</span>
          <div className="h-10 w-full bg-yellow-50 mt-2 rounded flex items-end pb-1 px-1">
             <div className="w-full bg-yellow-400 h-1/2 rounded"></div>
          </div>
        </Card>

        <Card className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-medium">Contas a Pagar</span>
            <TrendingDown className="text-red-600 w-5 h-5" />
          </div>
          <span className="text-3xl font-bold text-red-600">R$ 8.420,00</span>
          <div className="h-10 w-full bg-red-50 mt-2 rounded flex items-end pb-1 px-1">
             <div className="w-full bg-red-400 h-1/3 rounded"></div>
          </div>
        </Card>
      </div>

      {/* Placeholder for Recent Activity */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">A</div>
                    <div>
                        <p className="font-medium text-gray-800">Novo pedido #1234</p>
                        <p className="text-xs text-gray-500">Cliente: Acme Corp</p>
                    </div>
                </div>
                <span className="text-sm text-gray-500">Há 2 horas</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">$</div>
                    <div>
                        <p className="font-medium text-gray-800">Pagamento recebido</p>
                        <p className="text-xs text-gray-500">Ref: Pedido #1230</p>
                    </div>
                </div>
                <span className="text-sm text-gray-500">Há 5 horas</span>
            </div>
        </div>
      </Card>
    </div>
  );
};