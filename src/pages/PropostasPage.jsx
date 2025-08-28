import React, { useState, useEffect } from 'react';
import { propostas as propostasMock } from '../mocks/propostas';

export default function PropostasPage(){
  const [propostas,setPropostas] = useState([]);
  const [sel, setSel] = useState(null); // proposta selecionada (para Detalhes)

  // Carregar com fallback
  useEffect(()=>{
    try{
      const saved = JSON.parse(localStorage.getItem('propostas')||'null');
      if (saved && Array.isArray(saved) && saved.length>0) {
        setPropostas(saved);
      } else {
        setPropostas(propostasMock);
        localStorage.setItem('propostas', JSON.stringify(propostasMock));
      }
    }catch{
      setPropostas(propostasMock);
      localStorage.setItem('propostas', JSON.stringify(propostasMock));
    }
  },[]);

  // Persistir alterações
  useEffect(()=>{
    if (Array.isArray(propostas)) {
      localStorage.setItem('propostas', JSON.stringify(propostas));
    }
  },[propostas]);

  const onAprovar = (id)=> setPropostas(prev=>prev.map(p=>(
    p.id===id ? {...p, status:'aprovado', validadeDias:120, bloqueado:true} : p
  )));
  const onReprovar = (id)=> setPropostas(prev=>prev.map(p=>(
    p.id===id ? {...p, status:'reprovado'} : p
  )));
  const onDetalhes = (p)=> setSel(p);

  const onSalvarDetalhes = (dados)=>{
    setPropostas(prev=>prev.map(p=> p.id===dados.id ? dados : p));
    setSel(null);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="h1">Orçamentos enviados para aprovação</div>
        <div className="sub">Gerencie os status das propostas enviadas ao cliente</div>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Data</th>
              <th className="p-2">Valor total</th>
              <th className="p-2">Validade</th>
              <th className="p-2">Status</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map(p => {
              const disabled = p.bloqueado || p.status==='aprovado';
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.cliente}</td>
                  <td className="p-2">{p.data}</td>
                  <td className="p-2">R$ {Number(p.valorTotal).toFixed(2)}</td>
                  <td className="p-2">{p.validadeDias || 30} dias</td>
                  <td className="p-2">
                    <span className={
                      'px-2 py-1 rounded-full text-xs ' +
                      (p.status==='aprovado' ? 'bg-green-100 text-green-700' :
                       p.status==='reprovado' ? 'bg-red-100 text-red-700' :
                       'bg-yellow-100 text-yellow-700')
                    }>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="chip" disabled={disabled} onClick={()=>onAprovar(p.id)}>Marcar aprovado</button>
                      <button className="chip" disabled={disabled} onClick={()=>onReprovar(p.id)}>Marcar reprovado</button>
                      <button className="chip" onClick={()=>onDetalhes(p)}>Detalhes</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sel && (
        <DetalhesModal proposta={sel} onClose={()=>setSel(null)} onSave={onSalvarDetalhes}/>
      )}
    </div>
  );
}

/** Modal de Detalhes: Amostras e Laboratório */

function DetalhesModal({ proposta, onClose, onSave }){
  const [form, setForm] = React.useState(()=>JSON.parse(JSON.stringify(proposta)));
  const p = form;

  const set = (path, value)=>{
    const segs = path.split('.');
    const clone = {...form};
    let ref = clone;
    for(let i=0;i<segs.length-1;i++){
      ref[segs[i]] = {...(ref[segs[i]]||{})};
      ref = ref[segs[i]];
    }
    ref[segs.at(-1)] = value;
    setForm(clone);
  };

  const addPantone = ()=>{
    const arr = (form.dadosOrcamento?.pantones || []).slice();
    arr.push({ ref: "", tipo: "TPG", nome: "" });
    set("dadosOrcamento.pantones", arr);
  };
  const removePantone = (idx)=>{
    const arr = (form.dadosOrcamento?.pantones || []).slice();
    arr.splice(idx,1);
    set("dadosOrcamento.pantones", arr);
  };

  const salvar = ()=>{
    const clone = JSON.parse(JSON.stringify(form));
    if(Array.isArray(clone.dadosOrcamento?.pantones)){
      clone.dadosOrcamento.pantones = clone.dadosOrcamento.pantones.map(pt=>{
        const { amostraFisica, ...rest } = pt || {};
        return rest;
      });
    }
    onSave?.(clone);
  };

  React.useEffect(()=>{
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e)=> e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return ()=>{ document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const backdropClick = (e)=>{ if(e.target===e.currentTarget) onClose?.(); };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onMouseDown={backdropClick} aria-modal role="dialog">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="font-semibold">Detalhes da proposta • {p.id}</div>
          <div className="flex gap-2">
            <button className="chip" onClick={salvar}>Salvar</button>
            <button className="chip" onClick={onClose}>Fechar</button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto p-5 space-y-4">
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><b>Cliente:</b> {p.cliente}</div>
              <div><b>Data:</b> {p.data}</div>
              <div><b>Status:</b> {p.status}</div>
              <div><b>Validade:</b> {p.validadeDias || 30} dias</div>
              <div><b>Composição:</b> {p.dadosOrcamento?.composicao || "-"}</div>
              <div><b>Descrição da Base:</b> {p.dadosOrcamento?.descricaoBase || "-"}</div>
              <div><b>Tipo de pantone:</b> {p.dadosOrcamento?.tipoPantone || "-"}</div>
              <div><b>Serviços:</b> {Array.isArray(p.dadosOrcamento?.servicos) ? p.dadosOrcamento.servicos.join(", ") : "-"}</div>
              <div><b>Prazo:</b> {p.dadosOrcamento?.prazoPagamento ? `${p.dadosOrcamento.prazoPagamento} dias` : "-"}</div>
              <div><b>Pantones (ref):</b> {Array.isArray(p.dadosOrcamento?.pantones) ? p.dadosOrcamento.pantones.map(x => x.ref).join(", ") : "-"}</div>
            </div>
          </div>

          {/* Checkbox única de Amostra física */}
          <div className="card">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" checked={!!p.amostraFisica} onChange={(e)=>set("amostraFisica", e.target.checked)} />
              <span>Amostra física</span>
            </label>
          </div>

          {/* Pantones: ref/tipo/nome, sem flag amostraFisica */}
          <div className="card space-y-3">
            <div className="h3">Pantones</div>
            {(p.dadosOrcamento?.pantones || []).map((pt, idx)=>(
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input className="input" placeholder="Ref" value={pt?.ref || ""} onChange={(e)=>set(`dadosOrcamento.pantones.${idx}.ref`, e.target.value)} />
                <input className="input" placeholder="Tipo (ex.: TPG)" value={pt?.tipo || ""} onChange={(e)=>set(`dadosOrcamento.pantones.${idx}.tipo`, e.target.value)} />
                <input className="input" placeholder="Nome do pantone" value={pt?.nome || ""} onChange={(e)=>set(`dadosOrcamento.pantones.${idx}.nome`, e.target.value)} />
                <div className="md:col-span-3">
                  <button className="chip" onClick={()=>removePantone(idx)}>Remover</button>
                </div>
              </div>
            ))}
            <button className="btn" onClick={addPantone}>Adicionar pantone</button>
          </div>

          {/* Laboratório mantido */}
          <div className="card space-y-3">
            <div className="h3">Laboratório</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label">Códigos / Nº Ficha de Desenvolvimento</label>
                <input
                  className="input"
                  placeholder="Ex.: DEV-0001"
                  onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                      const val = e.currentTarget.value.trim();
                      if(!val) return;
                      const atual = (form.laboratorio?.codigos || []).slice();
                      atual.push(val);
                      set("laboratorio.codigos", atual);
                      e.currentTarget.value='';
                    }
                  }}
                />
                <div className="flex gap-2 flex-wrap mt-2">
                  {(p.laboratorio?.codigos || []).map((c,i)=>(<span key={i} className="chip">{c}</span>))}
                </div>
              </div>
              <div>
                <label className="label">Observações</label>
                <input className="input" value={p.laboratorio?.obs || ""} onChange={(e)=>set("laboratorio.obs", e.target.value)} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
