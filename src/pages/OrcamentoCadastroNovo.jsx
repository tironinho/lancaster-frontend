import React,{useState} from 'react';
export default function OrcamentoCadastroNovo({rep,cnpj,onVoltar,onContinuar}){
  const [telefone,setTelefone]=useState(''); const [endereco,setEndereco]=useState('');
  const [classificacao,setClassificacao]=useState('A'); const [nome,setNome]=useState('');
  const [uf,setUf]=useState('SC'); const [cidade,setCidade]=useState('');
  function salvar(){ alert('Pré-cadastro enviado ao Comercial.'); onContinuar && onContinuar({
    cnpj, nome: nome||'Cliente Novo', uf, cidade, prazo:28, classificacao,
    rep_id: 'rep-001', endereco, telefone, contato:'', email:'', inscricao_estadual:'', classeTabela:'volume_preco_baixo'
  }); }
  return(<div className="max-w-xl mx-auto p-6 space-y-4">
    <div className="card flex items-center justify-between">
      <div><div className="h1">Pré-cadastro de Cliente Novo</div><div className="sub">Etapa 1 – Orçamento</div></div>
      <button className="chip" onClick={onVoltar}>Trocar CNPJ</button>
    </div>
    <div className="card space-y-3">
      <div><b>Representante:</b> {rep.nome}</div>
      <input className="input w-full" value={cnpj} disabled />
      <input className="input w-full" placeholder="Nome da empresa" value={nome} onChange={e=>setNome(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <select className="input w-full" value={uf} onChange={e=>setUf(e.target.value)}>
          {['SC','SP','RS','RJ','PR','MG','BA','CE','GO','DF'].map(u=><option key={u}>{u}</option>)}
        </select>
        <input className="input w-full" placeholder="Cidade" value={cidade} onChange={e=>setCidade(e.target.value)} />
      </div>
      <input className="input w-full" placeholder="Telefone" value={telefone} onChange={e=>setTelefone(e.target.value)} />
      <input className="input w-full" placeholder="Endereço" value={endereco} onChange={e=>setEndereco(e.target.value)} />
      <select className="input w-full" value={classificacao} onChange={e=>setClassificacao(e.target.value)}>
        <option>A</option><option>B</option><option>C</option>
      </select>
      <button className="btn" onClick={salvar}>Salvar & Continuar</button>
    </div>
  </div>);
}