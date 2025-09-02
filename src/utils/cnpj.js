// Validação de CNPJ (XX.XXX.XXX/0001-XX)
export function validarCNPJ(value=''){
  const cnpj = value.replace(/\D/g,'');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  const calc = (base) => {
    let size = base.length;
    let pos = size - 7;
    let soma = 0;
    for (let i=0; i<size; i++){
      soma += parseInt(base[i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const res = soma % 11;
    return (res < 2) ? 0 : 11 - res;
  };
  const base12 = cnpj.slice(0,12);
  const d1 = calc(base12);
  const base13 = base12 + String(d1);
  const d2 = calc(base13);
  return cnpj.endsWith(String(d1)+String(d2));
}
