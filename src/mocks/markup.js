// Tabela de MARK-UP por grupo de estados
export const markupBase = {
  pisCofins: 9.25,
  irpjCsll: 3.08,
  inss: 2.5,
  frete: 2,
  admComFinPadrao: 8.17,
  taxaFinanceira: 2
};

export const gruposICMS = [
  { grupo: "SC", ufs: ["SC"], icms: 3.5 },
  { grupo: "Sul/Sudeste", ufs: ["SP","RS","RJ","PR","MG"], icms: 12 },
  { grupo: "N/NE/CO", ufs: ["TO","SE","RO","RN","PI","PE","PA","MT","MS","MA","GO","ES","DF","CE","BA","AP","AM","AL","AC"], icms: 7 }
];

// Helper para obter o ICMS de uma UF
export function icmsPorUF(uf){
  const linha = gruposICMS.find(g => g.ufs.includes(uf));
  return linha ? linha.icms : 12; // default seguro
}
