
import React,{useMemo,useState} from 'react';
import { composicoes } from '../mocks/composicoes';
import { servicos } from '../mocks/servicos';
import { pantones } from '../mocks/pantones';
import { orcamentosPrevios } from '../mocks/orcamentosPrevios';
import PantoneModal from './PantoneModal';
import jsPDF from 'jspdf';
import { gerarTabelaPrecos, obterCustoIndustrial } from '../utils/preco';
import { propostas as propostasMock } from '../mocks/propostas';

function diffDays(d1, d2){
  const ms = Math.abs(new Date(d1).getTime() - new Date(d2).getTime());
  return Math.floor(ms / (1000*60*60*24));
}

function PrecoTabela({ uf, comp }){
  const { custo, percFixos, tabela } = gerarTabelaPrecos({ uf, comp });
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Lucro</th>
            {tabela[0]?.precos?.map(cell => (
              <th key={cell.comissao} className="p-2">Comissão {cell.comissao}%</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabela.map(l => (
            <tr key={l.lucro} className="border-t">
              <td className="p-2 font-semibold">{l.lucro}%</td>
              {l.precos.map(cell => (
                <td key={cell.comissao} className="p-2">R$ {cell.preco.toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-gray-600 mt-2">Base % fixos: {percFixos}% • Custo: R$ {custo.toFixed(2)}</div>
    </div>
  );
}


function PropostasModal({ open, onClose, items, onAprovar, onReprovar }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-lg">Propostas enviadas para aprovação</div>
          <button className="chip" onClick={onClose}>Fechar</button>
        </div>
        <div className="overflow-auto max-h-[60vh]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Data</th>
                <th className="p-2">Valor total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.cliente}</td>
                  <td className="p-2">{p.data}</td>
                  <td className="p-2">R$ {p.valorTotal.toFixed(2)}</td>
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
                      <button className="chip" onClick={()=>onAprovar(p.id)}>Marcar aprovado</button>
                      <button className="chip" onClick={()=>onReprovar(p.id)}>Marcar reprovado</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OrcamentoDados({ rep, cliente, onVoltar }){
  const [propostas,setPropostas] = useState(propostasMock);
  const [propostasOpen,setPropostasOpen] = useState(false);

  const [tipo,setTipo]=useState('Tubular Tinto');
  const [comp,setComp]=useState('');
  const [descricaoBase,setDescricaoBase]=useState('');
  const [servSel,setServSel]=useState([]);
  const [prazo,setPrazo]=useState(cliente?.prazo ?? 28);

  const [buscaPantone,setBuscaPantone]=useState('');
  const [selecionados,setSelecionados]=useState([]); // {ref, tipo, amostra}
  const [modalOpen,setModalOpen]=useState(false);
  const [erroPantone,setErroPantone]=useState('');

  function toggleServico(s){
    setServSel(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s]);
  }

  function checarDuplicidade(ref){
    const hoje = new Date();
    return orcamentosPrevios.some(o => 
      o.pantoneRef===ref && o.composicao===comp && (Math.abs(new Date(o.data).getTime()-hoje.getTime())/(1000*60*60*24))<=30
    );
  }

  function adicionarPantone(ref){
    setErroPantone('');
    if(!comp){ setErroPantone('Selecione uma composição antes de adicionar pantone.'); return; }
    if(checarDuplicidade(ref)){ setErroPantone(`Já existe orçamento com Pantone ${ref} e composição ${comp} nos últimos 30 dias.`); return; }
    if(!selecionados.find(p=>p.ref===ref)){
      setSelecionados(prev=>[...prev,{ref, tipo:'TPG', amostra:false}]);
    }
  }
  function onSelectFromModal(list){
    list.forEach(adicionarPantone);
  }
  function togglePantone(ref){
    setSelecionados(prev => prev.filter(p=>p.ref!==ref));
  }
  function setTipoPantone(ref, value){
    setSelecionados(prev => prev.map(p => p.ref===ref ? {...p,tipo:value} : p));
  }
  function setAmostra(ref, value){
    setSelecionados(prev => prev.map(p => p.ref===ref ? {...p,amostra:value} : p));
  }

  // Formação de preço - controles
  const [lucroSel, setLucroSel] = useState(10); // %
  const [comissaoSel, setComissaoSel] = useState(3); // %
  const [precoUnit, setPrecoUnit] = useState(null); // R$
  function percFixosAtual(){ // % fixos + ICMS UF
    const base = 9.25 + 3.08 + 2.5 + 2 + 8.17 + 2; // sem ICMS
    const uf = cliente?.uf || 'SP';
    const icmsUF = uf==='SC'?3.5:(['SP','RS','RJ','PR','MG'].includes(uf)?12:7);
    return base + icmsUF;
  }
  function custoAtual(){ return comp ? obterCustoIndustrial(comp) : 0; }
  function precoPorPerc(lucro, com){
    const custo = custoAtual();
    if(!custo) return 0;
    const totalPerc = percFixosAtual() + lucro + com;
    return +(custo * (1 + totalPerc/100)).toFixed(2);
  }
  function comissaoAPartirDoPreco(preco, lucro){
    const custo = custoAtual(); if(!custo) return 0;
    const basePerc = percFixosAtual() + lucro;
    const totalPerc = (preco / custo - 1) * 100;
    return +(totalPerc - basePerc).toFixed(2);
  }
  function onChangePreco(v){
    const p = Number(v)||0;
    setPrecoUnit(p);
    const novaCom = comissaoAPartirDoPreco(p, lucroSel);
    setComissaoSel(Math.max(0, +novaCom.toFixed(2)));
  }
  function onChangeLucro(v){
    const L = Number(v)||0; setLucroSel(L);
    const novo = precoPorPerc(L, comissaoSel); setPrecoUnit(novo);
  }
  function onChangeComissao(v){
    const C = Number(v)||0; setComissaoSel(C);
    const novo = precoPorPerc(lucroSel, C); setPrecoUnit(novo);
  }


  function enviarParaAprovacao(){
// calcula preço unitário atual
  const preco = (precoUnit ?? precoPorPerc(lucroSel, comissaoSel)) || 0;
  const total = +(preco * Math.max(1, selecionados.length)).toFixed(2);

  // Monta a proposta completa com os campos novos
  const id = 'P-' + String(Math.floor(1000 + Math.random()*9000));
  const proposta = {
    id,
    cliente: cliente?.nome || '—',
    data: new Date().toISOString().slice(0,10),
    valorTotal: total,
    status: 'pendente',
    validadeDias: 30,
    bloqueado: false,
    dadosOrcamento: {
      composicao: comp || '',
      descricaoBase,
      tipoPantone: 'TPG',
      servicos: [...servSel],
      prazoPagamento: prazo,
      pantones: (selecionados || []).map(p => ({
        ref: p.ref || p.codigo || p.id || ''
      }))
    },
    amostras: { responsavel: '', telefone: '', endereco: '', lote: '' },
    laboratorio: { responsavel: '', telefone: '', endereco: '', lote: '', codigos: [] }
  };

  // Persiste
  try {
    const atual = JSON.parse(localStorage.getItem('propostas')||'null');
    const lista = (atual && Array.isArray(atual) ? atual : []);
    lista.unshift(proposta);
    localStorage.setItem('propostas', JSON.stringify(lista));
  } catch (e) {
    localStorage.setItem('propostas', JSON.stringify([proposta]));
  }

  // navegar para a tela de propostas
  window.dispatchEvent(new Event('goToPropostas'));
};


  const podeGerar = tipo && comp && descricaoBase.trim().length>0 && prazo>0 && selecionados.length>0;

  function gerarPDF(){
    const id = 'ORC-' + Date.now();
    const doc = new jsPDF({unit:'pt', format:'a4'});
    const margin = 48; let y = margin;
    try{ doc.addImage('/lancaster-logo.png','PNG',doc.internal.pageSize.getWidth()-160,margin-16,120,40);}catch{}
    doc.setFontSize(16); doc.text('Orçamento de Tingimento', margin, y); y+=8;
    doc.setFontSize(10); doc.text('Válido por 30 dias', margin, y); y+=24;
    doc.setFontSize(12);
    const add = (k,v)=>{ doc.text(`${k}: ${v}`, margin, y); y+=18; }
    add('ID', id);
    add('Representante', rep?.nome || '');
    add('Cliente', `${cliente?.nome} (${cliente?.cnpj})`);
    add('UF', cliente?.uf || '');
    y+=6; doc.setFont(undefined,'bold'); doc.text('Dados do orçamento', margin, y); doc.setFont(undefined,'normal'); y+=14;
    add('Tipo', tipo);
    add('Composição', comp);
    add('Descrição da base', descricaoBase);
    add('Serviços', servSel.join(', ') || '-');
    add('Prazo de pagamento', `${prazo} dias`);

    // Pantones + preços
    y+=6; doc.setFont(undefined,'bold'); doc.text('Pantones selecionados', margin, y); doc.setFont(undefined,'normal'); y+=14;
    doc.text('Ref.', margin, y); doc.text('Preço (R$)', margin+120, y); doc.text('Tipo', margin+220, y); doc.text('Amostra', margin+300, y); y+=16;
    const preco = precoUnit ?? precoPorPerc(lucroSel, comissaoSel);
    selecionados.forEach(p=>{ doc.text(p.ref, margin, y); doc.text(String(preco.toFixed(2)), margin+120, y); doc.text(p.tipo, margin+220, y); doc.text(p.amostra?'Sim':'Não', margin+300, y); y+=16; });

    // Detalhamento
    y+=10; doc.setFont(undefined,'bold'); doc.text('Detalhamento do cálculo', margin, y); doc.setFont(undefined,'normal'); y+=16;
    add('Custo industrial', 'R$ '+custoAtual().toFixed(2));
    add('Percentuais fixos', percFixosAtual().toFixed(2)+'%');
    add('Comissão', comissaoSel.toFixed(2)+'%');
    add('Lucro', lucroSel.toFixed(2)+'%');
    add('Preço unitário', 'R$ '+preco.toFixed(2));

    doc.save(`${id}.pdf`);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="card flex items-center justify-between">
        <div>
          <div className="h1">Dados para começar um orçamento</div>
          <div className="sub">Cliente: <b>{cliente?.nome}</b> • CNPJ: {cliente?.cnpj} • UF: {cliente?.uf}</div>
        </div>
        <button className="chip" onClick={onVoltar}>Voltar</button>
      </div>

      {/* Topo em 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Coluna esquerda */}
        <div className="card space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="font-semibold">Tipo</div>
              <select className="input" value={tipo} onChange={e=>setTipo(e.target.value)}>
                <option>Tubular Tinto</option>
                <option>Ramado Tinto</option>
                <option>Termofixado Tinto</option>
                <option>Hidrorelaxado Tinto</option>
              </select>
            </div>

            <div>
              <div className="font-semibold mb-1">Serviços</div>
              <div className="flex flex-wrap gap-2">
                {servicos.map(s=>(
                  <button type="button" key={s} className={'chip '+(servSel.includes(s)?'chip-active':'')} onClick={()=>toggleServico(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-semibold">Descrição da Base</div>
              <textarea className="input min-h-[96px]" placeholder="Digite a descrição da base" value={descricaoBase} onChange={e=>setDescricaoBase(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="card space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="font-semibold">Composição</div>
              <select className="input" value={comp} onChange={e=>setComp(e.target.value)}>
                <option value="">Selecione…</option>
                {composicoes.map(c => <option key={c.codigo} value={c.descricao}>{`${c.codigo} - ${c.sigla}`}</option>)}
              </select>
            </div>

            <div>
              <div className="font-semibold">Prazo de pagamento</div>
              <input className="input" type="number" value={prazo} onChange={e=>setPrazo(Number(e.target.value)||28)} />
            </div>

            {/* Formação de preço (controle) */}
            <div>
              <div className="font-semibold mb-2">Formação de preço (controle)</div>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <label className="text-xs text-gray-600">Lucro (%)</label>
                  <input className="input" type="number" min="0" step="0.1" value={lucroSel} onChange={e=>onChangeLucro(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Comissão (%)</label>
                  <input className="input" type="number" min="0" step="0.1" value={comissaoSel} onChange={e=>onChangeComissao(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Preço unitário (R$)</label>
                  <input className="input" type="number" min="0" step="0.01" value={precoUnit ?? ''} onChange={e=>onChangePreco(e.target.value)} />
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">Custo industrial R$ {custoAtual().toFixed(2)} • % fixos (com ICMS da UF): {percFixosAtual().toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pantones - largura total */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold">Pantones</div>
          <div className="flex items-center gap-2">
            <input className="input w-64" placeholder="Adicionar por referência…" value={buscaPantone} onChange={e=>setBuscaPantone(e.target.value)} />
            <button className="chip" onClick={()=>{ const r=buscaPantone.trim(); if(r){ adicionarPantone(r); } }}>Adicionar</button>
            <button className="btn" onClick={()=>setModalOpen(true)}>Adicionar pantone</button>
          </div>
        </div>
        {erroPantone && <div className="text-red-600 text-sm">{erroPantone}</div>}

        {/* Lista de pantones selecionados */}
        {selecionados.length===0 && <div className="text-sm text-gray-600">Nenhum pantone selecionado. Use <b>Adicionar pantone</b> ou adicione por referência.</div>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {selecionados.map(p => (
            <div key={p.ref} className='rounded-2xl overflow-hidden border border-black'>
              <img src={(pantones.find(x=>x.ref===p.ref)||{}).img} alt={p.ref} className="w-full h-36 object-cover"/>
              <div className="p-2 flex items-center justify-between">
                <div className="font-semibold text-sm">{p.ref}</div>
                <button className="chip" onClick={()=>togglePantone(p.ref)}>Remover</button>
              </div>
              <div className="p-2 flex items-center gap-2 text-sm">
                <select className="input" value={p.tipo} onChange={e=>setTipoPantone(p.ref,e.target.value)}>
                  <option>TPG</option><option>TCX</option>
                </select>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={p.amostra} onChange={e=>setAmostra(p.ref,e.target.checked)} />
                  Amostra física
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview da formação de preço */}
      {comp && (
        <div className="card space-y-3">
          <div className="font-semibold text-lg">Formação de preço (preview)</div>
          <div className="text-sm text-gray-600">UF: {cliente?.uf} • Custo industrial para {comp || '-'}: R$ {custoAtual().toFixed(2)}</div>
          <PrecoTabela uf={cliente?.uf} comp={comp} />
        </div>
      )}

      {/* Botão final centralizado */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button className="btn disabled:opacity-50" disabled={!podeGerar} onClick={gerarPDF}>Gerar PDF (válido por 30 dias)</button>
        <button className="btn" onClick={enviarParaAprovacao}>Enviar para aprovação</button>
      </div>

      <PantoneModal open={modalOpen} onClose={()=>setModalOpen(false)} onSelectMany={onSelectFromModal} />
      <PropostasModal open={propostasOpen} onClose={()=>setPropostasOpen(false)} items={propostas}
        onAprovar={(id)=>setPropostas(prev=>prev.map(p=>p.id===id?{...p,status:'aprovado'}:p))}
        onReprovar={(id)=>setPropostas(prev=>prev.map(p=>p.id===id?{...p,status:'reprovado'}:p))}
      />
    </div>
  );
}
