import React,{useMemo,useState,useEffect} from 'react';
import { pantones } from '../mocks/pantones';

export default function PantoneModal({ open, onClose, onSelectMany }){
  const [busca,setBusca]=useState('');
  const [selecionados,setSelecionados]=useState({}); // ref:true
  useEffect(()=>{ if(!open){ setBusca(''); setSelecionados({}); } },[open]);

  const grid = useMemo(()=>{
    const q = busca.toLowerCase();
    return pantones.filter(p=>p.ref.toLowerCase().includes(q));
  },[busca]);

  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow max-w-5xl w-full mx-4 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Selecionar Pantones</div>
          <button className="chip" onClick={onClose}>Fechar</button>
        </div>
        <input className="input w-full" placeholder="Buscar por referência..." value={busca} onChange={e=>setBusca(e.target.value)} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[60vh] overflow-auto pr-1">
          {grid.map(p=>{
            const checked=!!selecionados[p.ref];
            return (
              <label key={p.ref} className={"rounded-2xl overflow-hidden border cursor-pointer "+(checked?'border-black':'border-gray-200')}>
                <img src={p.img} alt={p.ref} className="w-full h-36 object-cover"/>
                <div className="p-2 flex items-center justify-between">
                  <div className="font-semibold text-sm">{p.ref}</div>
                  <input type="checkbox" checked={checked} onChange={e=>setSelecionados(prev=>({...prev,[p.ref]:e.target.checked}))}/>
                </div>
              </label>
            );
          })}
        </div>
        <div className="flex justify-end gap-2">
          <button className="chip" onClick={onClose}>Cancelar</button>
          <button className="btn" onClick={()=>{ onSelectMany(Object.keys(selecionados).filter(r=>selecionados[r])); onClose(); }}>Adicionar selecionados</button>
        </div>
      </div>
    </div>
  );
}
