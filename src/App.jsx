
import React, { useEffect, useState } from 'react';
import OrcamentoStart from './pages/OrcamentoStart.jsx';
import Login from './pages/Login.jsx';
import PropostasPage from './pages/PropostasPage.jsx';
import Relatorios from './pages/Relatorios.jsx';
import GerenciarOrcamentos from './pages/GerenciarOrcamentos.jsx';
import AgenteLancaster from './pages/AgenteLancaster.jsx';

export default function App(){
  const [rep,setRep] = useState(null);
  const [route,setRoute] = useState(localStorage.getItem('route') || 'orcamento'); // 'orcamento' | 'propostas' | 'relatorios_*' | 'gerenciar' | 'agente'

  useEffect(()=>{
    try{
      const saved = JSON.parse(localStorage.getItem('rep')||'null');
      if(saved?.id) setRep(saved);
    }catch{}
  },[]);

  function go(r){
    setRoute(r); localStorage.setItem('route', r);
  }

  function Menu(){
    return (
      <aside className="space-y-2">
        <div className="card">
          <div className="h1">Menu</div>
        </div>
        <nav className="card flex flex-col gap-2">
          <button className={"btn " + (route==='orcamento'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('orcamento')}>Novo Orçamento</button>
          <button className={"btn " + (route==='propostas'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('propostas')}>Propostas</button>

          <div className="border-t pt-2 mt-1"/>
          <div className="font-semibold">Relatórios</div>
          <div className="flex flex-col gap-2 pl-2">
            <button className={"btn " + (route==='relatorios_id_orcados'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('relatorios_id_orcados')}>ID orçados</button>
            <button className={"btn " + (route==='relatorios_id_solicitado_amostra'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('relatorios_id_solicitado_amostra')}>ID solicitando amostras</button>
            <button className={"btn " + (route==='relatorios_id_sem_solicitacao'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('relatorios_id_sem_solicitacao')}>ID sem solicitação de amostras</button>
            <button className={"btn " + (route==='relatorios_id_em_producao'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('relatorios_id_em_producao')}>ID que entraram em produção</button>
            <button className={"btn " + (route==='relatorios_geral_cliente'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('relatorios_geral_cliente')}>Geral por cliente</button>
          </div>

          <div className="font-semibold mt-2">Gerenciar Orçamentos</div>
          <button className={"btn " + (route==='gerenciar'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('gerenciar')}>Gerenciar orçamentos</button>

          <div className="border-t pt-2 mt-1"/>
          <button className={"btn " + (route==='agente'?'opacity-100':'!bg-white !text-black')} onClick={()=>go('agente')}>Agente Lancaster</button>
        </nav>
      </aside>
    );
  }

  const relTipoMap = {
    relatorios_id_orcados: "id_orcados",
    relatorios_id_solicitado_amostra: "id_solicitado_amostra",
    relatorios_id_sem_solicitacao: "id_orcados_sem_solicitacao",
    relatorios_id_em_producao: "id_entrou_producao",
    relatorios_geral_cliente: "geral_por_cliente",
  };
  const relTipo = relTipoMap[route];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="font-bold">Lancaster IA Tingimento</div>
          {rep ? <div className="sub">Bem-vindo, {rep.nome}</div> : null}
        </div>
      </header>

      {!rep ? (
        <main className="max-w-xl mx-auto p-6"><Login onLogado={setRep}/></main>
      ) : (
        <div className="max-w-6xl mx-auto p-5 grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-4">
          <Menu/>
          <main className="space-y-4">
            {route==='orcamento' && <OrcamentoStart/>}
            {route==='propostas' && <PropostasPage/>}
            {relTipo && <Relatorios tipo={relTipo}/>}
            {route==='gerenciar' && <GerenciarOrcamentos/>}
            {route==='agente' && <AgenteLancaster/>}
          </main>
        </div>
      )}
    </div>
  );
}
