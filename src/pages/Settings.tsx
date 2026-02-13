import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Save, Building2, Phone, MapPin, FileText, Upload } from 'lucide-react';
import { settingsService, CompanySettings } from '../services/settingsService';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState<CompanySettings>({
        company_name: '',
        company_phone: '',
        company_address: '',
        company_logo_url: '',
        company_document: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await settingsService.getSettings();
                if (data) setSettings(data);
            } catch (error: any) {
                toast.error('Erro ao carregar configurações');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await settingsService.saveSettings(settings);
            toast.success('Configurações salvas com sucesso!');
        } catch (error: any) {
            toast.error('Erro ao salvar: ' + error.message);
        }
    };

    if (loading) return <div className="text-center py-20 text-indigo-600">Carregando...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h2 className="text-3xl font-heading font-bold text-gray-900">Configurações</h2>
                <p className="text-gray-500">Gerencie as informações da sua empresa para recibos e documentos.</p>
            </header>

            <form onSubmit={handleSave} className="space-y-6">
                <Card className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <Building2 size={20} className="text-indigo-600" />
                                Dados da Empresa
                            </h3>

                            <Input
                                label="Nome da Empresa / Fantasia"
                                value={settings.company_name}
                                onChange={e => setSettings({ ...settings, company_name: e.target.value })}
                                placeholder="Minha Loja MPE"
                                required
                            />

                            <Input
                                label="CNPJ / CPF"
                                value={settings.company_document}
                                onChange={e => setSettings({ ...settings, company_document: e.target.value })}
                                placeholder="00.000.000/0001-00"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Telefone"
                                    icon={<Phone size={16} />}
                                    value={settings.company_phone}
                                    onChange={e => setSettings({ ...settings, company_phone: e.target.value })}
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <MapPin size={20} className="text-indigo-600" />
                                Localização & Identidade
                            </h3>

                            <Input
                                label="Logotipo (URL)"
                                icon={<Upload size={16} />}
                                value={settings.company_logo_url}
                                onChange={e => setSettings({ ...settings, company_logo_url: e.target.value })}
                                placeholder="https://exemplo.com/logo.png"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Endereço Completo</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-32"
                                    value={settings.company_address}
                                    onChange={e => setSettings({ ...settings, company_address: e.target.value })}
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t flex justify-end">
                        <Button type="submit" variant="primary" className="px-10 py-3 shadow-lg shadow-indigo-200">
                            <Save size={20} className="mr-2" />
                            Salvar Alterações
                        </Button>
                    </div>
                </Card>

                {/* Info Card */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-900">Uso do Logotipo</h4>
                        <p className="text-sm text-indigo-700 mt-1">
                            A URL do logotipo deve ser pública (ex: hospedada no Imgur, Firebase Storage ou Cloudinary).
                            Este logo será exibido no topo do PDV e em todos os seus recibos impressos ou compartilhados.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};
