import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Input, Button } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginDemo } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check for Demo credentials
    if (email === 'admin@demo.com' && password === '123456') {
      setTimeout(() => {
        loginDemo();
        toast.success('Modo Demo ativado!');
        navigate('/dashboard');
      }, 500);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } else {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-heading font-bold text-gray-900">Bem-vindo de volta</h1>
           <p className="text-gray-500 mt-2">Acesse sua conta para continuar</p>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 text-sm text-indigo-800 text-center">
          <strong>Teste o Layout:</strong><br/>
          Use: admin@demo.com / 123456
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="E-mail"
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <div className="space-y-1">
             <Input 
                label="Senha"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
             />
             <div className="flex justify-end pt-1">
                <Link to="/recuperar" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                  Esqueci a senha
                </Link>
             </div>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full h-11 text-lg shadow-sm font-semibold">
            {loading ? 'Autenticando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
           Não tem uma conta?{' '}
           <Link to="/cadastro" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
             Criar conta gratuitamente
           </Link>
        </div>
      </div>
    </div>
  );
};

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Adjust redirect URL as needed for your environment
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href.replace('/recuperar', '/resetar-senha'),
    });
    setLoading(false);

    if (error) {
      toast.error('Erro ao enviar instrução: ' + error.message);
    } else {
      toast.success('Instruções enviadas para seu e-mail!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-heading font-bold text-gray-900">Recuperar Senha</h2>
           <p className="text-gray-500 mt-2">Enviaremos um link para você redefinir sua senha</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <Input 
            label="E-mail cadastrado"
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" disabled={loading} className="w-full h-11 text-lg shadow-sm font-semibold">
            {loading ? 'Enviando...' : 'Enviar Link'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
           <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.user) {
        toast.success('Cadastro realizado! Verifique seu e-mail para confirmar.');
        navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Crie sua conta</h2>
            <p className="text-gray-500 mt-2">Comece a gerenciar sua empresa hoje</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <Input 
            label="Nome Empresarial"
            type="text" 
            placeholder="Sua Empresa Ltda" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
          <Input 
            label="E-mail"
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Input 
            label="Senha"
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" disabled={loading} className="w-full h-11 text-lg shadow-sm mt-2 font-semibold">
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-600">
           Já tem uma conta?{' '}
           <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">Faça Login</Link>
        </div>
      </div>
    </div>
  );
};