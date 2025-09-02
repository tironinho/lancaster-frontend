import React,{useState} from 'react';
import { representantes } from '../mocks/representantes';
import { clientes as clientesMock } from '../mocks/clientes';
import OrcamentoEmpresa from './OrcamentoEmpresa.jsx';
import OrcamentoCadastroNovo from './OrcamentoCadastroNovo.jsx';
import OrcamentoDados from './OrcamentoDados.jsx';
import { validarCNPJ } from '../utils/cnpj';

export default function OrcamentoStart(){
  const rep = JSON.parse(localStorage.getItem('rep')||'null') || representantes[0];
  const [cnpj,setCnpj] = useState('');
  const [cliente,setCliente] = useState(null);
  const [cadastroNovo,setCadastroNovo] = useState(false);
  const [erro,setErro] = useState('');
  const [etapa,setEtapa] = useState('inicio'); // 'inicio' | 'empresa' | 'cadastro' | 'dados'
  const [clientes] = useState(clientesMock);

  function buscarCliente(){
    setErro('');
    if(!validarCNPJ(cnpj)){ setErro('CNPJ inválido.'); return; }
    const c = clientes.find(x => x.cnpj === cnpj);
    if (c && c.rep_id === rep.id){
      setCliente(c); setCadastroNovo(false); setEtapa('empresa');
    } else {
      setCliente(null); setCadastroNovo(true); setEtapa('cadastro');
    }
  }
  function voltar(){ setCliente(null); setCadastroNovo(false); setCnpj(''); setEtapa('inicio'); }
  function continuarComEmpresa(){ setEtapa('dados'); }
  function continuarComNovo(c){ setCliente(c); setEtapa('dados'); }

  if(etapa==='dados' && cliente) return <OrcamentoDados rep={rep} cliente={cliente} onVoltar={voltar}/>;
  if(etapa==='empresa' && cliente) return <OrcamentoEmpresa rep={rep} cliente={cliente} onVoltar={voltar} onContinuar={continuarComEmpresa}/>;
  if(etapa==='cadastro' && cadastroNovo) return <OrcamentoCadastroNovo rep={rep} cnpj={cnpj} onVoltar={voltar} onContinuar={continuarComNovo}/>;

  return(<div className="max-w-xl mx-auto p-6 space-y-4">
    <div className="card">
      <div className="h1">Etapa 1 – Orçamento</div>
      <div className="sub">Informe o CNPJ do cliente</div>
    </div>
    <div className="card space-y-3">
      <div><b>Representante:</b> {rep.nome}</div>
      <input className="input w-full" placeholder="Digite o CNPJ (ex: 00.000.000/0001-91)" value={cnpj} onChange={e=>setCnpj(e.target.value)} />
      {erro && <div className="text-red-600 text-sm">{erro}</div>}
      <button className="btn" onClick={buscarCliente}>Buscar Cliente</button>
    </div>
  </div>);
}
