
import React, { useMemo } from "react";
import { propostas } from "../mocks/propostas";

function Table({rows, columns}){
  return (
    <div className="card overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            {columns.map(c => <th key={c.key} className="py-2 pr-4">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} className="border-b last:border-b-0">
              {columns.map(c => <td key={c.key} className="py-2 pr-4">{c.render? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// cria campos faltantes para simular funcionamento
function enrich(base){
  return base.map((p,idx)=>{
    const solicitouAmostra = (idx % 3 === 0);
    const entrouProducao = (p.status === "aprovado" && idx % 2 === 0);
    const tipos = ["Tubular Tinto","Ramado Tinto","Termofixado Tinto","Hidrorelaxado Tinto"];
    const cores = ["AZUL-TPG-123","VERM-TPG-455","AREIA-TPG-201","PRETO-TPG-010"];
    return {
      ...p,
      solicitouAmostra,
      entrouProducao,
      tipo: tipos[idx % tipos.length],
      cor: cores[idx % cores.length],
      peso: 500 + (idx*37)%300,
      dataProducao: p.data
    };
  });
}

export default function Relatorios({tipo="id_orcados"}){
  const base = useMemo(()=>propostas.map(p=>({
    id: p.id, cliente: p.cliente, data: p.data,
    valor: p.valorTotal ?? p.valor ?? 0,
    status: (p.status||'').toLowerCase()
  })),[]);

  const all = useMemo(()=>enrich(base),[base]);

  const datasets = {
    id_orcados: all,
    id_solicitado_amostra: all.filter(p=>p.solicitouAmostra),
    id_orcados_sem_solicitacao: all.filter(p=>!p.solicitouAmostra),
    id_entrou_producao: all.filter(p=>p.entrouProducao),
    geral_por_cliente: Object.values(all.reduce((acc,p)=>{
      const k=p.cliente; acc[k]??={cliente:k, quantidade:0, valorTotal:0};
      acc[k].quantidade++; acc[k].valorTotal += Number(p.valor||0);
      return acc;
    },{})),
  };

  const commons = [
    {key:"id", label:"ID"},
    {key:"cliente", label:"Cliente"},
    {key:"data", label:"Data"},
    {key:"valor", label:"Valor (R$)"},
    {key:"status", label:"Status"},
  ];

  const columns = {
    id_orcados: commons,
    id_solicitado_amostra: commons,
    id_orcados_sem_solicitacao: commons,
    id_entrou_producao: [
      {key:"id", label:"ID"},
      {key:"cliente", label:"Cliente"},
      {key:"cor", label:"Cor"},
      {key:"dataProducao", label:"Data"},
      {key:"peso", label:"Peso (kg)"},
      {key:"tipo", label:"Tipo"},
    ],
    geral_por_cliente: [
      {key:"cliente", label:"Cliente"},
      {key:"quantidade", label:"Qtd. de IDs"},
      {key:"valorTotal", label:"Valor total (R$)"},
    ]
  }[tipo] || commons;

  const title = {
    id_orcados: "Relatório de ID orçados",
    id_solicitado_amostra: "Relatório de ID solicitado amostras",
    id_orcados_sem_solicitacao: "Relatório de ID orçados, sem solicitação de amostras",
    id_entrou_producao: "Relatório de ID orçados, que já entrou produção (Cor, Data e Peso)",
    geral_por_cliente: "Relatório geral por cliente",
  }[tipo] || "Relatórios";

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="h1">{title}</div>
        <div className="sub">Consultas ilustrativas baseadas nos dados mockados.</div>
      </div>
      <Table rows={datasets[tipo] || []} columns={columns} />
    </div>
  );
}
