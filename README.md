# IA – Orçamento de Tingimento (novo)
Fluxo: cabeçalho com representante → CNPJ → empresa existente ou pré-cadastro.

## Rodar
npm i
npm run dev


## Novos mocks
- `src/mocks/classificacoes.js` → tabela de Lucro/Comissão por categoria
- `src/mocks/markup.js` → Pis/Cofins, IRPJ/CSLL, INSS, Frete, Adm/Com/Fin (8,17), Taxa (2) e **ICMS por UF**
- `src/mocks/clientes.js` → clientes enriquecidos (telefone, endereço, IE, contato, e-mail, cidade, `classeTabela`)
