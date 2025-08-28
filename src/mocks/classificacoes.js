// Classificação do cliente (editável futuramente via UI/Admin)
export const classificacoesTabela = [
  {
    id: "volume_preco_baixo",
    titulo: "Volume x Preço Baixo",
    lucro: [2.5, 3, 4, 5],
    comissao: [2, 3, 4, 5]
  },
  {
    id: "volume_preco_padrao",
    titulo: "Volume x Preço Padrão",
    lucro: [9, 10, 11, 12],
    comissao: [2, 3, 4, 5]
  },
  {
    id: "pouco_volume_preco_alto",
    titulo: "Pouco Volume x Preço Alto",
    lucro: [14, 15, 16, 17],
    comissao: [2, 3, 4, 5]
  },
  {
    id: "especiais",
    titulo: "Especiais",
    lucro: [7, 8, 9, 10],
    comissao: [2, 3, 4, 5]
  }
];

// Regra de faixa de comissão por preço (pode ser sobrescrita por cliente)
export const faixaComissaoRegra = {
  limiar: 8.5,        // até 8,49 => abaixo; >= 8,50 => acimaOuIgual
  abaixo: 3,
  acimaOuIgual: 4
};
