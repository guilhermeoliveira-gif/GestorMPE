import React from 'react';
import { Dialog, Button } from '../UI';
import { CheckCircle2, Printer, Share2, ShoppingBag, X } from 'lucide-react';
import { formatCurrency } from '../../utils';
import { Order, OrderItem, Client } from '../../types';
import { CompanySettings } from '../../services/settingsService';

interface SaleSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any | null;
    items: any[];
    client: Client | null;
    settings: CompanySettings | null;
}

export const SaleSuccessModal: React.FC<SaleSuccessModalProps> = ({
    isOpen,
    onClose,
    order,
    items,
    client,
    settings
}) => {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Comprovante de Venda',
                text: `Venda ${order.id} no valor de ${formatCurrency(order.total_amount)}`,
                url: window.location.href
            });
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Venda Concluída!">
            <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-2 py-4">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Sucesso!</h3>
                    <p className="text-gray-500">A venda foi registrada e processada.</p>
                </div>

                {/* Receipt Preview */}
                <div id="receipt-content" className="bg-white border-2 border-dashed border-gray-200 p-6 rounded-xl text-left font-mono text-sm space-y-4 shadow-inner overflow-hidden">
                    <div className="text-center border-b border-gray-100 pb-4 space-y-1">
                        {settings?.company_logo_url && (
                            <img src={settings.company_logo_url} alt="Logo" className="h-12 mx-auto mb-2 grayscale" />
                        )}
                        <h4 className="font-bold text-lg uppercase">{settings?.company_name || 'ERP MPE'}</h4>
                        <p className="text-[10px] text-gray-500">{settings?.company_address}</p>
                        <p className="text-[10px] text-gray-500">Tel: {settings?.company_phone}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-2">COMPROVANTE DE VENDA</p>
                    </div>

                    <div className="space-y-1 border-b border-gray-100 pb-2">
                        <div className="flex justify-between">
                            <span>Data:</span>
                            <span>{new Date().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Venda #:</span>
                            <span className="truncate ml-4">{order.id.split('-')[0].toUpperCase()}</span>
                        </div>
                        {client && (
                            <div className="flex justify-between text-indigo-600 font-bold">
                                <span>Cliente:</span>
                                <span>{client.nome_completo}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 py-2 max-h-40 overflow-y-auto">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex flex-col border-b border-gray-50 pb-1">
                                <span className="font-bold text-xs">{item.product_name}</span>
                                <div className="flex justify-between text-[11px] text-gray-600">
                                    <span>{item.quantity} {item.unit || 'un'} x {formatCurrency(item.unit_price)}</span>
                                    <span className="font-bold">{formatCurrency(item.total_price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between text-base font-bold">
                            <span>TOTAL:</span>
                            <span className="text-indigo-600">{formatCurrency(order.total_amount)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase">
                            <span>Pagamento:</span>
                            <span>{order.payment_method === 'split' ? 'Carteira/Fiado' : order.payment_method}</span>
                        </div>
                    </div>

                    <div className="text-center border-t border-gray-100 pt-4 text-[10px] text-gray-400">
                        Obrigado pela preferência!
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" onClick={handlePrint} className="flex items-center justify-center gap-2">
                            <Printer size={18} /> Imprimir
                        </Button>
                        <Button variant="ghost" onClick={handleShare} className="flex items-center justify-center gap-2">
                            <Share2 size={18} /> Compartilhar
                        </Button>
                    </div>
                    <Button variant="primary" onClick={onClose} className="w-full py-3 shadow-lg shadow-indigo-200">
                        <ShoppingBag size={20} className="mr-2" />
                        Nova Venda
                    </Button>
                </div>
            </div>

            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    #receipt-content, #receipt-content * { visibility: visible; }
                    #receipt-content { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 80mm; 
                        box-shadow: none; 
                        border: none;
                    }
                }
                `}
            </style>
        </Dialog>
    );
};
