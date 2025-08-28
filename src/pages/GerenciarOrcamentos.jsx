
import React, { useState } from "react";
import { propostas } from "../mocks/propostas";
import { gruposICMS, markupBase } from "../mocks/markup";
import { composicoes } from "../mocks/composicoes";
import { servicos } from "../mocks/servicos";

export default function GerenciarOrcamentos(){
  const [aba,setAba] = useState("tabela_preco");

  // Tabela fictícia a partir do markupBase
  const [tabela, setTabela] = useState(
    Object.entries(markupBase).map(([categoria,markup])=>({categoria, markup, obs:""}))
  );
  const [tabelaICMS, setTabelaICMS] = useState(gruposICMS.map(g=>({...g})));

  const [servList, setServList] = useState(servicos.map(i=>({...i})));
  const [comps, setComps] = useState(composicoes.map(i=>({...i})));
  const [fechados, setFechados] = useState(
    propostas.filter(p=>p.status==="Fechado").map(i=>({...i}))
  );
  
  function updateList(setter, idx, key, value){
    setter(prev=>prev.map((row,i)=> i===idx? ({...row, [key]:value}) : row));
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="h1">Gerenciar orçamentos</div>
        <div className="sub">Ferramentas internas para manutenção de tabelas e ajustes.</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["tabela_preco","Manutenção de tabelas de preços"],
          ["lucro_comissao","Manutenção de lucro e comissões (cadastro cliente por cliente)"],
          ["ajustes_fechados","Manutenção de orçamento com preços fechados"],
          ["servicos_composicoes","Manutenção de serviços, composições"]
        ].map(([id,label])=>(
          <button key={id} onClick={()=>setAba(id)} className={"chip " + (aba===id? "bg-black text-white border-black":"")}>{label}</button>
        ))}
      </div>

      {aba==="tabela_preco" && (
        <div className="space-y-4">
          <div className="card overflow-auto">
            <div className="font-semibold mb-2">Tabela base (fictícia)</div>
            <table className="min-w-full text-sm">
              <thead><tr className="text-left border-b">
                <th className="py-2 pr-4">Categoria</th>
                <th className="py-2 pr-4">Markup</th>
                <th className="py-2 pr-4">Observações</th>
              </tr></thead>
              <tbody>
                {tabela.map((row,i)=>(
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{row.categoria}</td>
                    <td className="py-2 pr-4">
                      <input className="input w-28" value={row.markup} onChange={e=>updateList(setTabela,i,"markup",e.target.value)}/>
                    </td>
                    <td className="py-2 pr-4">
                      <input className="input" value={row.obs||""} onChange={e=>updateList(setTabela,i,"obs",e.target.value)} placeholder="Opcional"/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card overflow-auto">
            <div className="font-semibold mb-2">Grupos de ICMS por UF</div>
            <table className="min-w-full text-sm">
              <thead><tr className="text-left border-b">
                <th className="py-2 pr-4">Grupo</th>
                <th className="py-2 pr-4">UFs</th>
                <th className="py-2 pr-4">ICMS (%)</th>
              </tr></thead>
              <tbody>
                {tabelaICMS.map((row,i)=>(
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{row.grupo}</td>
                    <td className="py-2 pr-4">{row.ufs.join(", ")}</td>
                    <td className="py-2 pr-4">
                      <input className="input w-24" value={row.icms} onChange={e=>updateList(setTabelaICMS,i,"icms",e.target.value)}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aba==="lucro_comissao" && (
        <div className="card">
          <div className="font-semibold mb-2">Parâmetros gerais</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">Lucro padrão (%)<input className="input" defaultValue={12}/></label>
            <label className="block">Comissão representante (%)<input className="input" defaultValue={3}/></label>
          </div>
          <div className="sub mt-2">* Exemplo ilustrativo – persista conforme sua API quando disponível.</div>
        </div>
      )}

      {aba==="ajustes_fechados" && (
        <div className="card overflow-auto">
          <div className="font-semibold mb-2">IDs com preço fechado – alterar preço e validade</div>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left border-b">
              <th className="py-2 pr-4">ID</th><th className="py-2 pr-4">Cliente</th>
              <th className="py-2 pr-4">Preço (R$)</th><th className="py-2 pr-4">Validade (dias)</th>
              <th className="py-2 pr-4">Ações</th>
            </tr></thead>
            <tbody>
              {fechados.map((row,i)=>(
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-4">{row.id}</td>
                  <td className="py-2 pr-4">{row.clienteId}</td>
                  <td className="py-2 pr-4"><input className="input w-32" value={row.valor||0} onChange={e=>updateList(setFechados,i,"valor",e.target.value)}/></td>
                  <td className="py-2 pr-4"><input className="input w-28" value={row.validade||120} onChange={e=>updateList(setFechados,i,"validade",e.target.value)}/></td>
                  <td className="py-2 pr-4"><button className="btn">Salvar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba==="servicos_composicoes" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <div className="font-semibold mb-2">Serviços</div>
            {servList.map((s,i)=>(
              <div key={i} className="grid grid-cols-[1fr_7rem] gap-2 mb-2">
                <input className="input" value={s.nome} onChange={e=>updateList(setServList,i,"nome",e.target.value)}/>
                <input className="input" value={s.preco} onChange={e=>updateList(setServList,i,"preco",e.target.value)}/>
              </div>
            ))}
            <button className="btn mt-2">Adicionar serviço</button>
          </div>
          <div className="card">
            <div className="font-semibold mb-2">Composições</div>
            {comps.map((c,i)=>(
              <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                <input className="input" value={c.nome} onChange={e=>updateList(setComps,i,"nome",e.target.value)}/>
                <input className="input" value={c.componentes?.join(", ")||""} onChange={e=>updateList(setComps,i,"componentes",e.target.value.split(",").map(s=>s.trim()))}/>
              </div>
            ))}
            <button className="btn mt-2">Adicionar composição</button>
          </div>
        </div>
      )}
    </div>
  );
}
