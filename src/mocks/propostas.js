export const propostas = [
  { id: 'P-1001', cliente: 'Têxtil Aurora', data: '2025-08-20', valorTotal: 15230.50, status: 'pendente' },
  { id: 'P-1002',
    validadeDias: 30,
    bloqueado: false,
    dadosOrcamento: {
      composicao: '100%CO',
      descricaoBase: 'AREIA',
      tipoPantone: 'TPG',
      servicos: ['Rama'],
      prazoPagamento: 28,
      pantones: [
        {ref: '186479-4', tipo: 'TPG', amostraFisica: false},
        {ref: '199254-1', tipo: 'TPG', amostraFisica: true}
      ]
    },
    amostras: { responsavel: '', telefone: '', endereco: '', lote: '' },
    laboratorio: { responsavel: '', telefone: '', endereco: '', lote: '', codigos: [] }, cliente: 'Fios Brasil', data: '2025-08-22', valorTotal: 8930.00,   status: 'aprovado' },
  { id: 'P-1003', cliente: 'ColorPrint Indústria', data: '2025-08-24', valorTotal: 12980.75, status: 'reprovado' },
  { id: 'P-1004', cliente: 'Malharia Estilo', data: '2025-08-25', valorTotal: 6780.10, status: 'pendente' },
  { id: 'P-1005', cliente: 'Tecelagem União', data: '2025-08-25', valorTotal: 23120.00, status: 'aprovado' },
  { id: 'P-1006', cliente: 'Confecções Alfa', data: '2025-08-26', valorTotal: 5120.55, status: 'pendente' },
  { id: 'P-1007', cliente: 'Tinturaria Tropical', data: '2025-08-26', valorTotal: 7744.30, status: 'reprovado' },
  { id: 'P-1008', cliente: 'Indústria Nova Era', data: '2025-08-27', valorTotal: 19800.00, status: 'pendente' },
  { id: 'P-1009', cliente: 'Moda Sul', data: '2025-08-27', valorTotal: 4310.90, status: 'aprovado' },
  { id: 'P-1010', cliente: 'Tramas Coloridas', data: '2025-08-27', valorTotal: 13290.00, status: 'pendente' },
  { id: 'P-1011', cliente: 'Linha Prime', data: '2025-08-28', valorTotal: 9580.40, status: 'pendente' },
  { id: 'P-1012', cliente: 'TexFina', data: '2025-08-28', valorTotal: 16040.20, status: 'reprovado' }
];
