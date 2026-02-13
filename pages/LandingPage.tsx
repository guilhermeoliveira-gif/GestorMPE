import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, DollarSign, Receipt } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-indigo-600">ERP MPE</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
          <Link to="/cadastro" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">Criar Conta</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 font-heading">
          Gestão Comercial Integrada para MPEs
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Otimize o fluxo de trabalho da sua empresa. Controle pedidos, finanças e notas fiscais em um único lugar, de forma simples e segura.
        </p>
        <Link 
          to="/cadastro" 
          className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 inline-block shadow-lg hover:shadow-xl"
        >
          Começar Gratuitamente
        </Link>
      </header>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {[
          { icon: ShoppingCart, title: 'Pedidos', desc: 'Gerencie vendas e orçamentos com facilidade e rapidez.' },
          { icon: DollarSign, title: 'Finanças', desc: 'Controle contas a pagar e receber integrado aos pedidos.' },
          { icon: Receipt, title: 'NF-e', desc: 'Emita notas fiscais eletrônicas em poucos cliques.' },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-12 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-indigo-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <feature.icon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};