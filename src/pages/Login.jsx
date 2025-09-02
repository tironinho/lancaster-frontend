import React, { useState, useEffect } from 'react';
import { representantes } from '../mocks/representantes';

export default function Login({ onLogado }){
  const [user,setUser] = useState('');
  const [senha,setSenha] = useState('');
  const [erro,setErro] = useState('');

  useEffect(()=>{
    const rep = localStorage.getItem('rep');
    if(rep){
      try{ const parsed = JSON.parse(rep); if(parsed?.id){ onLogado && onLogado(parsed); } }catch{}
    }
  },[]);

  function entrar(){
    setErro('');
    const rep = representantes.find(r =>
      r.usuario?.toLowerCase()===user.toLowerCase() || r.email?.toLowerCase()===user.toLowerCase()
    );
    if(!rep || rep.senha !== senha){
      setErro('Usuário ou senha inválidos');
      return;
    }
    localStorage.setItem('rep', JSON.stringify(rep));
    onLogado && onLogado(rep);
  }

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <div className="card">
        <div className="h1">Acesso do Representante</div>
        <div className="sub">Entre com usuário (ou e-mail) e senha</div>
      </div>
      <div className="card space-y-3">
        <input className="input w-full" placeholder="Usuário ou e-mail" value={user} onChange={e=>setUser(e.target.value)} />
        <input className="input w-full" type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} />
        {erro && <div className="text-red-600 text-sm">{erro}</div>}
        <button className="btn w-full" onClick={entrar}>Entrar</button>
        <div className="text-xs text-gray-500">Dica para teste: repA / 123456</div>
      </div>
    </div>
  );
}
