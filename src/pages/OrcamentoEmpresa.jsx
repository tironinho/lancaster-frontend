import React from 'react';
export default function OrcamentoEmpresa({rep,cliente,onVoltar,onContinuar}){
  return(<div className="max-w-3xl mx-auto p-6 space-y-4">
    <div className="card flex items-center justify-between">
      <div><div className="h1">Dados da Empresa</div><div className="sub">Etapa 1 – Orçamento</div></div>
      <div className="flex gap-2">
        <button className="chip" onClick={onVoltar}>Trocar CNPJ</button>
        <button className="btn" onClick={onContinuar}>Iniciar Orçamento</button>
      </div>
    </div>
    <div className="card grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <div><b>Representante:</b> {rep.nome}</div>
      <div><b>CNPJ:</b> {cliente.cnpj}</div>
      <div><b>Empresa:</b> {cliente.nome}</div>
      <div><b>UF:</b> {cliente.uf}</div>
      <div><b>Prazo:</b> {cliente.prazo} dias</div>
      <div><b>Classificação:</b> {cliente.classificacao}</div>
      <div><b>Cidade:</b> {cliente.cidade}</div>
      <div><b>Endereço:</b> {cliente.endereco}</div>
      <div><b>Telefone:</b> {cliente.telefone}</div>
      <div><b>Contato:</b> {cliente.contato}</div>
      <div><b>E-mail:</b> {cliente.email}</div>
      <div><b>IE:</b> {cliente.inscricao_estadual}</div>
    </div>
  </div>);
}