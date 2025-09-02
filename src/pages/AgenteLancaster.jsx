
import React, { useEffect, useRef, useState } from "react";
import { propostas } from "../mocks/propostas";

// API key fixa (a pedido)
const DEFAULT_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

function inferContext(question){
  const q = question.toLowerCase();
  const ctx = {};
  if(q.includes("pendente") && (q.includes("aprova") || q.includes("aprovação"))){
    const pendentes = propostas.filter(p=>String(p.status).toLowerCase().includes("pendente"));
    ctx.pendentesAprovacao = pendentes.length;
  }
  if(q.includes("proposta") && q.includes("fechad")){
    ctx.fechadas = propostas.filter(p=>String(p.status).toLowerCase()==="aprovado" || String(p.status).toLowerCase()==="fechado").length;
  }
  if(q.includes("produção") || q.includes("em produção")){
    ctx.emProducao = propostas.filter(p=>String(p.status).toLowerCase().includes("produção")).length;
  }
  return ctx;
}

export default function AgenteLancaster(){
  const [apiKey] = useState(DEFAULT_KEY); // fixa
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {role:"system", content:"Você é o lancaster_bot, um assistente especialista no sistema de tingimento. Responda curto e objetivo. Quando houver contexto no 'dados_do_sistema' use-o como verdade."},
  ]);
  const listRef = useRef(null);

  useEffect(()=>{
    if(listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  },[messages]);

  async function send(){
    if(!input.trim()) return;
    const userMsg = {role:"user", content: input.trim()};
    const ctx = inferContext(input);
    const dados = JSON.stringify(ctx);
    const hints = Object.keys(ctx).length ? [{ role: "assistant", content: "contexto=" + JSON.stringify(ctx) }] : [];
    const newMsgs = [...messages, ...hints, userMsg];
    setMessages(m=>[...m, {role:"user", content: input.trim()}]);
    setInput("");

    try{
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer " + apiKey
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: newMsgs,
          temperature: 0.2
        })
      });
      const data = await r.json();
      const content = data?.choices?.[0]?.message?.content || JSON.stringify(data);
      setMessages(m=>[...m, {role:"assistant", content}]);
    }catch(err){
      setMessages(m=>[...m, {role:"assistant", content:"Erro ao contatar agente: " + String(err)}]);
    }
  }

  function handleKeyDown(e){
    if(e.key === "Enter"){
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full min-h-[60vh]">
      <div className="card mb-2">
        <div className="h1">Agente Lancaster</div>
        <div className="sub">Converse com o agente sobre os dados do sistema. Ex.: "Quantas propostas estão pendentes de aprovação?"</div>
      </div>

      <div ref={listRef} className="card overflow-auto space-y-3">
        {messages.filter(m=>m.role!=="system").map((m,i)=>(
          <div key={i} className={m.role==="user"?"text-right":""}>
            <div className={"inline-block px-3 py-2 rounded-2xl " + (m.role==="user"?"bg-black text-white":"bg-gray-100")}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <input className="input flex-1" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Digite sua pergunta..."/>
        <button className="btn" onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
