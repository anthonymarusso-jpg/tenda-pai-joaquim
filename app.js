'use strict';
(() => {
const KEY = 'tenda-pai-joaquim-v2';
const OLD_KEY = 'tenda-pai-joaquim-v1';
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const ym = d => d.getFullYear() + '-' + pad(d.getMonth() + 1);
const today = () => ymd(new Date());
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
const parse = s => { const a = s.split('-').map(Number); return new Date(a[0], a[1] - 1, a[2] || 1); };
const brl = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const MES_L = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const MES_S = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DIA_S = ['dom','seg','ter','qua','qui','sex','sáb'];
const DIA_L = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const CARGOS = ['Pai de santo','Mãe de santo','Pai pequeno','Mãe pequena','Ogã','Cambone','Médium','Médium em desenvolvimento','Aprendiz','Frequentador'];
const CAT_IN = ['Mensalidade','Doação','Cantina / bazar','Festa / evento','Outros'];
const CAT_OUT = ['Material de culto','Velas e ervas','Contas (água, luz)','Aluguel','Manutenção','Festa / evento','Outros'];
const CAT_EST = ['Velas','Ervas e banhos','Defumação','Pemba e giz','Bebidas e fumo','Flores e frutas','Limpeza','Outros'];

/* Linhas de trabalho: cor da conta (guia) usada nas giras e nos pontos */
const LINHAS = {
  caboclo:   { nome: 'Caboclos',            gira: 'Gira de Caboclos',            cores: ['#2f8f46'] },
  pretovelho:{ nome: 'Pretos-Velhos',       gira: 'Gira de Pretos-Velhos',       cores: ['#222222', '#ffffff'] },
  boiadeiro: { nome: 'Boiadeiros',          gira: 'Gira de Boiadeiros',          cores: ['#8a5a2b'] },
  crianca:   { nome: 'Crianças (Erês)',     gira: 'Gira de Crianças',            cores: ['#f08cbc', '#6fb6ea'] },
  marinheiro:{ nome: 'Marinheiros',         gira: 'Gira de Marinheiros',         cores: ['#1f63a8', '#ffffff'] },
  baiano:    { nome: 'Baianos',             gira: 'Gira de Baianos',             cores: ['#f2c12e'] },
  cigano:    { nome: 'Ciganos',             gira: 'Gira de Ciganos',             cores: ['#7b3fa0', '#f2c12e'] },
  exu:       { nome: 'Exus e Pombagiras',   gira: 'Gira de Exu',                 cores: ['#c8302a', '#111111'] },
  pombagira: { nome: 'Pombagiras',          gira: 'Gira de Pombagira',           cores: ['#c8302a', '#111111'] },
  malandro:  { nome: 'Malandros',           gira: 'Gira de Malandros',           cores: ['#ffffff', '#c8302a'] },
  orixas:    { nome: 'Orixás',              gira: 'Gira de Orixás',              cores: ['#ffffff', '#d9a400'] },
  desenv:    { nome: 'Desenvolvimento',     gira: 'Desenvolvimento mediúnico',   cores: ['#1a3a9c'] },
  festa:     { nome: 'Festa / Obrigação',   gira: 'Festa',                       cores: ['#d9a400'] },
  outros:    { nome: 'Faxina / Reunião',    gira: 'Reunião da casa',             cores: ['#9aa3b5'] }
};
/* Imagem da gira: primeiro pelo nome escrito (Gira de Ogum, Gira de Caboclo…), senão pela linha escolhida */
const IMG_LINHA = { caboclo: 'caboclo', pretovelho: 'pretovelho', boiadeiro: 'boiadeiro', crianca: 'crianca', marinheiro: 'marinheiro', baiano: 'baiano', cigano: 'cigano', exu: 'exu', pombagira: 'pombagira', malandro: 'malandro', orixas: 'oxala', desenv: 'caboclo', festa: 'oxala' };
const IMG_NOME = [[/malandr/, 'malandro'], [/pomba/, 'pombagira'], [/exu/, 'exu'], [/cabocl/, 'caboclo'], [/pret[oa]s?[- ]?velh|almas/, 'pretovelho'], [/boiadeir/, 'boiadeiro'], [/crianc|eres?\b|ibeji|cosme/, 'crianca'], [/marinheir|maruj/, 'marinheiro'], [/baian/, 'baiano'], [/cigan/, 'cigano'], [/oxala/, 'oxala'], [/iemanja|yemanja/, 'iemanja'], [/oxum/, 'oxum'], [/ogum/, 'ogum'], [/oxoss/, 'oxossi'], [/xango/, 'xango'], [/iansa|oya/, 'iansa'], [/nana\b/, 'nana'], [/omulu|obalua/, 'omulu']];
const giraImg = e => { const t = semAcento(e.titulo); const hit = IMG_NOME.find(([r]) => r.test(t)); return hit ? hit[1] : IMG_LINHA[e.linha] || ''; };
const semAcento = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const ehFesta = e => e.linha === 'festa' || /festa|obrigac|dia de |dia dos |dia das |aniversario|natal/.test(semAcento(e.titulo));
const festaKey = quem => { const t = semAcento(quem); const hit = IMG_NOME.find(([r]) => r.test(t)); return hit ? hit[1] : 'oxala'; };
const banImg = (k, f) => k ? `<img class="ban" src="ban/${k}${f ? '-f' : ''}.jpg" alt="" aria-hidden="true" loading="lazy">` : '';
const fotoBg = (k, cls) => k ? `<img class="${cls}" src="img/${k}.jpg" alt="" aria-hidden="true">` : '';
const contas = (cores, cls) => cores.map(c => `<i class="conta ${cls || ''}" style="background:${c}"></i>`).join('');
const linhaChip = k => { const l = LINHAS[k] || LINHAS.outros; return `<em class="chip">${contas(l.cores)}${esc(l.nome)}</em>`; };

/* Orixá regente do dia — tradição mais comum; cada casa tem seus fundamentos */
const DIAS_ORIXA = [
  { quem: 'Ibeji e as Crianças', saud: 'Oni Beijada!', cores: ['#f08cbc', '#6fb6ea'], linha: 'Crianças (Erês)', img: 'crianca' },
  { quem: 'Exu, Omulu e as Almas', saud: 'Atotô, Obaluaiê!', cores: ['#111111', '#ffffff', '#c8302a'], linha: 'Pretos-Velhos e Almas', img: 'pretovelho' },
  { quem: 'Ogum', saud: 'Ogunhê, meu Pai!', cores: ['#c8302a', '#1f3f8f'], linha: 'Ogum, o guerreiro', img: 'ogum' },
  { quem: 'Xangô e Iansã', saud: 'Kaô Kabecilê!', cores: ['#8a5a2b', '#f2c12e'], linha: 'Xangô, a justiça', img: 'xango' },
  { quem: 'Oxóssi', saud: 'Okê Arô!', cores: ['#2f8f46'], linha: 'Caboclos e Oxóssi', img: 'caboclo' },
  { quem: 'Oxalá', saud: 'Epa Babá!', cores: ['#ffffff'], linha: 'Oxalá, a fé', img: 'oxala' },
  { quem: 'Iemanjá, Oxum e Nanã', saud: 'Odoyá! Ora yê yê ô!', cores: ['#6fb6ea', '#f2c12e', '#9a7bc8'], linha: 'Povo d’Água: Iemanjá e Marinheiros', img: 'iemanja' }
];
const ORIXAS = [
  { n: 'Oxalá', s: 'Epa Babá!', cores: ['#ffffff'], cor: 'Branco', dia: 'Sexta-feira', dom: 'A fé, a paz e a criação', sinc: 'Jesus Cristo (Senhor do Bonfim)' },
  { n: 'Iemanjá', s: 'Odoyá!', cores: ['#6fb6ea', '#ffffff'], cor: 'Azul-claro e branco', dia: 'Sábado', dom: 'O mar, a maternidade e a família', sinc: 'Nossa Senhora dos Navegantes' },
  { n: 'Oxum', s: 'Ora yê yê ô!', cores: ['#f2c12e'], cor: 'Amarelo e dourado', dia: 'Sábado', dom: 'As cachoeiras, o amor e a fertilidade', sinc: 'Nossa Senhora Aparecida' },
  { n: 'Ogum', s: 'Ogunhê!', cores: ['#c8302a', '#1f3f8f'], cor: 'Vermelho e azul-escuro', dia: 'Terça-feira', dom: 'As demandas, os caminhos e a lei', sinc: 'São Jorge' },
  { n: 'Oxóssi', s: 'Okê Arô!', cores: ['#2f8f46'], cor: 'Verde', dia: 'Quinta-feira', dom: 'As matas, a fartura e o conhecimento', sinc: 'São Sebastião' },
  { n: 'Xangô', s: 'Kaô Kabecilê!', cores: ['#8a5a2b', '#ffffff'], cor: 'Marrom', dia: 'Quarta-feira', dom: 'As pedreiras e a justiça', sinc: 'São Jerônimo' },
  { n: 'Iansã', s: 'Eparrey, Oyá!', cores: ['#f2c12e', '#e0603a'], cor: 'Amarelo e coral', dia: 'Quarta-feira', dom: 'Os ventos, os raios e as tempestades', sinc: 'Santa Bárbara' },
  { n: 'Nanã', s: 'Saluba, Nanã!', cores: ['#9a7bc8'], cor: 'Lilás', dia: 'Sábado', dom: 'A lama, a sabedoria dos mais velhos', sinc: 'Sant’Ana' },
  { n: 'Omulu / Obaluaiê', s: 'Atotô!', cores: ['#111111', '#ffffff'], cor: 'Preto e branco', dia: 'Segunda-feira', dom: 'A cura, a terra e a passagem', sinc: 'São Lázaro e São Roque' },
  { n: 'Ibeji', s: 'Oni Beijada!', cores: ['#f08cbc', '#6fb6ea'], cor: 'Rosa e azul-claro', dia: 'Domingo', dom: 'A alegria e a pureza das crianças', sinc: 'São Cosme e São Damião' }
];
/* Datas festivas mais comuns no calendário umbandista (mês-dia) */
const FESTAS = [
  ['01-20', 'Oxóssi', 'Dia de São Sebastião'], ['02-02', 'Iemanjá', 'Festa de Iemanjá'], ['04-23', 'Ogum', 'Dia de São Jorge'],
  ['05-13', 'Pretos-Velhos', 'Dia dos Pretos-Velhos'], ['07-26', 'Nanã', 'Dia de Sant’Ana'], ['08-16', 'Omulu / Obaluaiê', 'Dia de São Roque'],
  ['09-27', 'Ibeji e Erês', 'Cosme e Damião'], ['09-30', 'Xangô', 'Dia de São Jerônimo'], ['10-12', 'Oxum', 'Nossa Senhora Aparecida'],
  ['11-15', 'Umbanda', 'Dia Nacional da Umbanda'], ['12-04', 'Iansã', 'Dia de Santa Bárbara'], ['12-08', 'Iemanjá e Oxum', 'Nossa Senhora da Conceição'],
  ['12-25', 'Oxalá', 'Natal']
];

const P = {
  home: '<path d="M3 11.5 12 3l9 8.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6"/><circle cx="17.2" cy="9" r="2.4"/><path d="M17.5 14.2c2.4.1 4.1 1.7 4.1 4.3"/>',
  vela: '<path d="M9 10h6v11H9z"/><path d="M12 10V8"/><path d="M12 2.5c1.6 1.6 2 2.9 2 3.6a2 2 0 0 1-4 0c0-.7.4-2 2-3.6z"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 12h.01M18 12h.01"/>',
  dots: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  mega: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>',
  nota: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  estrela: '<path d="M12 2.5 14.6 9H21l-5.2 4 2 6.6L12 15.7 6.2 19.6l2-6.6L3 9h6.4z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  left: '<path d="m14.5 5-7 7 7 7"/>',
  right: '<path d="m9.5 5 7 7-7 7"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="m16 6-4-4-4 4M12 2v13"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  fila: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  bolo: '<path d="M4 21h16v-8H4z"/><path d="M4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0"/><path d="M12 13V9M12 6.5c.9-.8 1-1.6.4-2.6-.9 1-1.3 1.8-.4 2.6z"/>'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
/* Ponto riscado da Tenda: sabres cruzados, raios e bandeira (desenho a giz) */
const RISCADO = cls => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22C34 26 60 48 78 76"/><path d="M86 22C66 26 40 48 22 76"/><path d="M72 80l12-7M78 76l6 11"/><path d="M28 80 16 73M22 76l-6 11"/><path d="M8 36l7 14-5 0 6 15"/><path d="M92 36l-7 14 5 0-6 15"/><path d="M50 8v66"/><path d="M50 9c6-3 12-2 17 1v13c-5-3-11-4-17-1"/><circle cx="50" cy="88" r="4"/></g></svg>`;

/* ---------- dados ---------- */
const END_PADRAO = 'Rua Pedro Álvares Cabral, 235 – Santa Luzia, Ribeirão Pires';
function casaPadrao() {
  return { nome: 'Tenda de Umbanda Pai Joaquim de Angola e Manezinho Boiadeiro', dirigente: '', endereco: END_PADRAO, pix: '', mensal: 60, venc: 10 };
}
function seed() {
  const m = ym(new Date()), dd = new Date().getDate();
  const day = n => m + '-' + pad(Math.max(1, Math.min(n, dd)));
  const mes = new Date().getMonth() + 1;
  const members = [
    { id: 'm1', nome: 'Marcos Almeida', cargo: 'Pai pequeno', entidades: 'Boiadeiro Laço de Ouro', orixa: 'Xangô', tel: '', nasc: '1979-' + pad(mes) + '-' + pad(Math.min(dd + 6, 28)), entrada: '2012-03-10', mensal: 80, ativo: true, obs: '' },
    { id: 'm2', nome: 'Luciana Prado', cargo: 'Médium', entidades: 'Cabocla Jurema', orixa: 'Oxum', tel: '', nasc: '1988-02-14', entrada: '2018-08-04', mensal: 60, ativo: true, obs: '' },
    { id: 'm3', nome: 'Rafael Souza', cargo: 'Ogã', entidades: '', orixa: 'Ogum', tel: '', nasc: '1995-' + pad(mes) + '-' + pad(Math.max(1, dd - 3)), entrada: '2020-01-20', mensal: 60, ativo: true, obs: 'Atabaque principal' },
    { id: 'm4', nome: 'Cida Ferreira', cargo: 'Cambone', entidades: 'Vovó Maria Conga', orixa: 'Nanã', tel: '', nasc: '1962-07-26', entrada: '2009-05-13', mensal: 50, ativo: true, obs: '' },
    { id: 'm5', nome: 'Tereza Lima', cargo: 'Médium', entidades: 'Marinheiro Martim Pescador', orixa: 'Iemanjá', tel: '', nasc: '1984-12-08', entrada: '2016-02-02', mensal: 60, ativo: true, obs: '' },
    { id: 'm6', nome: 'João Pedro Nunes', cargo: 'Médium em desenvolvimento', entidades: '', orixa: 'Oxóssi', tel: '', nasc: '2001-01-20', entrada: '2025-04-23', mensal: 40, ativo: true, obs: '' }
  ];
  const tx = [
    { id: uid(), tipo: 'in', cat: 'Mensalidade', desc: 'Mensalidade · Marcos Almeida', valor: 80, data: day(2), mid: 'm1', mes: m },
    { id: uid(), tipo: 'in', cat: 'Mensalidade', desc: 'Mensalidade · Luciana Prado', valor: 60, data: day(3), mid: 'm2', mes: m },
    { id: uid(), tipo: 'in', cat: 'Mensalidade', desc: 'Mensalidade · Rafael Souza', valor: 60, data: day(4), mid: 'm3', mes: m },
    { id: uid(), tipo: 'in', cat: 'Doação', desc: 'Doações da gira de Caboclos', valor: 135, data: day(5), mid: '', mes: '' },
    { id: uid(), tipo: 'out', cat: 'Velas e ervas', desc: 'Velas de 7 dias e ervas', valor: 96, data: day(3), mid: '', mes: '' },
    { id: uid(), tipo: 'out', cat: 'Contas (água, luz)', desc: 'Conta de luz', valor: 210, data: day(6), mid: '', mes: '' }
  ];
  // meses anteriores para o gráfico
  for (let k = 1; k <= 5; k++) {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - k);
    const mm = ym(d);
    tx.push({ id: uid(), tipo: 'in', cat: 'Mensalidade', desc: 'Mensalidades do mês', valor: 300 + (k % 3) * 40, data: mm + '-10', mid: '', mes: '' });
    tx.push({ id: uid(), tipo: 'in', cat: 'Doação', desc: 'Doações das giras', valor: 90 + k * 15, data: mm + '-18', mid: '', mes: '' });
    tx.push({ id: uid(), tipo: 'out', cat: 'Contas (água, luz)', desc: 'Luz e água', valor: 230 + (k % 2) * 25, data: mm + '-12', mid: '', mes: '' });
    tx.push({ id: uid(), tipo: 'out', cat: 'Velas e ervas', desc: 'Material de culto', valor: 80 + k * 12, data: mm + '-20', mid: '', mes: '' });
  }
  const past = addDays(-4);
  const events = [
    { id: 'e1', linha: 'boiadeiro', titulo: 'Gira de Boiadeiros', data: addDays(3), hora: '20:00', local: 'Salão principal', obs: 'Roupa branca, guia e chapéu de couro para quem trabalha na linha.' },
    { id: 'e2', linha: 'pretovelho', titulo: 'Gira de Pretos-Velhos', data: addDays(10), hora: '20:00', local: 'Salão principal', obs: '' },
    { id: 'e3', linha: 'desenv', titulo: 'Desenvolvimento mediúnico', data: addDays(13), hora: '19:30', local: 'Salão principal', obs: 'Somente filhos da casa.' },
    { id: 'e4', linha: 'outros', titulo: 'Faxina e limpeza da tenda', data: addDays(17), hora: '09:00', local: 'Tenda', obs: 'Trazer pano, balde e ervas para lavar o congá.' },
    { id: 'e5', linha: 'caboclo', titulo: 'Gira de Caboclos', data: past, hora: '20:00', local: 'Salão principal', obs: '' }
  ];
  return {
    v: 2, demo: true, casa: casaPadrao(), members, tx, events,
    pres: { e5: ['m1', 'm2', 'm3', 'm4'] },
    fila: { e5: [
      { id: uid(), senha: 1, nome: 'Dona Lurdes', tel: '', obs: 'Passe e conversa com o Caboclo', status: 'feito' },
      { id: uid(), senha: 2, nome: 'Carlos', tel: '', obs: '', status: 'feito' },
      { id: uid(), senha: 3, nome: 'Ana Paula', tel: '', obs: 'Primeira vez na casa', status: 'feito' }
    ] },
    stock: [
      { id: uid(), item: 'Vela branca de 7 dias', cat: 'Velas', qtd: 12, min: 10, un: 'un' },
      { id: uid(), item: 'Vela azul', cat: 'Velas', qtd: 6, min: 10, un: 'un' },
      { id: uid(), item: 'Defumador de ervas', cat: 'Defumação', qtd: 3, min: 4, un: 'pct' },
      { id: uid(), item: 'Carvão para defumação', cat: 'Defumação', qtd: 2, min: 1, un: 'saco' },
      { id: uid(), item: 'Pemba branca', cat: 'Pemba e giz', qtd: 5, min: 2, un: 'un' },
      { id: uid(), item: 'Arruda e guiné', cat: 'Ervas e banhos', qtd: 1, min: 3, un: 'maço' },
      { id: uid(), item: 'Charuto', cat: 'Bebidas e fumo', qtd: 8, min: 6, un: 'un' },
      { id: uid(), item: 'Fósforos', cat: 'Outros', qtd: 6, min: 3, un: 'cx' }
    ],
    notices: [
      { id: uid(), titulo: 'Chegada nas giras', texto: 'Chegar 30 minutos antes, de roupa branca e com a guia.\nCelular no silencioso dentro do salão.', data: today() },
      { id: uid(), titulo: 'Mensalidade', texto: 'A mensalidade vence todo dia 10. Pode pagar com o Pai pequeno ou pelo PIX da casa.', data: addDays(-6) }
    ],
    pontos: [],
    pinHash: '', tema: 'auto'
  };
}
function valid(o) { return o && Array.isArray(o.members) && Array.isArray(o.tx) && Array.isArray(o.events) && Array.isArray(o.stock) && Array.isArray(o.notices); }
function normalize(o) {
  o.v = 2; o.pres = o.pres || {}; o.fila = o.fila || {}; o.pontos = o.pontos || []; o.casa = Object.assign(casaPadrao(), o.casa || {});
  if (!o.casa.endereco) o.casa.endereco = END_PADRAO; o.pinHash = o.pinHash || ''; o.tema = o.tema || 'auto';
  o.members.forEach(x => { if (x.entidade && !x.entidades) x.entidades = x.entidade; x.entidades = x.entidades || ''; if (!Array.isArray(x.orixas)) x.orixas = x.orixa ? [{ n: x.orixa, p: 'De cabeça (1º)' }] : []; if (!Array.isArray(x.guias)) x.guias = x.entidades.split(',').map(z => z.trim()).filter(Boolean).map(n => ({ l: guessLinha(n), n, el: [] })); x.nasc = x.nasc || ''; x.entrada = x.entrada || ''; x.obs = x.obs || ''; });
  o.events.forEach(e => { if (!e.linha) e.linha = guessLinha(e.tipo || e.titulo || ''); });
  o.stock.forEach(i => { i.cat = i.cat || 'Outros'; });
  return o;
}
function guessLinha(t) {
  t = t.toLowerCase();
  if (t.includes('cabocl')) return 'caboclo'; if (t.includes('preto') || t.includes('vov') || t.includes('vô ') || t.includes('tia ') || t.includes('pai ')) return 'pretovelho'; if (t.includes('boiadeiro')) return 'boiadeiro';
  if (t.includes('crian') || t.includes('erê')) return 'crianca'; if (t.includes('marinheiro')) return 'marinheiro'; if (t.includes('baian')) return 'baiano';
  if (t.includes('malandr')) return 'malandro'; if (t.includes('pomba')) return 'pombagira'; if (t.includes('exu')) return 'exu'; if (t.includes('cigan')) return 'cigano'; if (t.includes('desenv')) return 'desenv';
  if (t.includes('festa') || t.includes('obriga')) return 'festa'; return 'outros';
}
function load() {
  try { const r = localStorage.getItem(KEY); if (r) { const o = JSON.parse(r); if (valid(o)) return normalize(o); } } catch (e) {}
  try { const r = localStorage.getItem(OLD_KEY); if (r) { const o = JSON.parse(r); if (valid(o)) return normalize(o); } } catch (e) {}
  return normalize(seed());
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Não consegui salvar. Libere espaço no celular.'); } }
const UI = { tab: 'home', sub: 'menu', filter: 'todos', q: '', gv: 'prox', cm: ym(new Date()), pq: '', evTab: 'fila', unlocked: false, oxTab: 'orixas' };

/* ---------- helpers ---------- */
const byId = (list, id) => list.find(x => x.id === id) || null;
const paid = (mid, m) => S.tx.some(t => t.tipo === 'in' && t.mid === mid && t.mes === m);
const due = m => S.members.filter(x => x.ativo && x.mensal > 0 && !paid(x.id, m));
function totals(m) { let i = 0, o = 0; S.tx.forEach(t => { if ((t.data || '').slice(0, 7) === m) { if (t.tipo === 'in') i += t.valor; else o += t.valor; } }); return { i, o, s: i - o }; }
const sortEv = (a, b) => (a.data + (a.hora || '')).localeCompare(b.data + (b.hora || ''));
const nextEvents = () => S.events.filter(e => e.data >= today()).sort(sortEv);
const pastEvents = () => S.events.filter(e => e.data < today()).sort((a, b) => sortEv(b, a));
function initials(n) { const p = String(n).trim().split(/\s+/); return ((p[0] || '')[0] || '?').toUpperCase() + ((p.length > 1 ? p[p.length - 1][0] : '') || '').toUpperCase(); }
const mesLabel = m => { const a = m.split('-'); return MES_L[Number(a[1]) - 1] + ' de ' + a[0]; };
const shortDate = s => { const a = s.split('-'); return a[2] + '/' + a[1]; };
const fmtLong = s => { const d = parse(s); return DIA_S[d.getDay()] + ', ' + d.getDate() + ' de ' + MES_L[d.getMonth()]; };
const fmtBR = s => { if (!s) return '—'; const a = s.split('-'); return a[2] + '/' + a[1] + '/' + a[0]; };
function daysUntil(s) { const a = parse(today()), b = parse(s); return Math.round((b - a) / 864e5); }
function quando(s) { const n = daysUntil(s); return n === 0 ? 'Hoje' : n === 1 ? 'Amanhã' : n > 1 ? 'Em ' + n + ' dias' : (n === -1 ? 'Ontem' : 'Há ' + (-n) + ' dias'); }
const opts = (list, sel) => list.map(o => `<option${o === sel ? ' selected' : ''}>${esc(o)}</option>`).join('');
const linhaOpts = sel => Object.keys(LINHAS).map(k => `<option value="${k}"${k === sel ? ' selected' : ''}>${esc(LINHAS[k].nome)}</option>`).join('');
const telDigits = t => String(t || '').replace(/\D/g, '');
function waLink(tel, text) {
  let d = telDigits(tel); if (d && d.length <= 11) d = '55' + d;
  return 'https://wa.me/' + (d || '') + '?text=' + encodeURIComponent(text);
}
function addPayment(mid, m) { const x = byId(S.members, mid); if (!x) return null; const t = { id: uid(), tipo: 'in', cat: 'Mensalidade', desc: 'Mensalidade · ' + x.nome, valor: x.mensal, data: today(), mid, mes: m }; S.tx.push(t); return t; }
function anivMes() {
  const m = new Date().getMonth() + 1;
  return S.members.filter(x => x.ativo && x.nasc && Number(x.nasc.slice(5, 7)) === m).sort((a, b) => a.nasc.slice(8).localeCompare(b.nasc.slice(8)));
}
function proximasFestas(n) {
  const t = parse(today()), y = t.getFullYear();
  return FESTAS.map(f => { let d = parse(y + '-' + f[0]); if (d < t) d = parse((y + 1) + '-' + f[0]); return { d: ymd(d), quem: f[1], nome: f[2] }; })
    .sort((a, b) => a.d.localeCompare(b.d)).slice(0, n);
}
const casaCurta = () => S.casa.nome || 'Tenda de Umbanda';

/* ---------- interface básica ---------- */
let tt = null;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(tt); tt = setTimeout(() => { t.hidden = true; }, 2400); }
function sheet(title, body) { $('#sheetTitle').textContent = title; $('#sheetBody').innerHTML = body; $('#sheetWrap').hidden = false; $('#sheet').scrollTop = 0; if (!$('#sheetBody form')) animar($('#sheetBody')); }
function closeSheet() { $('#sheetWrap').hidden = true; $('#sheetBody').innerHTML = ''; }
const sheetOpen = () => !$('#sheetWrap').hidden;
const empty = (a, b) => `<div class="empty"><b>${esc(a)}</b>${esc(b)}</div>`;
const delBlock = (act, id, label, extra) => `<div class="stack" style="margin-top:14px"><div id="delask"><button type="button" class="btn danger block" data-act="del-ask">Excluir ${esc(label)}</button></div><div id="delbox" class="stack" hidden><p class="muted" style="margin:0">Excluir de vez? Não dá para desfazer.</p><div class="grid2"><button type="button" class="btn danger" data-act="${act}" data-id="${id}"${extra || ''}>Sim, excluir</button><button type="button" class="btn ghost" data-act="del-no">Cancelar</button></div></div></div>`;
async function share(text, title) {
  if (navigator.share) { try { await navigator.share({ title: title || casaCurta(), text }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  window.open(waLink('', text), '_blank', 'noopener');
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('Copiado'); } catch (e) { toast('Não consegui copiar.'); }
}

function applyTheme() { const r = document.documentElement; if (S.tema === 'claro') r.dataset.theme = 'light'; else if (S.tema === 'escuro') r.dataset.theme = 'dark'; else delete r.dataset.theme; }

function renderNav() {
  const items = [['home', 'home', 'Início'], ['filhos', 'users', 'Filhos'], ['giras', 'vela', 'Giras'], ['caixa', 'cash', 'Caixa'], ['mais', 'dots', 'Mais']];
  $('#nav').innerHTML = items.map(i => `<button class="tab" data-act="go" data-tab="${i[0]}" aria-current="${UI.tab === i[0] ? 'page' : 'false'}">${ic(i[1])}<span>${i[2]}</span></button>`).join('');
}
function render(keep) {
  const v = $('#view'), st = v.scrollTop;
  v.innerHTML = VIEWS[UI.tab]();
  renderNav();
  $('#casaNome').textContent = casaCurta().replace(/^Tenda de Umbanda\s*/i, '') || casaCurta();
  v.scrollTop = keep ? st : 0;
  if (!keep) animar(v);
}
/* Movimento de entrada: cada tipo de card tem o seu (CSS .anim), em cascata */
const calmo = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animar(root) {
  if (calmo()) return;
  const box = '.list, .galeria, .grid2, .stack, .els';
  let i = 0; const list = [];
  root.querySelectorAll(':scope > *, :scope .list > *, :scope .galeria > *, :scope .grid2 > *, :scope .stack > *').forEach(el => {
    if (el.matches(box) || el.matches('input, select, textarea, label, dl, p, small') && !el.matches('.card')) return;
    el.style.setProperty('--i', Math.min(i++, 14)); el.classList.add('anim'); list.push(el);
  });
  setTimeout(() => list.forEach(el => el.classList.remove('anim')), 2800);
}
const videoCard = () => `<button class="videocard" data-act="vid-open"><span class="th"><img src="video/capa.jpg" alt="" width="76" height="135" loading="lazy"><span class="pl"></span></span><span class="tx"><small>Vídeo da casa</small><strong>Orixás e Linhas de Umbanda</strong><span>Todos os orixás e guias com saudação, dia e cores.</span></span></button>`;
const demoBanner = () => S.demo ? '<div class="banner"><span>Estes são dados de exemplo. Apague quando for usar com a sua casa.</span><button class="btn" data-act="demo-ask">Limpar exemplos</button></div>' : '';

/* ---------- instalação ---------- */
let deferredPrompt = null;
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if (UI.tab === 'home') render(true); });
window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('App instalado. Abra pelo ícone da Tenda.'); render(true); });
function installBanner() {
  if (standalone()) return '';
  if (deferredPrompt) return '<div class="banner install"><span>Instale o app no celular para abrir pelo ícone, em tela cheia e sem internet.</span><button class="btn" data-act="install">Instalar</button></div>';
  if (isIOS()) return '<div class="banner install"><span>Para instalar no iPhone: toque em Compartilhar e depois em “Adicionar à Tela de Início”.</span></div>';
  return '<div class="banner install"><span>Para instalar: abra o menu do Chrome (⋮) e toque em “Instalar app” ou “Adicionar à tela inicial”.</span></div>';
}

/* ---------- telas ---------- */
const VIEWS = {
home() {
  const now = new Date(), m = ym(now), nx = nextEvents()[0], t = totals(m), pend = due(m);
  const low = S.stock.filter(i => i.qtd <= i.min), n = S.notices[0], dia = DIAS_ORIXA[now.getDay()];
  const aniv = anivMes(), festas = proximasFestas(2);
  const saudacao = `<section class="dia">${fotoBg(dia.img, 'foto')}<span class="eyebrow">${esc(DIA_L[now.getDay()])} · dia de ${esc(dia.quem)}</span><span class="saud">${esc(dia.saud)}</span><span class="linhadia">Linha do dia: <b>${esc(dia.linha)}</b></span><p>Saravá, ${esc(S.casa.dirigente ? S.casa.dirigente.split(' ')[0] : 'filho de fé')}! Que o axé da casa siga firme.</p><span class="contas">${contas(dia.cores)}</span></section>`;
  const hero = heroHtml();
  const dueRows = pend.slice(0, 3).map(x => `<div class="row"><span class="av">${esc(initials(x.nome))}</span><span class="main"><strong>${esc(x.nome)}</strong><small class="num">${brl(x.mensal)}</small></span><button class="btn sm" data-act="receber" data-mid="${x.id}" data-m="${m}">Receber</button></div>`).join('');
  const anivRows = aniv.map(x => { const d = Number(x.nasc.slice(8)); const hoje = d === now.getDate(); return `<button class="row" data-act="member-open" data-id="${x.id}"><span class="av bday">${ic('bolo')}</span><span class="main"><strong>${esc(x.nome)}</strong><small>${hoje ? 'Faz aniversário hoje!' : 'Dia ' + d + ' de ' + MES_L[now.getMonth()]}</small></span>${hoje ? '<em class="chip gold">Hoje</em>' : ''}</button>`; }).join('');
  const festaRows = festas.map(f => { const d = parse(f.d); return `<div class="row festa comban">${banImg(festaKey(f.quem), true)}<span class="dt"><b>${d.getDate()}</b><i>${MES_S[d.getMonth()]}</i></span><span class="main"><strong>${esc(f.quem)}</strong><small>${esc(f.nome)} · ${esc(quando(f.d).toLowerCase())}</small></span></div>`; }).join('');
  return demoBanner() + installBanner() + saudacao + hero + videoCard() +
    `<div class="grid2">
      <button class="stat" data-act="go" data-tab="caixa"><span>Saldo de ${MES_L[now.getMonth()]}</span><b class="${t.s < 0 ? 'neg' : ''}">${brl(t.s)}</b></button>
      <button class="stat${pend.length ? ' alert' : ''}" data-act="go" data-tab="caixa"><span>Mensalidades em aberto</span><b>${pend.length}</b></button>
      <button class="stat${low.length ? ' alert' : ''}" data-act="mais-go" data-v="estoque"><span>Itens para repor</span><b>${low.length}</b></button>
      <button class="stat" data-act="go" data-tab="filhos"><span>Filhos na corrente</span><b>${S.members.filter(x => x.ativo).length}</b></button>
    </div>` +
    `<h3>Mensalidades em aberto</h3>` + (pend.length ? `<div class="list">${dueRows}${pend.length > 3 ? `<button class="btn ghost block" data-act="go" data-tab="caixa">Ver todas (${pend.length})</button>` : ''}</div>` : empty('Tudo em dia', 'Ninguém com mensalidade pendente neste mês.')) +
    (aniv.length ? `<h3>Aniversariantes do mês</h3><div class="list">${anivRows}</div>` : '') +
    `<h3>Datas festivas</h3><div class="list">${festaRows}</div>` +
    `<h3>Último aviso</h3>` + (n ? `<div class="card notice"><h4>${esc(n.titulo)}</h4><p>${esc(n.texto)}</p><div class="acts"><button class="btn sm" data-act="notice-share" data-id="${n.id}">${ic('share')}Enviar</button><button class="btn ghost sm" data-act="mais-go" data-v="mural">Ver mural</button></div></div>` : empty('Sem avisos', 'Publique um aviso no mural.'));
},
filhos() {
  return demoBanner() + `<div class="vh"><h2>Filhos da casa</h2><button class="btn sm" data-act="member-new">${ic('plus')}Novo</button></div>` +
    `<input id="q" class="inp" type="search" placeholder="Buscar nome, entidade ou orixá" aria-label="Buscar filho da casa" value="${esc(UI.q)}" autocomplete="off">` +
    `<div class="seg">${segBtns([['todos', 'Todos'], ['pend', 'Pendentes'], ['dia', 'Em dia']], UI.filter, 'ffilter')}</div>` +
    `<div class="list" id="flist">${filhosList()}</div>`;
},
giras() {
  const l = UI.gv === 'prox' ? nextEvents() : pastEvents();
  return demoBanner() + `<div class="vh"><h2>Giras e eventos</h2><button class="btn sm" data-act="ev-new">${ic('plus')}Nova</button></div>` +
    `<div class="seg">${segBtns([['prox', 'Próximas'], ['pass', 'Passadas']], UI.gv, 'gv')}</div>` +
    `<div class="list">${l.length ? l.map(evRow).join('') : empty(UI.gv === 'prox' ? 'Nenhuma gira marcada' : 'Nenhuma gira passada', 'Toque em Nova para cadastrar.')}</div>`;
},
caixa() {
  const m = UI.cm, t = totals(m), pend = due(m);
  const txs = S.tx.filter(x => (x.data || '').slice(0, 7) === m).sort((a, b) => b.data.localeCompare(a.data));
  return demoBanner() + `<div class="vh"><h2>Caixa da casa</h2></div>` +
    `<div class="mes"><button data-act="cm-prev" aria-label="Mês anterior">${ic('left')}</button><strong>${esc(mesLabel(m))}</strong><button data-act="cm-next" aria-label="Próximo mês">${ic('right')}</button></div>` +
    `<div class="sum"><div class="stat"><span>Entradas</span><b class="pos">${brl(t.i)}</b></div><div class="stat"><span>Saídas</span><b class="neg">${brl(t.o)}</b></div><div class="stat"><span>Saldo</span><b class="${t.s < 0 ? 'neg' : ''}">${brl(t.s)}</b></div></div>` +
    `<div class="grid2"><button class="btn" data-act="tx-new" data-t="in">${ic('plus')}Entrada</button><button class="btn ghost" data-act="tx-new" data-t="out">${ic('plus')}Saída</button></div>` +
    `<div class="card chart"><h3 style="margin:0 0 8px">Últimos 6 meses</h3>${chart6(m)}<div class="legend"><span><i style="background:var(--ok)"></i>Entradas</span><span><i style="background:var(--bad)"></i>Saídas</span></div></div>` +
    `<h3>Mensalidades pendentes (${pend.length})</h3>` +
    (pend.length ? `<div class="list">${pend.map(x => `<div class="row"><span class="av">${esc(initials(x.nome))}</span><span class="main"><strong>${esc(x.nome)}</strong><small class="num">${brl(x.mensal)}</small></span>${telDigits(x.tel).length >= 10 ? `<a class="iconbtn" href="${esc(waLink(x.tel, cobrancaTexto(x, m)))}" target="_blank" rel="noopener" aria-label="Lembrar ${esc(x.nome)} pelo WhatsApp">${ic('share')}</a>` : ''}<button class="btn sm" data-act="receber" data-mid="${x.id}" data-m="${m}">Receber</button></div>`).join('')}</div>` : empty('Tudo em dia', 'Todos os filhos ativos pagaram este mês.')) +
    `<h3>Lançamentos</h3>` + (txs.length ? `<div class="list">${txs.map(txRow).join('')}</div>` : empty('Nenhum lançamento', 'Registre uma entrada ou uma saída.')) +
    `<button class="btn ghost block" data-act="caixa-share">${ic('share')}Enviar resumo do mês</button>`;
},
mais() {
  if (UI.sub !== 'menu' && SUBS[UI.sub]) return SUBS[UI.sub]();
  return demoBanner() + `<div class="vh"><h2>Mais</h2></div><div class="list">` +
    menuRow('estoque', 'box', 'Estoque', 'Velas, ervas, defumação e lista de compras') +
    menuRow('mural', 'mega', 'Mural de avisos', 'Recados da casa para mandar no WhatsApp') +
    menuRow('pontos', 'nota', 'Pontos cantados', 'O caderno de pontos da casa, por linha') +
    menuRow('orixas', 'estrela', 'Orixás e linhas', 'Saudações, cores, comidas, ervas e datas festivas') +
    menuRow('ajustes', 'gear', 'Ajustes da casa', 'Nome, PIX, senha do app, tema e cópia de segurança') +
    `</div><p class="muted" style="margin:4px 2px">Tudo fica guardado neste celular. Faça a cópia de segurança de vez em quando, em Ajustes.</p>`;
}
};
const SUBS = {
estoque() {
  const low = S.stock.filter(i => i.qtd <= i.min);
  const cats = CAT_EST.filter(c => S.stock.some(i => i.cat === c)).concat([...new Set(S.stock.map(i => i.cat))].filter(c => !CAT_EST.includes(c)));
  return backBtn('Estoque') + `<div class="grid2"><button class="btn" data-act="stock-new">${ic('plus')}Novo item</button><button class="btn ghost" data-act="compras"${low.length ? '' : ' disabled'}>${ic('share')}Lista de compras</button></div>` +
    (S.stock.length ? cats.map(c => `<h3>${esc(c)}</h3><div class="list">${S.stock.filter(i => i.cat === c).map(i => {
      const isLow = i.qtd <= i.min;
      return `<div class="row"><button class="tap" data-act="stock-open" data-id="${i.id}"><strong>${esc(i.item)}</strong><small class="muted">mínimo ${i.min} ${esc(i.un)}</small>${isLow ? '<em class="chip bad" style="align-self:flex-start;margin-top:3px">Repor</em>' : ''}</button><span class="step"><button data-act="stock-dec" data-id="${i.id}" aria-label="Diminuir ${esc(i.item)}">−</button><output>${i.qtd}</output><button data-act="stock-inc" data-id="${i.id}" aria-label="Aumentar ${esc(i.item)}">+</button></span></div>`;
    }).join('')}</div>`).join('') : empty('Estoque vazio', 'Cadastre velas, ervas, defumador e o que a casa usa.'));
},
mural() {
  return backBtn('Mural de avisos') + `<button class="btn" data-act="notice-new">${ic('plus')}Novo aviso</button>` +
    (S.notices.length ? S.notices.map(n => `<div class="card notice"><h4>${esc(n.titulo)}</h4><small class="muted">${shortDate(n.data)}</small><p>${esc(n.texto)}</p><div class="acts"><button class="btn sm" data-act="notice-share" data-id="${n.id}">${ic('share')}Enviar no WhatsApp</button><button class="btn ghost sm" data-act="notice-open" data-id="${n.id}">Editar</button></div></div>`).join('') : empty('Sem avisos', 'Escreva o primeiro recado da casa.'));
},
pontos() {
  const q = UI.pq.trim().toLowerCase();
  const l = S.pontos.filter(p => !q || (p.titulo + ' ' + p.letra + ' ' + (LINHAS[p.linha] || {}).nome).toLowerCase().includes(q));
  const keys = Object.keys(LINHAS).filter(k => l.some(p => p.linha === k));
  return backBtn('Pontos cantados') + `<p class="sub">Escreva aqui os pontos que a casa canta, para os filhos aprenderem.</p><button class="btn" data-act="ponto-new">${ic('plus')}Novo ponto</button>` +
    (S.pontos.length ? `<input id="pq" class="inp" type="search" placeholder="Buscar ponto" aria-label="Buscar ponto" value="${esc(UI.pq)}" autocomplete="off">` : '') +
    (l.length ? keys.map(k => `<h3>${esc(LINHAS[k].nome)}</h3><div class="list">${l.filter(p => p.linha === k).map(p => `<button class="row" data-act="ponto-open" data-id="${p.id}"><span class="av">${ic('nota')}</span><span class="main"><strong>${esc(p.titulo)}</strong><small>${esc((p.letra || '').split('\n')[0])}</small></span>${ic('right')}</button>`).join('')}</div>`).join('')
      : empty(S.pontos.length ? 'Nenhum ponto encontrado' : 'Caderno vazio', S.pontos.length ? 'Tente outra palavra.' : 'Toque em Novo ponto e escreva a letra como a casa canta.'));
},
orixas() {
  const fest = proximasFestas(FESTAS.length), t = UI.oxTab;
  const card = (o, tipo) => `<button class="oxcard" data-act="ficha" data-tipo="${tipo}" data-k="${o.k}"><img class="estampa" src="img/${o.k}.jpg" alt="" width="300" height="450" loading="lazy"><strong>${esc(o.n)}</strong><span class="s">${esc(o.s)}</span><small>${esc(o.dia)}</small></button>`;
  let body;
  if (t === 'linhas') body = `<div class="galeria">${AXE.LINHAS.map(o => card(o, 'l')).join('')}</div>`;
  else if (t === 'festas') body = `<div class="list">${fest.map(f => { const d = parse(f.d); return `<div class="row festa comban">${banImg(festaKey(f.quem), true)}<span class="dt"><b>${d.getDate()}</b><i>${MES_S[d.getMonth()]}</i></span><span class="main"><strong>${esc(f.quem)}</strong><small>${esc(f.nome)} · ${esc(quando(f.d).toLowerCase())}</small></span></div>`; }).join('')}</div>`;
  else body = `<div class="galeria">${AXE.ORIXAS.map(o => card(o, 'o')).join('')}</div>`;
  return backBtn('Orixás e linhas') + videoCard() + `<div class="seg">${segBtns([['orixas', 'Orixás'], ['linhas', 'Linhas'], ['festas', 'Festas']], t, 'oxtab')}</div>` + body +
    `<p class="muted nota">Segue a tradição mais comum na Umbanda. Saudações, dias, comidas e ervas mudam de casa para casa: os fundamentos do seu pai ou mãe de santo vêm primeiro.</p>`;
},
ajustes() {
  const c = S.casa;
  return backBtn('Ajustes da casa') +
    `<form class="form card" data-form="casa"><h3 style="margin:0">A casa</h3>
      <label>Nome da casa<input class="inp" id="c-nome" name="nome" value="${esc(c.nome)}" required></label>
      <label>Dirigente (pai ou mãe de santo)<input class="inp" id="c-dir" name="dirigente" value="${esc(c.dirigente)}"></label>
      <label>Endereço<input class="inp" id="c-end" name="endereco" value="${esc(c.endereco)}"></label>
      <label>Chave PIX da casa<input class="inp" id="c-pix" name="pix" value="${esc(c.pix)}"><span class="hint">Vai junto nas cobranças de mensalidade pelo WhatsApp.</span></label>
      <div class="row2"><label>Mensalidade padrão (R$)<input class="inp" id="c-men" name="mensal" type="number" min="0" step="1" inputmode="decimal" value="${esc(c.mensal)}"></label><label>Vence no dia<input class="inp" id="c-venc" name="venc" type="number" min="1" max="28" inputmode="numeric" value="${esc(c.venc)}"></label></div>
      <button class="btn block" type="submit">Salvar dados da casa</button></form>` +
    `<div class="card stack"><h3 style="margin:0">Aparência</h3><div class="seg">${segBtns([['auto', 'Automático'], ['claro', 'Claro'], ['escuro', 'Escuro']], S.tema, 'tema')}</div></div>` +
    `<div class="card stack"><h3 style="margin:0">Senha do app</h3><p style="margin:0" class="muted">${S.pinHash ? 'O app pede uma senha de 4 números ao abrir.' : 'Proteja o caixa e os dados dos filhos com uma senha de 4 números.'}</p>${S.pinHash ? '<div class="grid2"><button class="btn ghost" data-act="pin-set">Trocar senha</button><button class="btn danger" data-act="pin-off">Tirar senha</button></div>' : '<button class="btn" data-act="pin-set">Criar senha</button>'}</div>` +
    `<div class="card stack"><h3 style="margin:0">Cópia de segurança</h3><p style="margin:0" class="muted">Os dados ficam só neste celular. Salve uma cópia e guarde no Drive ou mande para você no WhatsApp. Use a mesma cópia para passar tudo para outro celular.</p><div class="grid2"><button class="btn" data-act="bk-export">Salvar cópia</button><label class="btn ghost" for="bkfile">Restaurar cópia</label></div><input id="bkfile" type="file" accept="application/json,.json" hidden></div>` +
    `<div class="card stack"><h3 style="margin:0">Recomeçar</h3>${S.demo ? '<button class="btn danger block" data-act="demo-ask">Apagar os dados de exemplo</button>' : '<button class="btn danger block" data-act="seed-ask">Apagar tudo e ver os exemplos</button>'}</div>` +
    `<p class="muted" style="text-align:center;margin:4px 0 0">${esc(casaCurta())}<br>versão 2.11</p>`;
}
};
const menuRow = (v, i, a, b) => `<button class="row" data-act="mais-go" data-v="${v}"><span class="av">${ic(i)}</span><span class="main"><strong>${a}</strong><small>${b}</small></span>${ic('right')}</button>`;
const segBtns = (list, cur, act) => list.map(i => `<button type="button" data-act="${act}" data-v="${i[0]}" aria-pressed="${cur === i[0]}">${i[1]}</button>`).join('');
const backBtn = t => `<div class="vh"><h2>${t}</h2><button class="btn ghost sm" data-act="mais-go" data-v="menu">${ic('left')}Voltar</button></div>`;

function filhosList() {
  const q = UI.q.trim().toLowerCase(), m = ym(new Date());
  const l = S.members.filter(x => {
    const hay = (x.nome + ' ' + x.entidades + ' ' + (x.orixas || []).map(o => o.n).join(' ') + ' ' + x.orixa + ' ' + x.cargo).toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (UI.filter === 'pend') return x.ativo && x.mensal > 0 && !paid(x.id, m);
    if (UI.filter === 'dia') return x.ativo && (x.mensal <= 0 || paid(x.id, m));
    return true;
  }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  if (!l.length) return empty('Ninguém por aqui', 'Ajuste a busca ou cadastre um filho da casa.');
  return l.map(x => {
    const chip = !x.ativo ? '<em class="chip mute">Afastado</em>' : (x.mensal <= 0 ? '' : (paid(x.id, m) ? '<em class="chip ok">Em dia</em>' : '<em class="chip warn">Pendente</em>'));
    const sub = [x.cargo, x.entidades, cabeca(x) ? 'Orixá ' + cabeca(x) : ''].filter(Boolean).join(' · ');
    return `<button class="row" data-act="member-open" data-id="${x.id}">${avatar(x, 58)}<span class="main"><strong>${esc(x.nome)}</strong><small>${esc(sub)}</small></span>${chip}</button>`;
  }).join('');
}
function evRow(e) {
  const d = parse(e.data), past = e.data < today(), cnt = (S.pres[e.id] || []).length, at = (S.fila[e.id] || []).length;
  const gi = giraImg(e), fe = ehFesta(e);
  return `<button class="row evrow${gi ? ' comfoto' : ''}${fe ? ' ehfesta' : ''}${past ? ' passada' : ''}" style="--ac:${(LINHAS[e.linha] || LINHAS.outros).cores[0]}" data-act="ev-open" data-id="${e.id}">${banImg(gi, fe)}<span class="dt"><b>${d.getDate()}</b><i>${MES_S[d.getMonth()]}</i></span><span class="evm"><strong>${esc(e.titulo)}</strong><small>${DIA_S[d.getDay()]} · ${esc(e.hora || '')}${past ? '' : ' · ' + esc(quando(e.data).toLowerCase())}</small>${linhaChip(e.linha)}${fe && e.linha !== 'festa' ? '<em class="chip gold">Festa</em>' : ''}</span>${past ? `<span class="cnt">${at || cnt}<small>${at ? 'atendidos' : 'presentes'}</small></span>` : ''}</button>`;
}
function txRow(t) {
  const inn = t.tipo === 'in';
  return `<button class="row tx" data-act="tx-open" data-id="${t.id}"><span class="sgn ${inn ? 'in' : 'out'}" aria-hidden="true">${inn ? '+' : '−'}</span><span class="main"><strong>${esc(t.desc || t.cat)}</strong><small>${esc(t.cat)} · ${shortDate(t.data)}</small></span><span class="val ${inn ? 'pos' : 'neg'}">${inn ? '+ ' : '− '}${brl(t.valor)}</span></button>`;
}
function chart6(m) {
  const a = m.split('-').map(Number), months = [];
  for (let k = 5; k >= 0; k--) { const d = new Date(a[0], a[1] - 1 - k, 1); months.push(ym(d)); }
  const data = months.map(mm => totals(mm)), max = Math.max(1, ...data.map(d => Math.max(d.i, d.o)));
  const W = 330, H = 150, top = 14, base = 122, L = 40, gw = (W - L) / 6, bw = 14;
  const scale = v => (base - top) * v / max;
  let g = '';
  [0.5, 1].forEach(f => { const y = base - (base - top) * f; g += `<line x1="${L}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 6}" y="${y + 4}" text-anchor="end">${esc(Math.round(max * f).toLocaleString('pt-BR'))}</text>`; });
  data.forEach((d, i) => {
    const cx = L + gw * i + gw / 2, hi = scale(d.i), ho = scale(d.o), cur = months[i] === m;
    g += `<rect x="${cx - bw - 1}" y="${base - hi}" width="${bw}" height="${Math.max(hi, 0)}" rx="3" fill="var(--ok)" opacity="${cur ? 1 : .55}"/>`;
    g += `<rect x="${cx + 1}" y="${base - ho}" width="${bw}" height="${Math.max(ho, 0)}" rx="3" fill="var(--bad)" opacity="${cur ? 1 : .55}"/>`;
    g += `<text x="${cx}" y="${base + 16}" text-anchor="middle"${cur ? ' style="font-weight:800;fill:var(--fg)"' : ''}>${MES_S[Number(months[i].slice(5)) - 1]}</text>`;
  });
  g += `<line x1="${L}" x2="${W}" y1="${base}" y2="${base}" stroke="var(--line)"/><text x="${L - 6}" y="${base + 4}" text-anchor="end">0</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Entradas e saídas dos últimos seis meses">${g}</svg>`;
}
function cobrancaTexto(x, m) {
  const pix = S.casa.pix ? `\nPIX da casa: ${S.casa.pix}` : '';
  return `Saravá, ${x.nome.split(' ')[0]}! Passando para lembrar da mensalidade de ${mesLabel(m)} da ${casaCurta()}: ${brl(x.mensal)}.${pix}\nAxé!`;
}
function reciboTexto(x, t) {
  return `Saravá, ${x.nome.split(' ')[0]}! Recebemos a sua mensalidade de ${mesLabel(t.mes || t.data.slice(0, 7))}: ${brl(t.valor)}, em ${fmtBR(t.data)}.\nObrigado por manter a casa de pé. Axé!\n${casaCurta()}`;
}
function giraTexto(e) {
  return `*${casaCurta()}*\n\n*${e.titulo}*\n📅 ${diaExtenso(e.data)}\n🕗 Início às ${e.hora || '20:00'}\n📍 ${enderecoGira(e)}${e.obs ? '\n\n' + e.obs : ''}\n\nSaravá!`;
}

/* ---------- banner da próxima gira: passa para a próxima / volta, e compartilha o convite ---------- */
function heroHtml(dir) {
  const l = nextEvents();
  if (!l.length) return `<section class="hero">${RISCADO('riscado')}<span class="lbl">Próxima gira</span><strong>Nenhuma gira marcada</strong><p>Marque a próxima gira para avisar a corrente.</p><div class="acts"><button class="btn sm" data-act="ev-new">Marcar gira</button></div></section>`;
  UI.heroIdx = Math.max(0, Math.min(UI.heroIdx || 0, l.length - 1));
  const i = UI.heroIdx, nx = l[i], gi = giraImg(nx), fe = ehFesta(nx);
  const lbl = i === 0 ? (fe ? 'Próxima festa' : 'Próxima gira') : (fe ? 'Festa' : 'Gira') + ' · ' + (i + 1) + 'ª da agenda';
  setTimeout(() => preConvite(nx), 400);
  return `<section class="hero${gi ? ' comfoto' : ''}${fe ? ' ehfesta' : ''}${dir ? ' vai-' + dir : ''}" style="--ac:${(LINHAS[nx.linha] || LINHAS.outros).cores[0]}">${gi ? banImg(gi, fe) : RISCADO('riscado')}
    <span class="lbl">${lbl}</span><strong>${esc(nx.titulo)}</strong><span class="quando">${esc(quando(nx.data))}</span>
    <p>${esc(fmtLong(nx.data))} · ${esc(nx.hora || '20:00')}<br>${esc(enderecoGira(nx))}</p>
    <div class="acts"><button class="btn sm" data-act="ev-open" data-id="${nx.id}">${fe ? 'Abrir festa' : 'Abrir gira'}</button><button class="btn sm wa" data-act="ev-share" data-id="${nx.id}">${ic('share')}WhatsApp</button></div>
    ${l.length > 1 ? `<div class="heronav"><button class="hn" data-act="hero-prev" aria-label="Gira anterior"${i === 0 ? ' disabled' : ''}>${ic('left')}</button><span class="hdots">${l.slice(0, 8).map((_, k) => `<i${k === i ? ' class="on"' : ''}></i>`).join('')}</span><button class="hn" data-act="hero-next" aria-label="Próxima gira"${i === l.length - 1 ? ' disabled' : ''}>${ic('right')}</button></div>` : ''}
  </section>`;
}
function heroVai(passo) {
  const l = nextEvents(), n = Math.max(0, Math.min((UI.heroIdx || 0) + passo, l.length - 1));
  if (n === UI.heroIdx) return;
  UI.heroIdx = n; const h = $('.hero'); if (h) h.outerHTML = heroHtml(passo > 0 ? 'prox' : 'ant');
}
let toqueX = null;
document.addEventListener('touchstart', e => { toqueX = e.target.closest('.hero') ? e.touches[0].clientX : null; }, { passive: true });
document.addEventListener('touchend', e => { if (toqueX === null) return; const dx = e.changedTouches[0].clientX - toqueX; toqueX = null; if (Math.abs(dx) > 50) heroVai(dx < 0 ? 1 : -1); }, { passive: true });

/* ---------- convite da gira (imagem pronta para o WhatsApp) ---------- */
const diaExtenso = d => { const x = parse(d); const w = DIA_L[x.getDay()]; return w[0].toUpperCase() + w.slice(1) + ', ' + x.getDate() + ' de ' + MES_L[x.getMonth()]; };
const enderecoGira = e => (e.local && /\d/.test(e.local)) ? e.local : (S.casa.endereco || END_PADRAO);
const convCache = {};
const convChave = e => [e.id, e.titulo, e.data, e.hora, e.linha, e.local, S.casa.endereco].join('|');
const carregaImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
function preConvite(e) { const k = convChave(e); if (!convCache[k]) convCache[k] = gerarConvite(e).catch(() => { delete convCache[k]; return null; }); return convCache[k]; }
async function gerarConvite(e) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const fe = ehFesta(e), k = giraImg(e) || 'oxala', a = (window.AXE ? AXE.ORIXAS.concat(AXE.LINHAS) : []).find(z => z.k === k) || {};
  const cores = a.cores || (LINHAS[e.linha] || LINHAS.outros).cores, GOLD = '#e9be5c';
  await Promise.all(["800 90px Alegreya", "700 60px Caveat", "800 40px 'Alegreya Sans'", "700 34px 'Alegreya Sans'"].map(f => document.fonts.load(f).catch(() => {})));
  const [foto, logo] = await Promise.all([carregaImg(`img/${k}.jpg`), carregaImg('icons/logo-320.png').catch(() => null)]);
  // fundo
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0d1f5c'); bg.addColorStop(1, '#060c26'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // foto da linha no alto
  const ph = 780, sc = Math.max(W / foto.width, ph / foto.height), fw = foto.width * sc, fh = foto.height * sc;
  g.drawImage(foto, (W - fw) / 2, -(fh - ph) * .12, fw, fh);
  let gr = g.createLinearGradient(0, 0, 0, 260); gr.addColorStop(0, 'rgba(6,12,38,.85)'); gr.addColorStop(1, 'rgba(6,12,38,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, 260);
  gr = g.createLinearGradient(0, ph - 360, 0, ph); gr.addColorStop(0, 'rgba(6,12,38,0)'); gr.addColorStop(1, '#0a1544'); g.fillStyle = gr; g.fillRect(0, ph - 360, W, 362);
  g.fillStyle = '#0a1544'; g.fillRect(0, ph, W, H - ph);
  const glow = g.createRadialGradient(W / 2, ph + 40, 10, W / 2, ph + 40, 700); glow.addColorStop(0, fe ? 'rgba(233,190,92,.28)' : 'rgba(120,150,255,.16)'); glow.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = glow; g.fillRect(0, ph - 300, W, H);
  // semente fixa por gira para confete/contas
  let sd = 0; for (const ch of e.id + e.titulo) sd = (sd * 31 + ch.charCodeAt(0)) >>> 0; const rnd = () => ((sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296);
  if (fe) {
    const pal = cores.concat([GOLD, '#ffffff']);
    for (let i = 0; i < 160; i++) { const x = rnd() * W, y = 200 + rnd() * (H - 240); if (y > 760 && y < 1290 && x > 60 && x < 1020 && rnd() < .8) continue; g.save(); g.translate(x, y); g.rotate(rnd() * 3.14); g.fillStyle = pal[i % pal.length]; g.globalAlpha = .55 + rnd() * .4; g.fillRect(-7, -3, 14, 6); g.restore(); }
    // bandeirinhas
    [[[-20, 668], [1100, 676], 46, 16]].forEach(([p0, p1, sag, n]) => {
      const pt = t => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t + sag * 4 * t * (1 - t)];
      g.strokeStyle = 'rgba(255,240,200,.85)'; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 40; i++) { const [x, y] = pt(i / 40); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
      for (let i = 0; i < n; i++) { const [x0, y0] = pt(i / n), [x1, y1] = pt((i + 1) / n); g.fillStyle = pal[i % pal.length]; g.beginPath(); g.moveTo(x0 + 4, y0); g.lineTo(x1 - 4, y1); g.lineTo((x0 + x1) / 2, (y0 + y1) / 2 + 52); g.closePath(); g.fill(); }
    });
  }
  // cabeçalho com o brasão
  if (logo) { g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 16; g.fillStyle = '#fff'; g.beginPath(); g.arc(118, 112, 72, 0, 7); g.fill(); g.restore(); g.save(); g.beginPath(); g.arc(118, 112, 66, 0, 7); g.clip(); g.drawImage(logo, 52, 46, 132, 132); g.restore(); }
  g.fillStyle = '#fff'; g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 10;
  g.font = "800 22px 'Alegreya Sans'"; g.letterSpacing = '5px'; g.fillText('TENDA DE UMBANDA', 214, 84); g.letterSpacing = '0px';
  g.font = '800 38px Alegreya'; g.fillText('Pai Joaquim de Angola', 214, 128); g.fillText('e Manezinho Boiadeiro', 214, 170); g.shadowBlur = 0;
  // painel de texto
  let y = 832;
  const tag = fe ? 'FESTA' : ((LINHAS[e.linha] || {}).nome || 'GIRA').toUpperCase();
  g.font = "800 26px 'Alegreya Sans'"; g.letterSpacing = '6px'; const tw = g.measureText(tag).width + 52;
  g.fillStyle = fe ? GOLD : 'rgba(255,255,255,.16)'; g.beginPath(); g.roundRect((W - tw) / 2, y - 40, tw, 54, 27); g.fill();
  g.fillStyle = fe ? '#2a1c00' : '#fff'; g.textAlign = 'center'; g.fillText(tag, W / 2 + 3, y - 4); g.letterSpacing = '0px';
  // título (ajusta tamanho e quebra em até 2 linhas)
  const tit = e.titulo; let fs = 86, linhas;
  const quebra = (t, max) => { const ws = t.split(/\s+/), out = []; let cur = ''; ws.forEach(w => { const tt = cur ? cur + ' ' + w : w; if (g.measureText(tt).width > max && cur) { out.push(cur); cur = w; } else cur = tt; }); if (cur) out.push(cur); return out; };
  do { g.font = `800 ${fs}px Alegreya`; linhas = quebra(tit, 960); fs -= 4; } while ((linhas.length > 2 || linhas.some(l => g.measureText(l).width > 980)) && fs > 52);
  g.fillStyle = '#fff'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 12; y += 88;
  linhas.slice(0, 2).forEach(l => { g.fillText(l, W / 2, y); y += fs * 1.02; }); g.shadowBlur = 0;
  if (a.s) { g.font = '700 56px Caveat'; g.fillStyle = GOLD; g.fillText(a.s, W / 2, y + 4); y += 62; }
  // data, hora e endereço com ícones
  const icone = (tipo, x, yy) => { g.save(); g.strokeStyle = GOLD; g.lineWidth = 4; g.lineCap = 'round'; g.translate(x, yy);
    if (tipo === 'cal') { g.strokeRect(-16, -14, 32, 28); g.beginPath(); g.moveTo(-16, -4); g.lineTo(16, -4); g.moveTo(-8, -20); g.lineTo(-8, -10); g.moveTo(8, -20); g.lineTo(8, -10); g.stroke(); }
    if (tipo === 'hora') { g.beginPath(); g.arc(0, 0, 16, 0, 7); g.moveTo(0, -9); g.lineTo(0, 0); g.lineTo(7, 5); g.stroke(); }
    if (tipo === 'pin') { g.beginPath(); g.arc(0, -6, 11, Math.PI * .85, Math.PI * 2.15); g.lineTo(0, 16); g.closePath(); g.stroke(); g.beginPath(); g.arc(0, -6, 3.5, 0, 7); g.stroke(); }
    g.restore(); };
  const linhaInfo = (tipo, txt, font) => { g.font = font; const w = g.measureText(txt).width; const x0 = (W - w) / 2 + 24; icone(tipo, x0 - 34, y - 13); g.fillStyle = '#fff'; g.textAlign = 'left'; g.fillText(txt, x0, y); g.textAlign = 'center'; };
  y += 26;
  linhaInfo('cal', diaExtenso(e.data), "800 40px 'Alegreya Sans'"); y += 54;
  linhaInfo('hora', 'Início às ' + (e.hora || '20:00') + ' h', "800 40px 'Alegreya Sans'"); y += 54;
  const end = enderecoGira(e); g.font = "700 34px 'Alegreya Sans'";
  const partes = g.measureText(end).width > 900 ? end.split(/\s[–-]\s|,\s(?=[^,]*$)/) : [end];
  linhaInfo('pin', partes[0], "700 34px 'Alegreya Sans'"); if (partes[1]) { y += 44; g.fillStyle = 'rgba(255,255,255,.85)'; g.fillText(partes.slice(1).join(' – '), W / 2, y); }
  // guia de contas no rodapé
  const by = fe ? H - 66 : H - 40, nb = fe ? 33 : 36, bx0 = fe ? 58 : 30; for (let i = 0; i < nb; i++) { const x = bx0 + i * 29.4, yy = by + Math.sin(i / (nb - 1) * Math.PI) * -10; g.fillStyle = cores[i % cores.length]; g.beginPath(); g.arc(x, yy, 10, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.stroke(); g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.arc(x - 3, yy - 3, 3, 0, 7); g.fill(); }
  if (fe) { g.strokeStyle = GOLD; g.lineWidth = 8; g.beginPath(); g.roundRect(14, 14, W - 28, H - 28, 34); g.stroke(); g.strokeStyle = 'rgba(255,236,170,.6)'; g.lineWidth = 3; g.beginPath(); g.roundRect(30, 30, W - 60, H - 60, 26); g.stroke(); }
  return await new Promise(ok => c.toBlob(ok, 'image/jpeg', .9));
}
const nomeArq = e => ('convite ' + e.titulo + ' ' + e.data).replace(/[^\wÀ-ú -]/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '.jpg';
async function enviarConvite(e) {
  const blob = await preConvite(e), texto = giraTexto(e);
  if (blob) {
    const file = new File([blob], nomeArq(e), { type: 'image/jpeg' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text: texto }); return; } catch (x) { if (x && x.name === 'AbortError') return; } }
    baixarBlob(blob, nomeArq(e)); toast('Convite baixado. Anexe a imagem no WhatsApp.');
  }
  window.open(waLink('', texto), '_blank', 'noopener');
}
function baixarBlob(blob, nome) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }

/* ---------- formulários ---------- */

/* Vários orixás e guias por médium: papéis e elementos de trabalho de cada linha */
const PAPEIS = ['De cabeça (1º)', 'Juntó (2º)', 'Adjuntó (3º)', 'Outro'];
const GLINHAS = ['caboclo', 'pretovelho', 'boiadeiro', 'crianca', 'marinheiro', 'baiano', 'cigano', 'exu', 'pombagira', 'malandro', 'outros'];
const gNome = k => k === 'outros' ? 'Outra linha' : (LINHAS[k] || {}).nome || 'Outra linha';
const ELEMENTOS = {
  caboclo: ['Charuto', 'Pemba verde', 'Vela verde', 'Cocar', 'Arco e flecha', 'Ervas da mata', 'Frutas', 'Mel', 'Vinho', 'Água de coco'],
  pretovelho: ['Cachimbo', 'Fumo de rolo', 'Café', 'Terço / rosário', 'Pemba branca', 'Vela branca', 'Arruda', 'Guiné', 'Banquinho', 'Bengala'],
  boiadeiro: ['Laço', 'Chapéu de couro', 'Berrante', 'Chicote', 'Cigarro de palha', 'Cachaça', 'Carne-seca', 'Pemba amarela', 'Vela marrom'],
  crianca: ['Doces', 'Balas', 'Guaraná', 'Bolo', 'Brinquedos', 'Frutas doces', 'Pemba rosa', 'Pemba azul', 'Vela rosa e azul'],
  marinheiro: ['Rum', 'Cachaça', 'Cigarro', 'Quepe', 'Água do mar', 'Peixe', 'Pemba azul', 'Vela azul', 'Âncora'],
  baiano: ['Coco', 'Batida de coco', 'Cigarro de palha', 'Chapéu de palha', 'Farofa', 'Dendê', 'Pemba amarela', 'Vela amarela'],
  cigano: ['Baralho', 'Moedas', 'Lenço', 'Pandeiro', 'Punhal', 'Cristais', 'Incenso', 'Vinho', 'Frutas', 'Vela colorida'],
  exu: ['Marafo (cachaça)', 'Charuto', 'Capa', 'Tridente', 'Farofa de dendê', 'Pimenta', 'Pemba preta', 'Pemba vermelha', 'Vela preta e vermelha'],
  pombagira: ['Champanhe', 'Cigarrilha', 'Rosa vermelha', 'Perfume', 'Leque', 'Batom', 'Licor de anis', 'Taça', 'Vela vermelha'],
  malandro: ['Chapéu panamá', 'Terno branco', 'Cigarro', 'Cerveja', 'Batida', 'Bengala', 'Lenço vermelho', 'Baralho', 'Vela branca e vermelha'],
  outros: ['Vela', 'Pemba', 'Ervas', 'Fumo', 'Bebida']
};
const NOME_EX = { caboclo: 'Caboclo Pena Branca', pretovelho: 'Pai Joaquim de Angola', boiadeiro: 'Manezinho Boiadeiro', crianca: 'Mariazinha', marinheiro: 'Martim Pescador', baiano: 'Zé do Coco', cigano: 'Cigana Esmeralda', exu: 'Exu Tranca-Rua', pombagira: 'Maria Padilha', malandro: 'Zé Pelintra', outros: 'Nome do guia' };
const cabeca = x => { const l = x.orixas || []; return (l.find(o => o.p === PAPEIS[0]) || l[0] || {}).n || x.orixa || ''; };
const oriRow = (o = { n: '', p: PAPEIS[0] }) => `<div class="orow"><select class="inp o-n" aria-label="Orixá"><option value="">Escolha o orixá</option>${opts(ORIXAS.map(z => z.n), o.n)}</select><select class="inp o-p" aria-label="Papel do orixá">${opts(PAPEIS, o.p)}</select><button type="button" class="iconbtn" data-act="multi-del" aria-label="Tirar este orixá">${ic('x')}</button></div>`;
const elChips = (l, sel) => (ELEMENTOS[l] || ELEMENTOS.outros).map(e => `<button type="button" class="elc" data-act="el-tog" aria-pressed="${sel.includes(e)}">${esc(e)}</button>`).join('');
const guiaCard = (g = { l: 'caboclo', n: '', el: [] }) => {
  const extra = (g.el || []).filter(e => !(ELEMENTOS[g.l] || ELEMENTOS.outros).includes(e));
  return `<div class="gcard"><div class="ghead"><select class="inp g-l" aria-label="Linha do guia">${GLINHAS.map(k => `<option value="${k}"${k === g.l ? ' selected' : ''}>${esc(gNome(k))}</option>`).join('')}</select><button type="button" class="iconbtn" data-act="multi-del" aria-label="Tirar este guia">${ic('x')}</button></div>
    <input class="inp g-n" value="${esc(g.n)}" placeholder="Nome do guia (ex.: ${esc(NOME_EX[g.l] || 'Nome do guia')})" autocomplete="off" aria-label="Nome do guia">
    <span class="glbl">Elementos que trabalha</span><div class="els">${elChips(g.l, g.el || [])}</div>
    <input class="inp g-x" value="${esc(extra.join(', '))}" placeholder="Outros elementos (separe por vírgula)" autocomplete="off" aria-label="Outros elementos"></div>`;
};
function lerMultis() {
  const orixas = [...document.querySelectorAll('#oriList .orow')].map(r => ({ n: r.querySelector('.o-n').value, p: r.querySelector('.o-p').value })).filter(o => o.n);
  const guias = [...document.querySelectorAll('#guiaList .gcard')].map(c => ({
    l: c.querySelector('.g-l').value, n: c.querySelector('.g-n').value.trim(),
    el: [...c.querySelectorAll('.elc[aria-pressed="true"]')].map(b => b.textContent).concat(c.querySelector('.g-x').value.split(',').map(z => z.trim()).filter(Boolean))
  })).filter(g => g.n || g.el.length);
  return { orixas, guias };
}

/* ---------- foto do médium com moldura do orixá ---------- */
const ORI_KEY = n => { const o = (window.AXE ? AXE.ORIXAS : []).find(o => o.n === n); return o ? o.k : ''; };
const LIDER = c => /^(Pai|Mãe) de santo$/.test(c || '');
const MOTIVO = {
  oxala: ['M0-9 2.6-2.6 9-2.6 3.9 1.6 5.4 8.4 0 4.3-5.4 8.4-3.9 1.6-9-2.6-2.6-2.6Z', '#ffffff', '#c9a24a'],
  iemanja: ['M0-9 2.6-2.6 9-2.6 3.9 1.6 5.4 8.4 0 4.3-5.4 8.4-3.9 1.6-9-2.6-2.6-2.6Z', '#dff2ff', '#6fb6ea'],
  oxum: ['M0-10 2-4 7-7 4-2 10 0 4 2 7 7 2 4 0 10-2 4-7 7-4 2-10 0-4-2-7-7-2-4Z', '#ffd75e', '#b8860b'],
  ogum: ['M0-11 2.4 3H5.5v2.4H2.2L1.2 10h-2.4l-1-4.6h-3.3V3h3.1Z', '#e8edf5', '#c8302a'],
  oxossi: ['M0-10C7-4 7 4 0 10-7 4-7-4 0-10Z', '#3fae5a', '#1d5e2f'],
  xango: ['M-1-10h2v20h-2ZM1-7C9-10 10 1 1-1ZM-1-7C-9-10-10 1-1-1Z', '#c98b4b', '#5a3714'],
  iansa: ['M3-11-6 1h5l-3 10L8-3H3Z', '#ffd23f', '#e0603a'],
  nana: ['M0-10C7 0 7 8 0 8S-7 0 0-10Z', '#b79be0', '#5d3f8f'],
  omulu: ['M-5-10h2l1 20h-2ZM-1-10h2v20h-2ZM3-10h2l-1 20h-2Z', '#e8d18c', '#8a6b2a'],
  ibeji: ['M0-8a8 8 0 1 1 0 16 8 8 0 1 1 0-16Zm0 4a4 4 0 1 0 0 8', '#ff9cc8', '#6fb6ea'],
  '': ['M0-9 2.6-2.6 9-2.6 3.9 1.6 5.4 8.4 0 4.3-5.4 8.4-3.9 1.6-9-2.6-2.6-2.6Z', '#c9d2f5', '#1a3a9c']
};
let molSeq = 0;
function moldura(k, lider) {
  const id = 'm' + (++molSeq), o = (window.AXE ? AXE.ORIXAS : []).find(x => x.k === k);
  const cores = lider ? ['#f7d77e', '#c8302a', '#f7d77e', '#e0603a'] : (o ? o.cores : ['#ffffff', '#1a3a9c']);
  const n = 30, mot = [], beads = [];
  const motK = i => lider ? (i % 2 ? 'iansa' : 'ogum') : k;
  const nm = lider ? 8 : 6;
  for (let i = 0; i < n; i++) {
    const t = i / n * Math.PI * 2 - Math.PI / 2, x = (100 + Math.cos(t) * 84).toFixed(1), y = (100 + Math.sin(t) * 84).toFixed(1);
    if (i % (n / (lider ? 10 : 6)) === 0) continue;
    const c = cores[i % cores.length];
    beads.push(`<circle cx="${x}" cy="${y}" r="5.6" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1"/><circle cx="${(+x - 1.8).toFixed(1)}" cy="${(+y - 1.8).toFixed(1)}" r="1.7" fill="#fff" opacity=".55"/>`);
  }
  const step = lider ? 10 : 6;
  for (let j = 0; j < step; j++) {
    const t = j / step * Math.PI * 2 - Math.PI / 2, x = 100 + Math.cos(t) * 84, y = 100 + Math.sin(t) * 84, mk = MOTIVO[motK(j)] || MOTIVO[''];
    const fill = lider ? `url(#g${id})` : mk[1];
    mot.push(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(t * 180 / Math.PI + 90).toFixed(1)}) scale(1.05)"><path d="${mk[0]}" fill="${fill}" stroke="${lider ? '#6b4a0c' : mk[2]}" stroke-width="1.4" stroke-linejoin="round"/></g>`);
  }
  const ring = lider ? `url(#g${id})` : (o ? o.cores[0] === '#ffffff' && o.cores[1] ? o.cores[1] : o.cores[0] : '#1a3a9c');
  const coroa = lider ? `<g transform="translate(100 13)"><path d="M-17 6-21-9-9-1 0-14 9-1 21-9 17 6Z" fill="url(#g${id})" stroke="#6b4a0c" stroke-width="1.6" stroke-linejoin="round"/><circle cx="0" cy="-14" r="3" fill="#c8302a"/><circle cx="-21" cy="-9" r="2.4" fill="#e0603a"/><circle cx="21" cy="-9" r="2.4" fill="#e0603a"/></g>` : '';
  return `<svg class="mold" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".35" stop-color="#e2b84f"/><stop offset=".6" stop-color="#a8740a"/><stop offset="1" stop-color="#f7d77e"/></linearGradient></defs>
<circle cx="100" cy="100" r="84" fill="none" stroke="${ring}" stroke-width="${lider ? 26 : 22}" opacity="${lider ? 1 : .9}"/>
<circle cx="100" cy="100" r="${lider ? 97 : 95.5}" fill="none" stroke="${lider ? `url(#g${id})` : '#c9a24a'}" stroke-width="${lider ? 4 : 2}"/>
<circle cx="100" cy="100" r="71" fill="none" stroke="${lider ? `url(#g${id})` : '#c9a24a'}" stroke-width="${lider ? 4 : 2.5}"/>
${beads.join('')}${mot.join('')}${coroa}</svg>`;
}
function avatar(x, size) {
  const k = ORI_KEY(cabeca(x)), lider = LIDER(x.cargo), sz = size || 56;
  const foto = x.foto ? `<img class="ft" src="${x.foto}" alt="">` : `<span class="ft ini">${esc(initials(x.nome))}</span>`;
  const badgeK = k || (lider ? 'ogum' : '');
  const badge = badgeK && window.AXE ? `<span class="bdg" title="${esc(cabeca(x) || 'Ogum')}">${AXE.medalhao(badgeK, 64)}</span>` : '';
  return `<span class="ava${lider ? ' lider' : ''}" style="--s:${sz}px">${foto}${moldura(k, lider)}${badge}</span>`;
}
async function fotoParaDataURL(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    const S2 = 360, c = document.createElement('canvas'); c.width = c.height = S2;
    const m = Math.min(img.naturalWidth, img.naturalHeight), sx = (img.naturalWidth - m) / 2, sy = Math.max(0, (img.naturalHeight - m) / 2 - (img.naturalHeight > img.naturalWidth ? m * .12 : 0));
    c.getContext('2d').drawImage(img, sx, sy, m, m, 0, 0, S2, S2);
    return c.toDataURL('image/jpeg', .8);
  } finally { URL.revokeObjectURL(url); }
}

function memberForm(m) {
  m = m || { id: '', nome: '', cargo: 'Médium', entidades: '', orixa: '', orixas: [], guias: [], tel: '', nasc: '', entrada: today(), mensal: S.casa.mensal, ativo: true, obs: '', foto: '' };
  return `<form class="form" data-form="member" data-id="${m.id}">
    <div class="fotoed"><span id="fotoPrev">${avatar(m, 132)}</span><div class="stack"><label class="btn sm" for="f-foto">${m.foto ? 'Trocar foto' : 'Colocar foto'}</label><input type="file" id="f-foto" accept="image/*" hidden><button type="button" class="btn sm ghost" data-act="foto-del"${m.foto ? '' : ' hidden'}>Remover foto</button><small class="muted">A moldura muda conforme o orixá de cabeça.</small></div><input type="hidden" name="foto" id="f-fotodata" value="${esc(m.foto || '')}"></div>
    <label>Nome<input class="inp" id="f-nome" name="nome" required value="${esc(m.nome)}" autocomplete="off"></label>
    <label>Cargo na casa<select class="inp" id="f-cargo" name="cargo">${opts(CARGOS, m.cargo)}</select></label>
    <div class="multi"><span class="mlbl">Orixás</span><div id="oriList" class="stack">${(m.orixas && m.orixas.length ? m.orixas : [{ n: '', p: PAPEIS[0] }]).map(oriRow).join('')}</div><button type="button" class="btn sm ghost" data-act="ori-add">${ic('plus')}Mais um orixá</button></div>
    <div class="multi"><span class="mlbl">Guias que trabalha</span><div id="guiaList" class="stack">${(m.guias || []).map(guiaCard).join('')}</div><button type="button" class="btn sm ghost" data-act="guia-add">${ic('plus')}Acrescentar guia</button></div>
    <div class="row2"><label>Nascimento<input class="inp" id="f-nasc" name="nasc" type="date" value="${esc(m.nasc)}"></label><label>Entrou na casa<input class="inp" id="f-entr" name="entrada" type="date" value="${esc(m.entrada)}"></label></div>
    <div class="row2"><label>WhatsApp com DDD<input class="inp" id="f-tel" name="tel" inputmode="tel" value="${esc(m.tel)}" placeholder="11 98888-7777"></label><label>Mensalidade (R$)<input class="inp" id="f-men" name="mensal" type="number" min="0" step="1" inputmode="decimal" value="${esc(m.mensal)}"></label></div>
    <label>Observações<textarea class="inp" id="f-obs" name="obs" rows="3">${esc(m.obs)}</textarea></label>
    <label class="chk"><input type="checkbox" id="f-ativo" name="ativo"${m.ativo ? ' checked' : ''}>Ativo na corrente</label>
    <button class="btn block" type="submit">Salvar</button></form>${m.id ? delBlock('member-del', m.id, 'filho da casa') : ''}`;
}
function eventForm(e) {
  e = e || { id: '', linha: 'caboclo', titulo: '', data: addDays(7), hora: '20:00', local: 'Salão principal', obs: '' };
  return `<form class="form" data-form="event" data-id="${e.id}">
    <label>Linha<select class="inp" id="f-linha" name="linha">${linhaOpts(e.linha)}</select></label>
    <label>Título<input class="inp" id="f-tit" name="titulo" value="${esc(e.titulo)}" placeholder="Se ficar vazio, usa o nome da linha" autocomplete="off"></label>
    <div class="row2"><label>Data<input class="inp" id="f-data" name="data" type="date" required value="${esc(e.data)}"></label><label>Hora<input class="inp" id="f-hora" name="hora" type="time" value="${esc(e.hora)}"></label></div>
    <label>Local<input class="inp" id="f-loc" name="local" value="${esc(e.local)}" autocomplete="off"></label>
    <label>Recado para a corrente<textarea class="inp" id="f-obs" name="obs" rows="3">${esc(e.obs)}</textarea></label>
    <button class="btn block" type="submit">Salvar</button></form>${e.id ? delBlock('ev-del', e.id, 'gira') : ''}`;
}
function txForm(t, tipo) {
  t = t || { id: '', tipo: tipo || 'in', cat: tipo === 'out' ? CAT_OUT[0] : CAT_IN[0], desc: '', valor: '', data: today(), mid: '', mes: '' };
  const cats = t.tipo === 'in' ? CAT_IN : CAT_OUT;
  const mem = '<option value="">—</option>' + S.members.map(x => `<option value="${x.id}"${x.id === t.mid ? ' selected' : ''}>${esc(x.nome)}</option>`).join('');
  return `<form class="form" data-form="tx" data-id="${t.id}" data-t="${t.tipo}">
    <div class="row2"><label>Valor (R$)<input class="inp" id="f-val" name="valor" type="number" min="0.01" step="0.01" inputmode="decimal" required value="${esc(t.valor)}"></label><label>Data<input class="inp" id="f-data" name="data" type="date" required value="${esc(t.data)}"></label></div>
    <label>Categoria<select class="inp" id="f-cat" name="cat">${opts(cats, t.cat)}</select></label>
    ${t.tipo === 'in' ? `<label>Filho da casa<select class="inp" id="f-mid" name="mid">${mem}</select><span class="hint">Para mensalidade, escolha quem pagou.</span></label>` : ''}
    <label>Descrição<input class="inp" id="f-desc" name="desc" value="${esc(t.desc)}" autocomplete="off"></label>
    <button class="btn block" type="submit">Salvar</button></form>${t.id ? delBlock('tx-del', t.id, 'lançamento') : ''}`;
}
function stockForm(i) {
  i = i || { id: '', item: '', cat: 'Velas', qtd: 0, min: 1, un: 'un' };
  return `<form class="form" data-form="stock" data-id="${i.id}">
    <label>Item<input class="inp" id="f-item" name="item" required value="${esc(i.item)}" autocomplete="off"></label>
    <label>Categoria<select class="inp" id="f-scat" name="cat">${opts(CAT_EST, i.cat)}</select></label>
    <div class="row2"><label>Quantidade<input class="inp" id="f-qtd" name="qtd" type="number" min="0" step="1" inputmode="numeric" value="${esc(i.qtd)}"></label><label>Mínimo<input class="inp" id="f-min" name="min" type="number" min="0" step="1" inputmode="numeric" value="${esc(i.min)}"></label></div>
    <label>Unidade<input class="inp" id="f-un" name="un" value="${esc(i.un)}" placeholder="un, pct, cx, maço" autocomplete="off"></label>
    <button class="btn block" type="submit">Salvar</button></form>${i.id ? delBlock('stock-del', i.id, 'item') : ''}`;
}
function noticeForm(n) {
  n = n || { id: '', titulo: '', texto: '' };
  return `<form class="form" data-form="notice" data-id="${n.id}">
    <label>Título<input class="inp" id="f-nt" name="titulo" required value="${esc(n.titulo)}" autocomplete="off"></label>
    <label>Aviso<textarea class="inp" id="f-nx" name="texto" rows="6" required>${esc(n.texto)}</textarea></label>
    <button class="btn block" type="submit">Salvar</button></form>${n.id ? delBlock('notice-del', n.id, 'aviso') : ''}`;
}
function pontoForm(p) {
  p = p || { id: '', titulo: '', linha: 'caboclo', letra: '' };
  return `<form class="form" data-form="ponto" data-id="${p.id}">
    <label>Nome do ponto<input class="inp" id="f-pt" name="titulo" required value="${esc(p.titulo)}" placeholder="Ex.: Ponto de abertura" autocomplete="off"></label>
    <label>Linha<select class="inp" id="f-pl" name="linha">${linhaOpts(p.linha)}</select></label>
    <label>Letra<textarea class="inp" id="f-px" name="letra" rows="10" required>${esc(p.letra)}</textarea></label>
    <button class="btn block" type="submit">Salvar</button></form>${p.id ? delBlock('ponto-del', p.id, 'ponto') : ''}`;
}
function filaForm(eid) {
  const mem = '<option value="">Qualquer médium</option>' + S.members.filter(x => x.ativo).map(x => `<option value="${x.id}">${esc(x.nome)}${x.entidades ? ' · ' + esc(x.entidades) : ''}</option>`).join('');
  return `<form class="form" data-form="fila" data-id="${eid}">
    <label>Nome do consulente<input class="inp" id="f-cn" name="nome" required autocomplete="off"></label>
    <label>WhatsApp (opcional)<input class="inp" id="f-ct" name="tel" inputmode="tel"></label>
    <label>Atendimento com<select class="inp" id="f-cm" name="mid">${mem}</select></label>
    <label>Observação<input class="inp" id="f-co" name="obs" placeholder="Ex.: primeira vez, passe, conversa" autocomplete="off"></label>
    <button class="btn block" type="submit">Dar senha</button></form>`;
}

function openMember(id) {
  const x = byId(S.members, id); if (!x) return;
  const m = ym(new Date()), mes = MES_L[new Date().getMonth()];
  const hist = S.tx.filter(t => t.mid === id && t.tipo === 'in').sort((a, b) => b.data.localeCompare(a.data)).slice(0, 6);
  const tel = telDigits(x.tel), pres = Object.keys(S.pres).filter(k => (S.pres[k] || []).includes(id)).length;
  const anos = x.entrada ? Math.max(0, Math.floor((parse(today()) - parse(x.entrada)) / (365.25 * 864e5))) : null;
  const pagoAgora = paid(id, m);
  const ok = ORI_KEY(cabeca(x)), oo = ok && AXE.ORIXAS.find(o => o.k === ok);
  const oriHtml = (x.orixas || []).length ? `<h3>Orixás</h3><div class="list">${x.orixas.map(o => { const k = ORI_KEY(o.n), a = k && AXE.ORIXAS.find(z => z.k === k); return `<div class="row">${k ? `<span class="medm">${AXE.medalhao(k, 48)}</span>` : ''}<span class="main"><strong>${esc(o.n)}</strong><small>${esc(o.p)}${a ? ' · ' + esc(a.s) : ''}</small></span></div>`; }).join('')}</div>` : '';
  const guiaHtml = (x.guias || []).length ? `<h3>Guias que trabalha</h3><div class="stack">${x.guias.map(g => `<div class="card gview"><div class="gtop">${g.l !== 'outros' ? `<span class="medm">${AXE.medalhao(g.l, 52)}</span>` : ''}<span class="main"><strong>${esc(g.n || gNome(g.l))}</strong><small>${esc(gNome(g.l))}</small></span></div>${(g.el || []).length ? `<div class="els ro">${g.el.map(e => `<span class="elc">${esc(e)}</span>`).join('')}</div>` : ''}</div>`).join('')}</div>` : '';
  sheet(x.nome, `<div class="stack">
    <div class="perfil">${avatar(x, 168)}<div class="pinfo"><strong>${esc(x.nome)}</strong><span>${esc(x.cargo)}</span>${oo ? `<span class="psaud">Filho de ${esc(oo.n)} · ${esc(oo.s)}</span>` : ''}</div></div>
    <dl class="kv card"><dt>Cargo</dt><dd>${esc(x.cargo)}</dd>
    <dt>Nascimento</dt><dd>${esc(fmtBR(x.nasc))}</dd><dt>Na casa</dt><dd>${x.entrada ? esc(fmtBR(x.entrada)) + (anos !== null ? ' · ' + anos + (anos === 1 ? ' ano' : ' anos') : '') : '—'}</dd>
    <dt>Presenças</dt><dd class="num">${pres} ${pres === 1 ? 'gira' : 'giras'}</dd><dt>Mensalidade</dt><dd class="num">${brl(x.mensal)}</dd><dt>WhatsApp</dt><dd>${esc(x.tel || '—')}</dd>${x.obs ? `<dt>Obs.</dt><dd>${esc(x.obs)}</dd>` : ''}</dl>
    ${oriHtml}${guiaHtml}
    ${x.ativo && x.mensal > 0 ? (pagoAgora ? `<span class="chip ok" style="align-self:flex-start">Mensalidade de ${mes} paga</span>` : `<button class="btn block" data-act="receber" data-mid="${id}" data-m="${m}" data-reopen="1">Registrar mensalidade de ${mes}</button>`) : ''}
    ${tel.length >= 10 ? `<div class="grid2">${x.ativo && x.mensal > 0 && !pagoAgora ? `<a class="btn wa" href="${esc(waLink(x.tel, cobrancaTexto(x, m)))}" target="_blank" rel="noopener">Lembrar mensalidade</a>` : ''}<a class="btn ghost" href="${esc(waLink(x.tel, 'Saravá, ' + x.nome.split(' ')[0] + '!'))}" target="_blank" rel="noopener">Abrir WhatsApp</a></div>` : '<p class="muted" style="margin:0">Cadastre o WhatsApp para mandar lembretes e recibos.</p>'}
    <h3>Últimos pagamentos</h3>${hist.length ? `<div class="list">${hist.map(t => `<div class="row"><span class="main"><strong>${esc(mesLabel(t.mes || t.data.slice(0, 7)))}</strong><small>pago em ${shortDate(t.data)}</small></span><span class="val pos num">${brl(t.valor)}</span>${tel.length >= 10 ? `<a class="iconbtn" href="${esc(waLink(x.tel, reciboTexto(x, t)))}" target="_blank" rel="noopener" aria-label="Enviar recibo">${ic('share')}</a>` : ''}</div>`).join('')}</div>` : '<p class="muted" style="margin:0">Nenhum pagamento registrado.</p>'}
    <button class="btn ghost block" data-act="member-edit" data-id="${id}">Editar cadastro</button></div>`);
}
function openEvent(id, keep) {
  const e = byId(S.events, id); if (!e) return;
  const st = $('#sheet').scrollTop, pres = S.pres[id] || [], fila = S.fila[id] || [];
  const act = S.members.filter(x => x.ativo);
  const atual = fila.find(f => f.status === 'agora');
  const espera = fila.filter(f => f.status === 'espera').length, feitos = fila.filter(f => f.status === 'feito').length;
  const tabs = `<div class="seg">${segBtns([['fila', `Atendimento (${fila.length})`], ['chamada', `Chamada (${pres.length})`]], UI.evTab, 'evtab')}</div>`;
  const filaHtml = `${atual ? `<div class="senha"><div><small>Senha chamada</small><span class="nm">${esc(atual.nome)}</span></div><b>${pad(atual.senha)}</b></div>` : ''}
    <div class="grid2"><button class="btn" data-act="fila-new" data-eid="${id}">${ic('plus')}Dar senha</button><button class="btn ghost" data-act="fila-next" data-eid="${id}"${espera ? '' : ' disabled'}>Chamar próxima</button></div>
    <p class="muted" style="margin:0">${espera} aguardando · ${feitos} atendidos. Toque na senha para mudar a situação.</p>
    ${fila.length ? `<div class="list">${fila.map(f => { const md = f.mid ? byId(S.members, f.mid) : null; return `<button class="row" data-act="fila-step" data-eid="${id}" data-id="${f.id}"><span class="sn ${f.status === 'feito' ? 'done' : f.status === 'agora' ? 'now' : ''}">${pad(f.senha)}</span><span class="main"><strong>${esc(f.nome)}</strong><small>${esc([md ? md.nome : '', f.obs].filter(Boolean).join(' · ') || 'Sem observação')}</small></span>${f.status === 'feito' ? '<em class="chip ok">Atendido</em>' : f.status === 'agora' ? '<em class="chip gold">Na vez</em>' : '<em class="chip mute">Aguardando</em>'}</button>`; }).join('')}</div>` : empty('Ninguém na fila', 'Dê senha aos consulentes conforme forem chegando.')}
    ${atual ? `<button class="btn ghost block" data-act="telao" data-eid="${id}">Mostrar senha em tela cheia</button>` : ''}`;
  const chamadaHtml = act.length ? `<p class="muted" style="margin:0">${pres.length} de ${act.length} presentes. Toque no nome para marcar.</p><div class="pres">${act.map(x => { const on = pres.includes(x.id); return `<button type="button" data-act="presence" data-eid="${id}" data-mid="${x.id}" aria-pressed="${on}"><span class="box">${on ? ic('check') : ''}</span><span><strong>${esc(x.nome)}</strong><br><small class="muted">${esc(x.cargo)}</small></span></button>`; }).join('')}</div>` : empty('Sem filhos ativos', 'Cadastre os filhos da casa primeiro.');
  const gi = giraImg(e), fe = ehFesta(e);
  sheet(e.titulo, `<div class="stack">
    ${gi ? `<div class="evbanner${fe ? ' ehfesta' : ''}" style="--ac:${(LINHAS[e.linha] || LINHAS.outros).cores[0]}">${banImg(gi, fe)}<span class="lbl">${fe ? 'Festa · ' : ''}${esc((LINHAS[e.linha] || LINHAS.outros).nome)}</span><strong>${esc(e.titulo)}</strong><span class="q">${esc(fmtLong(e.data))} · ${esc(e.hora || '')}</span></div>` : ''}
    <dl class="kv card"><dt>Quando</dt><dd>${esc(fmtLong(e.data))} · ${esc(e.hora || '')}</dd><dt>Linha</dt><dd>${linhaChip(e.linha)}</dd><dt>Local</dt><dd>${esc(e.local || '—')}</dd>${e.obs ? `<dt>Recado</dt><dd>${esc(e.obs)}</dd>` : ''}</dl>
    <div class="convite card"><span class="clbl">Convite pronto para o WhatsApp</span><img id="convPrev" alt="Convite da ${esc(e.titulo)}" width="1080" height="1350"><div class="grid2"><button class="btn wa" data-act="ev-share" data-id="${id}">${ic('share')}Enviar no WhatsApp</button><button class="btn ghost" data-act="ev-baixar" data-id="${id}">Baixar imagem</button></div></div>
    <button class="btn ghost block" data-act="ev-ics" data-id="${id}">${ic('cal')}Pôr na agenda</button>
    ${tabs}${UI.evTab === 'fila' ? filaHtml : chamadaHtml}
    <button class="btn ghost block" data-act="ev-edit" data-id="${id}">Editar gira</button></div>`);
  if (keep) $('#sheet').scrollTop = st;
  preConvite(e).then(bl => { const im = $('#convPrev'); if (im && bl) { if (im.dataset.u) URL.revokeObjectURL(im.dataset.u); im.dataset.u = URL.createObjectURL(bl); im.src = im.dataset.u; } });
}
function openFicha(tipo, k) {
  const list = tipo === 'l' ? AXE.LINHAS : AXE.ORIXAS, o = list.find(x => x.k === k); if (!o) return;
  const lista = (arr, cls) => `<ul class="tags ${cls}">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const linhas = [['Dia', o.dia], ['Cores', `<span class="cores">${contas(o.cores)}</span>${esc(o.cor)}`]];
  if (o.elem) linhas.push(['Elemento', o.elem]);
  if (o.orixa) linhas.push(['Orixá regente', o.orixa]);
  if (o.sinc) linhas.push(['Sincretismo', o.sinc]);
  if (o.festa) linhas.push(['Data festiva', o.festa]);
  sheet(o.n, `<div class="ficha">
    <div class="ficha-top"><img class="estampa" src="img/${o.k}.jpg" alt="Imagem de ${esc(o.n)}" width="300" height="450"><span class="saud">${esc(o.s)}</span>${o.s2 ? `<span class="s2">${esc(o.s2)}</span>` : ''}</div>
    <dl class="kv card">${linhas.map(([a, b]) => `<dt>${a}</dt><dd>${a === 'Cores' ? b : esc(b)}</dd>`).join('')}</dl>
    <section><h3>${tipo === 'l' ? 'Quem são' : 'Regência'}</h3><p>${esc(o.reg)}</p></section>
    <section><h3>${tipo === 'l' ? 'Oferendas' : 'Comidas e oferendas'}</h3>${lista(o.comidas, 'comida')}</section>
    <section><h3>Ervas de trabalho</h3>${lista(o.ervas, 'erva')}</section>
    <section><h3>${tipo === 'l' ? 'Elementos e símbolos' : 'Ferramentas'}</h3><p>${esc(o.ferr)}</p></section>
    <button class="btn ghost block" data-act="ficha-share" data-tipo="${tipo}" data-k="${o.k}">${ic('share')}Enviar ficha</button>
  </div>`);
}
function icsFor(e) {
  const d = e.data.replace(/-/g, ''), h = (e.hora || '20:00').replace(':', '') + '00';
  const endH = String(Math.min(23, Number((e.hora || '20:00').slice(0, 2)) + 3)).padStart(2, '0') + (e.hora || '20:00').slice(3, 5) + '00';
  const clean = s => String(s || '').replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tenda Pai Joaquim//PT-BR', 'BEGIN:VEVENT', 'UID:' + e.id + '@tenda-pai-joaquim', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
    'DTSTART:' + d + 'T' + h, 'DTEND:' + d + 'T' + endH, 'SUMMARY:' + clean(e.titulo), 'LOCATION:' + clean([e.local, S.casa.endereco].filter(Boolean).join(' - ')), 'DESCRIPTION:' + clean(e.obs || casaCurta()),
    'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', 'DESCRIPTION:' + clean(e.titulo), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
async function saveFile(name, mime, text) {
  const file = new File([text], name, { type: mime });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

/* ---------- senha (PIN) ---------- */
async function hashPin(p) {
  const data = new TextEncoder().encode('tenda:' + p);
  if (crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', data); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  let h = 0; for (const c of data) h = (h * 31 + c) >>> 0; return 'x' + h;
}
function lockScreen(mode) {
  // mode: 'open' | 'set1' | 'set2'
  let typed = '', first = '';
  const el = $('#lock'); el.hidden = false;
  const title = { open: 'Digite a senha do app', set1: 'Crie uma senha de 4 números', set2: 'Repita a senha' };
  const draw = (msg) => {
    el.innerHTML = `<img src="icons/logo-320.png" alt="Brasão da Tenda"><span class="saud">Saravá!</span><span>${title[mode]}</span><div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i < typed.length ? 'on' : ''}"></i>`).join('')}</div><div class="err" role="alert">${esc(msg || '')}</div><div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}">${n}</button>`).join('')}${mode === 'open' ? '<span></span>' : '<button class="t" data-k="c">Cancelar</button>'}<button data-k="0">0</button><button class="t" data-k="b" aria-label="Apagar">Apagar</button></div>`;
  };
  draw();
  el.onclick = async ev => {
    const b = ev.target.closest('[data-k]'); if (!b) return;
    const k = b.dataset.k;
    if (k === 'c') { el.hidden = true; el.onclick = null; return; }
    if (k === 'b') { typed = typed.slice(0, -1); draw(); return; }
    if (typed.length < 4) typed += k;
    draw();
    if (typed.length < 4) return;
    if (mode === 'open') {
      if (await hashPin(typed) === S.pinHash) { el.hidden = true; el.onclick = null; UI.unlocked = true; }
      else { typed = ''; draw('Senha errada. Tente de novo.'); }
    } else if (mode === 'set1') { first = typed; typed = ''; mode = 'set2'; draw(); }
    else if (mode === 'set2') {
      if (typed === first) { S.pinHash = await hashPin(typed); save(); el.hidden = true; el.onclick = null; render(true); toast('Senha criada'); }
      else { typed = ''; first = ''; mode = 'set1'; draw('As senhas não bateram. Comece de novo.'); }
    }
  };
}

/* ---------- vídeo ---------- */
const VIDEO = 'video/orixas-e-linhas.mp4';
function closeVid() { const v = $('#vidEl'); v.pause(); $('#vid').hidden = true; }
async function shareVid() {
  const link = new URL(VIDEO, location.href).href, text = `Orixás e Linhas de Umbanda · ${casaCurta()}`;
  try {
    if (navigator.canShare) {
      toast('Preparando o vídeo…');
      const blob = await (await fetch(VIDEO)).blob();
      const file = new File([blob], 'orixas-e-linhas-tenda.mp4', { type: 'video/mp4' });
      if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: text }); return; }
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  window.open('https://wa.me/?text=' + encodeURIComponent(text + '\n' + link), '_blank', 'noopener');
}

function fotoPreview() {
  const pv = $('#fotoPrev'); if (!pv) return;
  pv.innerHTML = avatar({ nome: ($('#f-nome') || {}).value || '', foto: $('#f-fotodata').value, orixas: lerMultis().orixas, cargo: $('#f-cargo').value }, 132);
}

/* ---------- ações ---------- */
const ACT = {
  close: () => closeSheet(),
  go: d => { UI.tab = d.tab; if (d.tab === 'mais') UI.sub = 'menu'; closeSheet(); render(); },
  'mais-go': d => { UI.tab = 'mais'; UI.sub = d.v; render(); },
  ffilter: d => { UI.filter = d.v; render(true); },
  gv: d => { UI.gv = d.v; render(true); },
  evtab: d => { UI.evTab = d.v; const id = $('[data-act="ev-edit"]') && $('[data-act="ev-edit"]').dataset.id; if (id) openEvent(id, true); },
  tema: d => { S.tema = d.v; save(); applyTheme(); render(true); },
  install: async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); try { await deferredPrompt.userChoice; } catch (e) {} deferredPrompt = null; render(true); },
  'cm-prev': () => shiftMonth(-1), 'cm-next': () => shiftMonth(1),
  'member-new': () => sheet('Novo filho da casa', memberForm()),
  'member-open': d => openMember(d.id),
  'member-edit': d => sheet('Editar cadastro', memberForm(byId(S.members, d.id))),
  'member-del': d => { S.members = S.members.filter(x => x.id !== d.id); Object.keys(S.pres).forEach(k => { S.pres[k] = S.pres[k].filter(i => i !== d.id); }); save(); closeSheet(); render(true); toast('Cadastro excluído'); },
  receber: d => { const t = addPayment(d.mid, d.m); save(); render(true); if (d.reopen) openMember(d.mid); const x = byId(S.members, d.mid); if (t && x && telDigits(x.tel).length >= 10) { sheet('Mensalidade registrada', `<div class="stack"><p style="margin:0">${esc(brl(t.valor))} de ${esc(x.nome)} lançado no caixa.</p><a class="btn wa block" href="${esc(waLink(x.tel, reciboTexto(x, t)))}" target="_blank" rel="noopener">Enviar recibo no WhatsApp</a><button class="btn ghost block" data-act="close">Fechar</button></div>`); } else toast('Mensalidade registrada'); },
  'ev-new': () => sheet('Nova gira ou evento', eventForm()),
  'ev-open': d => { UI.evTab = byId(S.events, d.id) && byId(S.events, d.id).data <= today() ? 'fila' : 'chamada'; if ((S.fila[d.id] || []).length) UI.evTab = 'fila'; openEvent(d.id); },
  'ev-edit': d => sheet('Editar gira', eventForm(byId(S.events, d.id))),
  'ev-del': d => { S.events = S.events.filter(x => x.id !== d.id); delete S.pres[d.id]; delete S.fila[d.id]; save(); closeSheet(); render(true); toast('Gira excluída'); },
  'ev-share': d => { const e = byId(S.events, d.id); if (e) enviarConvite(e); },
  'ev-baixar': async d => { const e = byId(S.events, d.id); if (!e) return; const b = await preConvite(e); if (b) baixarBlob(b, nomeArq(e)); },
  'hero-prev': () => heroVai(-1),
  'hero-next': () => heroVai(1),
  'ev-ics': d => { const e = byId(S.events, d.id); if (e) saveFile(e.titulo.replace(/[^\wÀ-ú -]/g, '') + '.ics', 'text/calendar', icsFor(e)); },
  presence: d => { const l = S.pres[d.eid] || []; const i = l.indexOf(d.mid); if (i >= 0) l.splice(i, 1); else l.push(d.mid); S.pres[d.eid] = l; save(); openEvent(d.eid, true); render(true); },
  'fila-new': d => sheet('Dar senha', filaForm(d.eid)),
  'fila-next': d => { const l = S.fila[d.eid] || []; l.forEach(f => { if (f.status === 'agora') f.status = 'feito'; }); const nx = l.find(f => f.status === 'espera'); if (nx) nx.status = 'agora'; save(); UI.evTab = 'fila'; openEvent(d.eid, true); render(true); if (nx) showTelao(d.eid); },
  'fila-step': d => { const l = S.fila[d.eid] || []; const f = l.find(x => x.id === d.id); if (!f) return; if (f.status === 'espera') { l.forEach(x => { if (x.status === 'agora') x.status = 'feito'; }); f.status = 'agora'; } else if (f.status === 'agora') f.status = 'feito'; else f.status = 'espera'; save(); openEvent(d.eid, true); render(true); },
  telao: d => showTelao(d.eid),
  'tx-new': d => sheet(d.t === 'in' ? 'Nova entrada' : 'Nova saída', txForm(null, d.t)),
  'tx-open': d => { const t = byId(S.tx, d.id); if (t) sheet(t.tipo === 'in' ? 'Editar entrada' : 'Editar saída', txForm(t)); },
  'tx-del': d => { S.tx = S.tx.filter(x => x.id !== d.id); save(); closeSheet(); render(true); toast('Lançamento excluído'); },
  'caixa-share': () => { const m = UI.cm, t = totals(m), p = due(m); share(`${casaCurta()}\nCaixa de ${mesLabel(m)}\n\nEntradas: ${brl(t.i)}\nSaídas: ${brl(t.o)}\nSaldo: ${brl(t.s)}\nMensalidades em aberto: ${p.length}`, 'Caixa'); },
  'stock-new': () => sheet('Novo item', stockForm()),
  'stock-open': d => sheet('Editar item', stockForm(byId(S.stock, d.id))),
  'stock-inc': d => { const i = byId(S.stock, d.id); if (i) { i.qtd++; save(); render(true); } },
  'stock-dec': d => { const i = byId(S.stock, d.id); if (i) { i.qtd = Math.max(0, i.qtd - 1); save(); render(true); } },
  'stock-del': d => { S.stock = S.stock.filter(x => x.id !== d.id); save(); closeSheet(); render(true); toast('Item excluído'); },
  compras: () => { const low = S.stock.filter(i => i.qtd <= i.min); if (!low.length) return; share(`Lista de compras · ${casaCurta()}\n\n` + low.map(i => `• ${i.item}: comprar ${Math.max(1, i.min * 2 - i.qtd)} ${i.un} (tem ${i.qtd})`).join('\n'), 'Lista de compras'); },
  'notice-new': () => sheet('Novo aviso', noticeForm()),
  'notice-open': d => sheet('Editar aviso', noticeForm(byId(S.notices, d.id))),
  'notice-del': d => { S.notices = S.notices.filter(x => x.id !== d.id); save(); closeSheet(); render(true); toast('Aviso excluído'); },
  'notice-share': d => { const n = byId(S.notices, d.id); if (n) share(`*${n.titulo}*\n\n${n.texto}\n\n${casaCurta()}`, n.titulo); },
  'ponto-new': () => sheet('Novo ponto', pontoForm()),
  'ponto-open': d => { const p = byId(S.pontos, d.id); if (p) sheet(p.titulo, `<div class="stack">${linhaChip(p.linha)}<p class="letra">${esc(p.letra)}</p><div class="grid2"><button class="btn" data-act="ponto-share" data-id="${p.id}">${ic('share')}Enviar</button><button class="btn ghost" data-act="ponto-edit" data-id="${p.id}">Editar</button></div></div>`); },
  'ponto-edit': d => sheet('Editar ponto', pontoForm(byId(S.pontos, d.id))),
  'ponto-share': d => { const p = byId(S.pontos, d.id); if (p) share(`*${p.titulo}* (${(LINHAS[p.linha] || LINHAS.outros).nome})\n\n${p.letra}`, p.titulo); },
  'ponto-del': d => { S.pontos = S.pontos.filter(x => x.id !== d.id); save(); closeSheet(); render(true); toast('Ponto excluído'); },
  oxtab: d => { UI.oxTab = d.v; render(); },
  ficha: d => openFicha(d.tipo, d.k),
  'ori-add': () => { $('#oriList').insertAdjacentHTML('beforeend', oriRow({ n: '', p: PAPEIS[Math.min(3, $('#oriList').children.length)] })); },
  'guia-add': () => { $('#guiaList').insertAdjacentHTML('beforeend', guiaCard()); const c = $('#guiaList').lastElementChild; c.querySelector('.g-n').focus(); },
  'multi-del': (d, b) => { const r = b.closest('.orow, .gcard'); if (r) r.remove(); fotoPreview(); },
  'el-tog': (d, b) => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); },
  'foto-del': () => { $('#f-fotodata').value = ''; const b = $('[data-act="foto-del"]'); if (b) b.hidden = true; fotoPreview(); },
  'vid-open': () => { const v = $('#vidEl'); if (!v.src) v.src = VIDEO; $('#vid').hidden = false; v.play().catch(() => {}); },
  'vid-close': () => closeVid(),
  'vid-share': () => shareVid(),
  'ficha-share': d => { const o = (d.tipo === 'l' ? AXE.LINHAS : AXE.ORIXAS).find(x => x.k === d.k); if (o) share(`*${o.n}* — ${o.s}\n\nDia: ${o.dia}\nCores: ${o.cor}${o.sinc ? '\nSincretismo: ' + o.sinc : ''}${o.festa ? '\nData festiva: ' + o.festa : ''}\n\n${o.reg}\n\nComidas e oferendas: ${o.comidas.join(', ')}\nErvas: ${o.ervas.join(', ')}\n\n${casaCurta()}`, o.n); },
  'del-ask': () => { $('#delask').hidden = true; $('#delbox').hidden = false; },
  'del-no': () => { $('#delbox').hidden = true; $('#delask').hidden = false; },
  'demo-ask': () => sheet('Limpar exemplos', '<div class="stack"><p style="margin:0">Isso apaga os filhos, lançamentos, giras, estoque e avisos de exemplo. Os dados da casa em Ajustes continuam.</p><button class="btn danger block" data-act="demo-clear">Sim, limpar os exemplos</button><button class="btn ghost block" data-act="close">Cancelar</button></div>'),
  'demo-clear': () => { S = normalize({ demo: false, casa: S.casa, members: [], tx: [], events: [], pres: {}, fila: {}, stock: [], notices: [], pontos: [], pinHash: S.pinHash, tema: S.tema }); save(); closeSheet(); UI.tab = 'filhos'; render(); toast('Pronto. Comece cadastrando os filhos da casa.'); },
  'seed-ask': () => sheet('Apagar tudo', '<div class="stack"><p style="margin:0">Todos os dados da casa neste celular serão trocados pelos exemplos. Salve uma cópia de segurança antes, se precisar.</p><button class="btn danger block" data-act="seed-ok">Sim, apagar tudo</button><button class="btn ghost block" data-act="close">Cancelar</button></div>'),
  'seed-ok': () => { const keep = { pinHash: S.pinHash, tema: S.tema }; S = Object.assign(seed(), keep); save(); closeSheet(); UI.tab = 'home'; render(); toast('Exemplos carregados'); },
  'pin-set': () => lockScreen('set1'),
  'pin-off': () => { S.pinHash = ''; save(); render(true); toast('Senha removida'); },
  'bk-export': () => saveFile('tenda-backup-' + today() + '.json', 'application/json', JSON.stringify(S, null, 1))
};
function shiftMonth(n) { const a = UI.cm.split('-').map(Number); UI.cm = ym(new Date(a[0], a[1] - 1 + n, 1)); render(true); }
function showTelao(eid) {
  const f = (S.fila[eid] || []).find(x => x.status === 'agora'); if (!f) return;
  const el = $('#telao'); el.hidden = false;
  el.innerHTML = `<small>Senha</small><b>${pad(f.senha)}</b><p>${esc(f.nome)}</p><span class="muted" style="color:#fff;opacity:.75">Toque para fechar</span>`;
  el.onclick = () => { el.hidden = true; el.onclick = null; };
}

const FORMS = {
  member(fd, ds) {
    const mu = lerMultis();
    const o = { nome: String(fd.get('nome') || '').trim(), cargo: fd.get('cargo'), orixas: mu.orixas, guias: mu.guias, entidades: mu.guias.map(g => g.n || gNome(g.l)).join(', '), orixa: '', tel: String(fd.get('tel') || '').trim(), nasc: fd.get('nasc') || '', entrada: fd.get('entrada') || '', mensal: Math.max(0, Number(fd.get('mensal') || 0)), ativo: fd.get('ativo') === 'on', obs: String(fd.get('obs') || '').trim(), foto: String(fd.get('foto') || '') };
    if (!o.nome) return;
    o.orixa = cabeca(o);
    if (ds.id) Object.assign(byId(S.members, ds.id), o); else { o.id = uid(); S.members.push(o); }
    save(); closeSheet(); render(true); toast('Cadastro salvo');
  },
  event(fd, ds) {
    const linha = fd.get('linha'), o = { linha, titulo: String(fd.get('titulo') || '').trim() || LINHAS[linha].gira, data: fd.get('data'), hora: fd.get('hora') || '', local: String(fd.get('local') || '').trim(), obs: String(fd.get('obs') || '').trim() };
    if (!o.data) return;
    if (ds.id) Object.assign(byId(S.events, ds.id), o); else { o.id = uid(); S.events.push(o); }
    save(); closeSheet(); UI.tab = 'giras'; UI.gv = o.data >= today() ? 'prox' : 'pass'; render(); toast('Gira salva');
  },
  tx(fd, ds) {
    const valor = Number(fd.get('valor') || 0); if (!(valor > 0)) return;
    const cat = fd.get('cat'), mid = ds.t === 'in' ? String(fd.get('mid') || '') : '', data = fd.get('data');
    let desc = String(fd.get('desc') || '').trim(); const mem = mid ? byId(S.members, mid) : null;
    if (!desc) desc = (cat === 'Mensalidade' && mem) ? 'Mensalidade · ' + mem.nome : cat;
    const o = { tipo: ds.t, cat, desc, valor, data, mid, mes: (cat === 'Mensalidade' && mid) ? data.slice(0, 7) : '' };
    if (ds.id) Object.assign(byId(S.tx, ds.id), o); else { o.id = uid(); S.tx.push(o); }
    save(); closeSheet(); render(true); toast('Lançamento salvo');
  },
  stock(fd, ds) {
    const o = { item: String(fd.get('item') || '').trim(), cat: fd.get('cat') || 'Outros', qtd: Math.max(0, Math.round(Number(fd.get('qtd') || 0))), min: Math.max(0, Math.round(Number(fd.get('min') || 0))), un: String(fd.get('un') || 'un').trim() || 'un' };
    if (!o.item) return;
    if (ds.id) Object.assign(byId(S.stock, ds.id), o); else { o.id = uid(); S.stock.push(o); }
    save(); closeSheet(); render(true); toast('Item salvo');
  },
  notice(fd, ds) {
    const o = { titulo: String(fd.get('titulo') || '').trim(), texto: String(fd.get('texto') || '').trim() };
    if (!o.titulo || !o.texto) return;
    if (ds.id) Object.assign(byId(S.notices, ds.id), o); else { o.id = uid(); o.data = today(); S.notices.unshift(o); }
    save(); closeSheet(); render(true); toast('Aviso salvo');
  },
  ponto(fd, ds) {
    const o = { titulo: String(fd.get('titulo') || '').trim(), linha: fd.get('linha'), letra: String(fd.get('letra') || '').trim() };
    if (!o.titulo || !o.letra) return;
    if (ds.id) Object.assign(byId(S.pontos, ds.id), o); else { o.id = uid(); S.pontos.push(o); }
    save(); closeSheet(); render(true); toast('Ponto salvo');
  },
  fila(fd, ds) {
    const l = S.fila[ds.id] || (S.fila[ds.id] = []);
    const nome = String(fd.get('nome') || '').trim(); if (!nome) return;
    const senha = l.reduce((mx, f) => Math.max(mx, f.senha), 0) + 1;
    l.push({ id: uid(), senha, nome, tel: String(fd.get('tel') || '').trim(), mid: fd.get('mid') || '', obs: String(fd.get('obs') || '').trim(), status: 'espera' });
    save(); UI.evTab = 'fila'; openEvent(ds.id); render(true); toast('Senha ' + pad(senha) + ' para ' + nome);
  },
  casa(fd) {
    Object.assign(S.casa, { nome: String(fd.get('nome') || '').trim() || casaPadrao().nome, dirigente: String(fd.get('dirigente') || '').trim(), endereco: String(fd.get('endereco') || '').trim(), pix: String(fd.get('pix') || '').trim(), mensal: Math.max(0, Number(fd.get('mensal') || 0)), venc: Math.min(28, Math.max(1, Number(fd.get('venc') || 10))) });
    save(); render(true); toast('Dados da casa salvos');
  }
};

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  if (e.target === $('#sheetWrap')) { closeSheet(); return; }
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const fn = ACT[t.dataset.act]; if (fn) fn(t.dataset, t, e);
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]'); if (!f) return;
  e.preventDefault();
  const fn = FORMS[f.dataset.form]; if (fn) fn(new FormData(f), f.dataset);
});
document.addEventListener('input', e => {
  if (e.target.id === 'q') { UI.q = e.target.value; const l = $('#flist'); if (l) l.innerHTML = filhosList(); }
  if (e.target.id === 'pq') { UI.pq = e.target.value; const pos = e.target.selectionStart; render(true); const n = $('#pq'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } }
});
document.addEventListener('change', async e => {
  const t = e.target;
  if (t.id === 'f-foto' && t.files[0]) {
    try { $('#f-fotodata').value = await fotoParaDataURL(t.files[0]); const b = $('[data-act="foto-del"]'); if (b) b.hidden = false; } catch (x) { toast('Não consegui abrir essa foto.'); }
    t.value = ''; fotoPreview(); return;
  }
  if (t.id === 'f-cargo' || t.classList.contains('o-n') || t.classList.contains('o-p')) { fotoPreview(); return; }
  if (t.classList.contains('g-l')) { const c = t.closest('.gcard'), sel = [...c.querySelectorAll('.elc[aria-pressed="true"]')].map(b => b.textContent); c.querySelector('.els').innerHTML = elChips(t.value, sel); c.querySelector('.g-n').placeholder = 'Nome do guia (ex.: ' + (NOME_EX[t.value] || 'Nome do guia') + ')'; return; }
  if (t.id !== 'bkfile' || !t.files[0]) return;
  try {
    const o = JSON.parse(await e.target.files[0].text());
    if (!valid(o)) throw new Error('inválido');
    S = normalize(o); save(); applyTheme(); UI.tab = 'home'; render(); toast('Cópia restaurada');
  } catch (x) { toast('Esse arquivo não é uma cópia do app.'); }
  e.target.value = '';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#vid').hidden) closeVid(); else if (!$('#telao').hidden) $('#telao').hidden = true; else if (sheetOpen()) closeSheet(); } });

/* Botão voltar do Android: fecha a folha, volta ao menu ou ao início antes de sair */
history.replaceState({ root: 1 }, '');
history.pushState({ guard: 1 }, '');
window.addEventListener('popstate', () => {
  const guard = () => history.pushState({ guard: 1 }, '');
  if (!$('#vid').hidden) { closeVid(); guard(); return; }
  if (!$('#telao').hidden) { $('#telao').hidden = true; guard(); return; }
  if (sheetOpen()) { closeSheet(); guard(); return; }
  if (UI.tab === 'mais' && UI.sub !== 'menu') { UI.sub = 'menu'; render(); guard(); return; }
  if (UI.tab !== 'home') { UI.tab = 'home'; render(); guard(); return; }
  history.back();
});

/* Vira o dia com o app aberto: atualiza o orixá/linha do dia e a próxima gira */
let diaVisto = new Date().toDateString();
const checaDia = () => { const d = new Date().toDateString(); if (d !== diaVisto) { diaVisto = d; if (UI.tab === 'home' && !sheetOpen()) render(true); } };
setInterval(checaDia, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checaDia(); });

/* ---------- início ---------- */
$('[data-act="close"]').innerHTML = ic('x');
$('[data-act="vid-close"]').innerHTML = ic('x');
$('#hdrRiscado').outerHTML = RISCADO('riscado');
applyTheme();
render();
if (S.pinHash) lockScreen('open');
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  const tinha = !!navigator.serviceWorker.controller; let recarregou = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (tinha && !recarregou) { recarregou = true; location.reload(); } });
  navigator.serviceWorker.register('sw.js').then(r => r.update && r.update()).catch(() => {});
}
})();
