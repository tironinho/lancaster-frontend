import { markupBase, gruposICMS, icmsPorUF } from '../mocks/markup';
import { classificacoesTabela, faixaComissaoRegra } from '../mocks/classificacoes';
import { custoIndustrial as custos } from '../mocks/custoIndustrial';

export function obterCustoIndustrial(comp){
  const linha = custos.find(c => c.comp === comp);
  return linha ? linha.valor : (custos[0]?.valor || 4.5);
}

export function percentTotalBase(uf, admComFin = markupBase.admComFinPadrao){
  const icms = icmsPorUF(uf);
  return {
    pisCofins: markupBase.pisCofins,
    irpjCsll: markupBase.irpjCsll,
    inss: markupBase.inss,
    icms,
    frete: markupBase.frete,
    admComFin: admComFin,
    taxaFinanceira: markupBase.taxaFinanceira
  };
}

// Retorna uma grade de preços por Lucro e Comissão
export function gerarTabelaPrecos({ uf, comp, precoBaseOverride, lucroArray=[9,10,11,12], comissaoArray=[2,3,4,5], admComFin }){
  const custo = precoBaseOverride ?? obterCustoIndustrial(comp);
  const base = percentTotalBase(uf, admComFin);
  const percFixos = base.pisCofins + base.irpjCsll + base.inss + base.icms + base.frete + base.admComFin + base.taxaFinanceira;

  const tabela = [];
  for (const lucro of lucroArray){
    const linha = { lucro, precos: [] };
    for (const com of comissaoArray){
      const totalPerc = percFixos + com + lucro;
      const precoVenda = +(custo * (1 + totalPerc/100)).toFixed(2);
      linha.precos.push({ comissao: com, preco: precoVenda });
    }
    tabela.push(linha);
  }
  return { custo, percFixos: +percFixos.toFixed(2), tabela };
}

// Regra de comissionamento por faixa de preço (ex.: limiar 8,5 => 3% abaixo / 4% acima)
export function comissaoPorFaixa(preco, limiar=faixaComissaoRegra.limiar){
  return preco >= limiar ? faixaComissaoRegra.acimaOuIgual : faixaComissaoRegra.abaixo;
}
