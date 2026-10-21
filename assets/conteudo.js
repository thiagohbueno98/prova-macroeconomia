// Conteúdo didático: resumos, flashcards, pegadinhas e formulário.
// Tudo aqui foi tirado dos slides do Prof. Thiago Caliari (Mankiw, caps. 23–36)
// e do estudo empírico. Blocos marcados como "Complemento" vão além dos slides.

const AULAS = [
/* ============================================================ AULA 1 */
{
  id: "Aula 1",
  cor: "#60a5fa",
  titulo: "Medindo a Renda Nacional",
  cap: "Cap. 23 Mankiw",
  tema: "PIB, componentes, real × nominal, deflator e bem-estar",
  lab: "pib",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> o PIB é o <b>valor de mercado</b> de todos os <b>bens e serviços finais</b> <b>produzidos</b> <b>dentro do país</b> em um <b>período</b>. Para a economia como um todo, <b>renda = despesa = produção</b>, porque cada real gasto por um comprador é um real de receita para um vendedor.</div>

  <section class="sec">
    <h3><span class="n">1</span> Micro × Macro e o fluxo circular</h3>
    <p><b>Micro</b> estuda como famílias e firmas decidem e interagem nos mercados. <b>Macro</b> estuda a economia como um todo — e começa medindo a renda e a despesa totais do país.</p>
    <div class="fluxo">${'' /* diagrama desenhado em SVG */}
      <svg viewBox="0 0 520 250" role="img" aria-label="Fluxo circular da renda">
        <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
        <rect x="10" y="95" width="120" height="60" rx="10" class="fx-box"/><text x="70" y="130" class="fx-t">Famílias</text>
        <rect x="390" y="95" width="120" height="60" rx="10" class="fx-box"/><text x="450" y="130" class="fx-t">Firmas</text>
        <rect x="170" y="8" width="180" height="46" rx="10" class="fx-mk"/><text x="260" y="28" class="fx-s">Mercado de</text><text x="260" y="44" class="fx-s">bens e serviços</text>
        <rect x="170" y="196" width="180" height="46" rx="10" class="fx-mk"/><text x="260" y="216" class="fx-s">Mercado dos fatores</text><text x="260" y="232" class="fx-s">trabalho, terra, capital</text>
        <path d="M70 95 Q70 31 170 31" class="fx-money" marker-end="url(#ar)"/><text x="40" y="58" class="fx-l money">Gasto (=PIB)</text>
        <path d="M350 31 Q450 31 450 95" class="fx-money" marker-end="url(#ar)"/><text x="415" y="58" class="fx-l money">Receita (=PIB)</text>
        <path d="M450 155 Q450 219 350 219" class="fx-money" marker-end="url(#ar)"/><text x="405" y="196" class="fx-l money">Salários, aluguel, lucro</text>
        <path d="M170 219 Q70 219 70 155" class="fx-money" marker-end="url(#ar)"/><text x="30" y="196" class="fx-l money">Renda (=PIB)</text>
        <text x="260" y="120" class="fx-c">Os 4 fluxos têm</text><text x="260" y="138" class="fx-c">o mesmo valor: o PIB</text>
      </svg>
    </div>
    <div class="grid2">
      <div class="box"><b>Famílias</b>: donas dos fatores de produção (trabalho, terra, capital, recursos naturais). Vendem/alugam esses fatores para as firmas e recebem <b>salário, aluguel, juros e lucro</b>. Compram e consomem bens e serviços.</div>
      <div class="box"><b>Firmas</b>: contratam fatores, produzem e vendem bens e serviços.</div>
    </div>
    <p class="muted">O diagrama simples <b>omite</b>: o <b>governo</b> (cobra impostos, compra bens e serviços), o <b>sistema financeiro</b> (junta a oferta de fundos dos poupadores com a demanda dos tomadores) e o <b>setor externo</b> (troca bens, serviços, ativos e moedas com os residentes).</p>
  </section>

  <section class="sec">
    <h3><span class="n">2</span> A definição de PIB, palavra por palavra</h3>
    <table class="t">
      <thead><tr><th>Trecho</th><th>O que quer dizer</th><th>Como cai na prova</th></tr></thead>
      <tbody>
        <tr><td><b>valor de mercado</b></td><td>Tudo vira R$ usando preços de mercado. O que não tem preço de mercado fica fora.</td><td>Cozinhar o próprio jantar, cuidar da casa → <span class="no">não entra</span></td></tr>
        <tr><td><b>finais</b></td><td>Só bens do usuário final. Os intermediários já estão embutidos no preço do final.</td><td>Farinha R$ 2.000 + pão R$ 5.000 → PIB = <b>R$ 5.000</b> (somar seria dupla contagem)</td></tr>
        <tr><td><b>bens e serviços</b></td><td>Tangíveis (smartphone, bicicleta, cerveja) e intangíveis (limpeza, concertos, consertos).</td><td>Corte de cabelo <span class="ok">entra</span> (consumo de serviço)</td></tr>
        <tr><td><b>produzidos</b></td><td>Apenas produção do período corrente.</td><td>Carro usado de 2022 vendido em 2026 → <span class="no">não entra</span> em 2026</td></tr>
        <tr><td><b>em uma economia</b></td><td>Critério <b>geográfico</b>: dentro das fronteiras, seja a empresa nacional ou estrangeira.</td><td>Fábrica estrangeira no Brasil <span class="ok">entra</span> no PIB brasileiro</td></tr>
        <tr><td><b>em dado período</b></td><td>Normalmente um ano ou um trimestre (3 meses).</td><td>—</td></tr>
      </tbody>
    </table>
  </section>

  <section class="sec">
    <h3><span class="n">3</span> Os componentes: <span class="f">\\(Y = C + I + G + EL\\)</span></h3>
    <div class="grid2">
      <div class="box"><b class="c1">C — Consumo</b><br>Gasto das famílias em bens tangíveis e serviços intangíveis. Carro novo comprado por família = C (não é I!).</div>
      <div class="box"><b class="c2">I — Investimento</b><br>Gasto em bens que serão usados para produzir mais no futuro: <b>bens de capital</b> (máquinas, ferramentas), <b>estruturas</b> (fábricas, escritórios, <b>casas novas</b>, estradas) e <b>estoques</b> (produziu e não vendeu).</div>
      <div class="box"><b class="c3">G — Compras do governo</b><br>Compras de bens e serviços pelos governos <b>federal, estadual e municipal</b>. <b>Exclui transferências</b> (INSS, Bolsa Família): elas não compram nada novo e, quando gastas, já aparecem em C — contar duas vezes seria dupla contagem.</div>
      <div class="box"><b class="c4">EL — Exportações líquidas</b><br>EL = X − M. Exportação = compra de estrangeiros de bens produzidos aqui. Importação = a parte de C, I e G gasta com bens de fora — por isso é subtraída.</div>
    </div>
    <h4>PIB do Brasil em 2023 (IBGE) — total ≈ R$ 10,86 trilhões</h4>
    <div class="bars" data-bars='[["Consumo das famílias",63.3,"c1"],["Gastos do governo",18.2,"c3"],["Investimento (FBCF + estoques)",16.1,"c2"],["Exportações",18.1,"c4"],["Importações (−)",-15.7,"neg"]]'></div>
    <div class="trap"><b>Pegadinha das importações:</b> importar <b>não diminui</b> a produção interna. O vinho chileno comprado por uma família entra em C <b>e</b> sai em M: efeito líquido zero. Só quando o enunciado diz “mantendo C, I e G constantes” (Q15) é que um aumento de M reduz Y contabilmente.</div>
  </section>

  <section class="sec">
    <h3><span class="n">4</span> PIB nominal, PIB real e deflator</h3>
    <div class="grid3">
      <div class="box"><b>PIB nominal</b><div class="f">\\(\\sum P_{\\text{atual}} \\times Q_{\\text{atual}}\\)</div>Preços correntes. Muda por <b>preço e quantidade</b>.</div>
      <div class="box"><b>PIB real</b><div class="f">\\(\\sum P_{\\text{base}} \\times Q_{\\text{atual}}\\)</div>Preços do ano-base. Muda <b>só por quantidade</b> (corrigido pela inflação).</div>
      <div class="box"><b>Deflator</b><div class="f">\\(100 \\times \\dfrac{\\text{Nominal}}{\\text{Real}}\\)</div>Medida do nível geral de preços. Inflação = variação % do deflator.</div>
    </div>
    <div class="ex"><b>Exemplo dos slides (ano-base 2018):</b>
      <table class="t sm">
        <thead><tr><th>Ano</th><th>Pizza (P, Q)</th><th>Leite (P, Q)</th><th>Nominal</th><th>Real</th><th>Deflator</th><th>Inflação</th><th>Cresc. real</th></tr></thead>
        <tbody>
          <tr><td>2018</td><td>$10 · 400</td><td>$2,00 · 1000</td><td>6.000</td><td>6.000</td><td>100,0</td><td>—</td><td>—</td></tr>
          <tr><td>2019</td><td>$11 · 500</td><td>$2,50 · 1100</td><td>8.250</td><td>7.200</td><td>114,6</td><td>14,6%</td><td>20,0%</td></tr>
          <tr><td>2020</td><td>$12 · 600</td><td>$3,00 · 1200</td><td>10.800</td><td>8.400</td><td>128,6</td><td>12,2%</td><td>16,7%</td></tr>
        </tbody>
      </table>
      Real 2019 = 10×500 + 2×1100 = 7.200 (preços de 2018, quantidades de 2019). O nominal cresceu 37,5%, mas só 20% foi produção de verdade.
    </div>
    <div class="grid2">
      <div class="box"><b>Truque 1 — achar o real a partir do deflator</b><div class="f">\\(\\text{PIB real} = 100 \\times \\dfrac{\\text{Nominal}}{\\text{Deflator}}\\)</div>Q18: \\(\\dfrac{900}{1{,}20} = 750\\) e \\(\\dfrac{1.080}{1{,}35} = 800\\) → cresceu 6,7%.</div>
      <div class="box"><b>Truque 2 — inflação pelo deflator</b><div class="f">\\(\\pi = \\dfrac{D_2 - D_1}{D_1}\\)</div>Q12: \\(\\dfrac{126 - 120}{120} = 5\\%\\) (e não 6%!).</div>
    </div>
    <div class="extra"><b>Complemento:</b> (1 + crescimento nominal) = (1 + crescimento real) × (1 + inflação). Para valores pequenos, <b>nominal ≈ real + inflação</b>. Na Q13 (nominal 12%, real 3%) a inflação implícita é ≈ 9% (exato: \\(\\dfrac{1{,}12}{1{,}03} - 1 \\approx 8{,}7\\%\\)).</div>
  </section>

  <section class="sec">
    <h3><span class="n">5</span> PIB e bem-estar</h3>
    <p><b>PIB real per capita</b> é um dos principais indicadores do <b>padrão médio de vida</b>, mas não é medida perfeita de bem-estar.</p>
    <div class="grid2">
      <div class="box"><b class="no">O PIB não mede:</b><ul><li>a qualidade ambiental</li><li>o tempo de lazer</li><li>atividades sem mercado (trabalho doméstico, voluntariado)</li><li>a distribuição da renda</li></ul></div>
      <div class="box"><b class="ok">Por que importa mesmo assim:</b><ul><li>PIB maior dá recursos para escolas, saúde, meio ambiente</li><li>Correlaciona com <b>expectativa de vida</b> (R² ≈ 0,70), <b>capital humano</b> (R² ≈ 0,65) e <b>complexidade econômica — ECI</b> (R² ≈ 0,62), dados de 2017</li><li>As curvas são logarítmicas: o ganho de bem-estar por real a mais é maior nos países pobres</li></ul></div>
    </div>
  </section>`,
  pegadinhas: [
    "Comprar ações ou títulos NÃO é investimento (I). É aplicação de poupança.",
    "Carro novo comprado por família é Consumo (C), não Investimento — mesmo sendo bem durável. Mas casa nova é Investimento.",
    "Produziu e não vendeu? Entra no PIB do ano como investimento em estoques.",
    "INSS, Bolsa Família e outras transferências ficam fora de G.",
    "Bem usado não entra no PIB do ano da revenda (já entrou quando foi produzido).",
    "Fábrica estrangeira no Brasil entra no PIB brasileiro: o critério é onde se produz.",
    "Inflação pelo deflator é variação percentual: (126−120)/120 = 5%, não 6%.",
    "Importação de bem de consumo: entra em C e sai em M. Efeito líquido zero no PIB."
  ],
  cards: [
    ["Definição de PIB", "Valor de mercado de todos os bens e serviços finais produzidos em uma economia (dentro das fronteiras) em dado período."],
    ["Por que renda = despesa?", "Cada real que um comprador gasta é um real de receita para o vendedor."],
    ["Bem final × intermediário", "Final serve ao usuário final; intermediário é insumo de outro bem. Só o final entra (evita dupla contagem)."],
    ["O que entra em I?", "Bens de capital (máquinas), estruturas (fábricas, casas novas, estradas) e variação de estoques. Ativos financeiros não."],
    ["Por que transferências ficam fora de G?", "Não são compra de bens/serviços pelo governo. Quando o beneficiário gasta, o gasto aparece em C (contar em G seria dupla contagem)."],
    ["PIB nominal × real", "Nominal: preços correntes (varia com P e Q). Real: preços do ano-base (varia só com Q)."],
    ["Deflator do PIB", "\\(100 \\times \\dfrac{\\text{PIB nominal}}{\\text{PIB real}}\\). Mede o nível geral de preços; sua variação % é uma medida de inflação."],
    ["Como achar o PIB real com o deflator?", "\\(\\text{PIB real} = 100 \\times \\dfrac{\\text{PIB nominal}}{\\text{deflator}}\\)"],
    ["4 coisas que o PIB não mede", "Qualidade ambiental, lazer, atividades sem mercado, distribuição da renda."],
    ["Peso de C no PIB brasileiro (2023)", "≈ 63% (G ≈ 18%, I ≈ 16%, X ≈ 18%, M ≈ −16%)."]
  ]
},
/* ============================================================ AULA 2 */
{
  id: "Aula 2",
  cor: "#34d399",
  titulo: "Poupança, Investimento e Sistema Financeiro",
  cap: "Cap. 26 Mankiw",
  tema: "Poupança privada e pública, fundos emprestáveis e crowding-out",
  lab: "fe",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> a <b>poupança</b> (privada + pública) é a oferta de recursos; o <b>investimento</b> (compra de capital novo) é a demanda; a <b>taxa de juros real</b> equilibra as duas no mercado de fundos emprestáveis. Um <b>déficit</b> do governo reduz a poupança, sobe os juros e <b>expulsa investimento</b> (crowding-out).</div>

  <section class="sec">
    <h3><span class="n">1</span> Os três tipos de poupança</h3>
    <div class="grid3">
      <div class="box"><b class="c1">Poupança privada</b><div class="f">\\(S_{\\text{priv}} = Y - T - C\\)</div>O que sobra da renda das famílias depois de impostos e consumo.</div>
      <div class="box"><b class="c3">Poupança pública</b><div class="f">\\(S_{\\text{pub}} = T - G\\)</div>T &gt; G: <b>superávit</b>. T &lt; G: <b>déficit</b> (poupança pública negativa).</div>
      <div class="box"><b class="c2">Poupança nacional</b><div class="f">\\(S = (Y - T - C) + (T - G) = Y - C - G\\)</div>A parte da renda que não vai para consumo nem compras do governo.</div>
    </div>
    <div class="ex"><b>Por que S = I na economia fechada?</b> Partindo de Y = C + I + G (sem EL) e isolando I: <span class="f">\\(I = Y - C - G\\)</span>. Mas Y − C − G é exatamente S. Logo <b>S = I</b> — é uma identidade contábil.<br><br>
    <b>Exemplo (Q15):</b> Y = 3.000, T = 700, C = 1.900, G = 800 → S<sub>priv</sub> = 400; S<sub>pub</sub> = −100 (déficit); S = 300 = I.</div>
  </section>

  <section class="sec">
    <h3><span class="n">2</span> Poupança × investimento: a palavra muda de sentido</h3>
    <div class="grid2">
      <div class="box"><b>É poupança</b> (o que fazer com a renda que sobrou):<ul><li>comprar ações ou títulos corporativos</li><li>aplicar em CDB no banco</li><li>comprar cotas de fundo mútuo</li><li>deixar na poupança ou conta corrente</li></ul></div>
      <div class="box"><b>É investimento</b> (compra de capital novo):<ul><li>GM gasta US$ 250 mi numa fábrica nova em São Caetano do Sul</li><li>você compra um PC de R$ 5.000 para o seu negócio</li><li>uma família constrói uma casa nova</li></ul></div>
    </div>
  </section>

  <section class="sec">
    <h3><span class="n">3</span> O mercado de fundos emprestáveis</h3>
    <p>Hipóteses: existe <b>um só</b> mercado financeiro; todos os poupadores depositam nele, todos os tomadores pegam empréstimo nele, e há <b>uma só taxa de juros</b> — que é ao mesmo tempo o <b>retorno</b> de quem poupa e o <b>custo</b> de quem toma emprestado.</p>
    <div class="grid2">
      <div class="box"><b>Oferta = Poupança (S)</b> — inclinação <b>positiva</b>: juros maiores tornam poupar mais atraente. Poupança pública positiva aumenta a oferta; negativa (déficit) reduz.</div>
      <div class="box"><b>Demanda = Investimento (I)</b> — inclinação <b>negativa</b>: juros menores barateiam o financiamento de máquinas, fábricas e casas novas.</div>
    </div>
    <p>Se r está <b>abaixo</b> do equilíbrio, falta dinheiro (demanda &gt; oferta) e r <b>sobe</b>. Se está acima, sobra dinheiro e r cai. No equilíbrio, S = I.</p>
    <p class="cta-lab">🧪 Teste os três choques no <a href="#" data-goto="lab">Laboratório desta aula</a>.</p>
  </section>

  <section class="sec">
    <h3><span class="n">4</span> As três políticas</h3>
    <table class="t">
      <thead><tr><th>Política</th><th>Curva que mexe</th><th>Juros r</th><th>Quantidade (S = I)</th></tr></thead>
      <tbody>
        <tr><td>1. Incentivo fiscal à poupança</td><td>Oferta (S) → direita</td><td class="dn">cai</td><td class="up">sobe</td></tr>
        <tr><td>2. Crédito fiscal ao investimento</td><td>Demanda (I) → direita</td><td class="up">sobe</td><td class="up">sobe</td></tr>
        <tr><td>3. Déficit orçamentário</td><td>Oferta (S) → esquerda</td><td class="up">sobe</td><td class="dn">cai</td></tr>
      </tbody>
    </table>
    <div class="chain"><span>Déficit (G &gt; T)</span><span>S<sub>pub</sub> ↓</span><span>S ↓ (oferta ←)</span><span>r ↑</span><span>I ↓ = crowding-out</span><span>menos capital, menos crescimento futuro</span></div>
    <div class="trap"><b>Atenção:</b> o déficit mexe na <b>oferta</b> (é poupança negativa do governo), não na demanda. E as políticas 1 e 2 aumentam a quantidade, mas com efeitos opostos sobre r.</div>
  </section>

  <section class="sec">
    <h3><span class="n">5</span> Déficit, dívida e crescimento</h3>
    <ul>
      <li>O governo financia déficits <b>vendendo títulos</b> (tomando emprestado). Déficits persistentes → dívida crescente.</li>
      <li>A melhor medida de endividamento é a <b>relação dívida/PIB</b>: compara a dívida com a capacidade de arrecadar.</li>
      <li>Nos EUA (1790–2007), a dívida/PIB sobe nas <b>guerras</b> (Independência, Civil, 1ª e 2ª Guerras — o pico é na 2ª Guerra) e cai em tempos de paz, até o início dos anos 1980.</li>
      <li>Conclusão dos slides: os gastos do governo <b>talvez tenham que ser contracíclicos</b> — tema que volta na Aula 7.2 e no estudo empírico.</li>
    </ul>
  </section>`,
  pegadinhas: [
    "Poupança pública = T − G. Se T < G, ela é NEGATIVA (déficit), não 'zero'.",
    "Déficit desloca a OFERTA de fundos para a esquerda (não a demanda).",
    "Incentivo à poupança: r cai e Q sobe. Incentivo ao investimento: r sobe e Q sobe.",
    "Juros abaixo do equilíbrio → excesso de DEMANDA por fundos → r sobe.",
    "Comprar ações, CDB ou fundo é poupança; investimento é capital novo (máquina, fábrica, casa nova)."
  ],
  cards: [
    ["Poupança privada", "\\(S_{\\text{priv}} = Y - T - C\\)"],
    ["Poupança pública", "\\(S_{\\text{pub}} = T - G\\) (positiva = superávit; negativa = déficit)."],
    ["Poupança nacional", "\\(S = Y - C - G = S_{\\text{priv}} + S_{\\text{pub}}\\). Na economia fechada, \\(S = I\\)."],
    ["Quem oferta e quem demanda fundos emprestáveis?", "Oferta: poupança (S), inclinação positiva. Demanda: investimento (I), inclinação negativa."],
    ["Por que a oferta de fundos sobe com r?", "r é o retorno da poupança: juros maiores tornam poupar mais atraente."],
    ["Por que a demanda de fundos cai com r?", "r é o custo do empréstimo: juros maiores inviabilizam projetos de investimento."],
    ["Crowding-out", "O governo toma emprestado para cobrir o déficit, a poupança nacional cai, r sobe e o investimento privado cai."],
    ["Por que déficits persistentes preocupam?", "Reduzem o investimento → menos capital → menor crescimento e padrão de vida futuro."],
    ["Melhor medida de endividamento", "Relação dívida/PIB."]
  ]
},
/* ============================================================ AULA 3 */
{
  id: "Aula 3",
  cor: "#fbbf24",
  titulo: "O Sistema Monetário",
  cap: "Cap. 29 Mankiw",
  tema: "Moeda, reservas fracionárias, multiplicador e ferramentas do BACEN",
  lab: "mult",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> moeda é o que as pessoas usam para comprar coisas umas das outras. Os bancos, ao emprestar parte dos depósitos, <b>criam moeda</b> (mas não riqueza): cada R$ 1 de reservas vira até <b>\\(\\dfrac{1}{R}\\)</b> reais. O BACEN controla a oferta de moeda principalmente com <b>operações de mercado aberto</b>.</div>

  <section class="sec">
    <h3><span class="n">1</span> Por que a moeda existe</h3>
    <p>Sem moeda, o comércio seria <b>escambo</b> (troca direta de um bem por outro). Toda transação exigiria uma <b>dupla coincidência de desejos</b> — a chance improvável de que eu tenha o que você quer <b>e</b> você tenha o que eu quero. Gastaríamos muito tempo procurando parceiros: um enorme desperdício. A moeda elimina essa busca.</p>
    <div class="grid3">
      <div class="box"><b class="c1">Meio de troca</b><br>O que o comprador entrega ao vendedor para pagar bens e serviços.</div>
      <div class="box"><b class="c2">Unidade de conta</b><br>Padrão usado para <b>anunciar preços e registrar débitos</b>.</div>
      <div class="box"><b class="c3">Reserva de valor</b><br>Transfere poder de compra do presente para o futuro.</div>
    </div>
    <div class="grid2">
      <div class="box"><b>Moeda-mercadoria</b>: tem <b>valor intrínseco</b> (moedas de ouro e prata).</div>
      <div class="box"><b>Moeda fiduciária</b>: <b>sem valor intrínseco</b>, vale por <b>decreto governamental</b> (US$, R$).</div>
    </div>
  </section>

  <section class="sec">
    <h3><span class="n">2</span> Oferta de moeda e agregados</h3>
    <ul>
      <li><b>Moeda corrente</b>: notas e moedas nas mãos do público (não bancário).</li>
      <li><b>Depósitos à vista</b>: saldos em conta corrente que o depositante pode sacar a qualquer momento.</li>
    </ul>
    <div class="grid2">
      <div class="box"><b>M1</b> = papel-moeda em poder do público (PMPP) + depósitos à vista<br><span class="muted">≈ R$ 629,5 bi (abr/2026)</span></div>
      <div class="box"><b>M2</b> = M1 + poupança + títulos privados emitidos pelo SFN<br><span class="muted">≈ R$ 7,61 tri (mai/2026)</span></div>
    </div>
    <p class="muted">Para o modelo, a diferença entre M1 e M2 não importa.</p>
    <p><b>Banco Central</b>: supervisiona o sistema bancário e regula a quantidade de moeda. <b>Política monetária</b>: a definição da oferta de moeda pelo BC (no Brasil, o BACEN).</p>
  </section>

  <section class="sec">
    <h3><span class="n">3</span> Bancos, reservas e conta-T</h3>
    <p>No sistema de <b>reservas fracionárias</b>, os bancos guardam uma fração dos depósitos como reserva e emprestam o resto. O BACEN fixa a <b>reserva compulsória</b> (o mínimo); os bancos podem guardar mais se quiserem (<b>reservas excedentes</b>).</p>
    <div class="grid2">
      <div class="tconta">
        <div class="tc-h">Banco X</div>
        <div class="tc-a"><b>Ativos</b><br>Reservas R$ 10<br>Empréstimos R$ 90</div>
        <div class="tc-p"><b>Passivos</b><br>Depósitos R$ 100</div>
      </div>
      <div class="box"><b>Como lembrar:</b> o depósito é uma <b>dívida do banco com você</b> → passivo. O empréstimo é um <b>direito do banco</b> de receber → ativo.<div class="f">\\(R = \\dfrac{\\text{Reservas}}{\\text{Depósitos}} = \\dfrac{10}{100} = 10\\%\\)</div></div>
    </div>
  </section>

  <section class="sec">
    <h3><span class="n">4</span> Como os bancos criam moeda: os 3 casos com R$ 100</h3>
    <table class="t">
      <thead><tr><th>Caso</th><th>O que acontece</th><th>Oferta de moeda</th></tr></thead>
      <tbody>
        <tr><td>1. Sem bancos</td><td>Público guarda os R$ 100 em espécie</td><td><b>R$ 100</b></td></tr>
        <tr><td>2. Reserva de 100%</td><td>Público deposita tudo; banco guarda tudo e não empresta. PMPP 0 + depósitos 100</td><td><b>R$ 100</b> (banco não interfere)</td></tr>
        <tr><td>3. Reservas fracionárias (R = 10%)</td><td>Banco X empresta R$ 90. Depositante tem R$ 100 em depósito <b>e</b> tomador tem R$ 90 em moeda</td><td><b>R$ 190</b> já na 1ª rodada…</td></tr>
      </tbody>
    </table>
    <div class="chain"><span>Depósito 100</span><span>empresta 90</span><span>Banco Y: empresta 81</span><span>Banco Z: empresta 72,90</span><span>⋯</span><span>Total = R$ 1.000</span></div>
    <div class="grid2">
      <div class="box"><b>Multiplicador monetário</b><div class="f">\\(m = \\dfrac{1}{R}\\)</div>R = 10% → m = 10 → R$ 100 de reservas viram R$ 1.000 de moeda.<br><span class="muted">É a soma \\(100 + 90 + 81 + \\dots = \\dfrac{100}{1 - 0{,}9}\\).</span></div>
      <div class="box"><b>Cria moeda, não riqueza:</b> o tomador recebe R$ 90 em moeda (ativo que conta na oferta de moeda), mas também uma dívida de R$ 90 (passivo que não reduz a oferta de moeda).</div>
    </div>
    <table class="t sm"><thead><tr><th>R</th><th>100%</th><th>25%</th><th>20%</th><th>10%</th><th>5%</th></tr></thead><tbody><tr><td><b>\\(m = \\dfrac{1}{R}\\)</b></td><td>1</td><td>4</td><td>5</td><td>10</td><td>20</td></tr></tbody></table>
  </section>

  <section class="sec">
    <h3><span class="n">5</span> As 3 ferramentas do BACEN</h3>
    <table class="t">
      <thead><tr><th>Ferramenta</th><th>Para AUMENTAR a moeda</th><th>Para REDUZIR</th><th>Uso</th></tr></thead>
      <tbody>
        <tr><td><b>Mercado aberto</b> (compra/venda de títulos públicos)</td><td>BACEN <b>compra</b> títulos, paga em R$ → reservas ↑ → mais empréstimos</td><td>BACEN <b>vende</b> títulos → tira R$ de circulação</td><td>A <b>mais usada</b>: fácil de controlar e conduzir</td></tr>
        <tr><td><b>Reservas compulsórias</b></td><td>Reduz o compulsório → R ↓ → m ↑</td><td>Aumenta o compulsório</td><td>Bem menos usada: mudanças frequentes geram incerteza para os bancos</td></tr>
        <tr><td><b>Taxa de desconto</b> (juros do BACEN aos bancos)</td><td>Taxa baixa → bancos pegam mais emprestado e emprestam mais</td><td>Taxa alta</td><td>Principalmente em <b>crises</b>; fora isso, rara</td></tr>
      </tbody>
    </table>
    <div class="trap"><b>Macete:</b> BACEN <b>compra</b> título = <b>paga</b> com dinheiro = injeta moeda. BACEN <b>vende</b> título = <b>recebe</b> dinheiro = enxuga moeda.</div>
  </section>

  <section class="sec">
    <h3><span class="n">6</span> Limites do controle da moeda</h3>
    <ul>
      <li>Se as <b>famílias guardam mais dinheiro em espécie</b>, os bancos têm menos reservas, emprestam menos e a oferta de moeda cai.</li>
      <li>Se os <b>bancos guardam reservas além do mínimo</b>, emprestam menos e a oferta de moeda cai (Q20).</li>
      <li><b>Corrida bancária</b>: com medo de falência, todos sacam ao mesmo tempo. Com reservas fracionárias, o banco não consegue pagar todos e pode fechar; os bancos passam a reter mais reservas. R sobe e o processo de criação de moeda se inverte.</li>
      <li>Mesmo assim, o BACEN consegue <b>compensar</b> esses comportamentos e manter um controle bastante preciso.</li>
    </ul>
  </section>`,
  pegadinhas: [
    "Depósitos são PASSIVOS do banco; empréstimos e reservas são ATIVOS.",
    "Com 100% de reservas, o multiplicador é 1: os bancos não criam moeda.",
    "Compulsório maior → R maior → multiplicador \\(\\left(\\dfrac{1}{R}\\right)\\) MENOR → menos moeda.",
    "Comprar títulos aumenta a oferta de moeda; vender títulos reduz.",
    "Bancos criam moeda, mas não riqueza (o tomador fica com uma dívida do mesmo valor).",
    "Unidade de conta = anunciar preços e registrar débitos. Reserva de valor = transferir poder de compra no tempo."
  ],
  cards: [
    ["3 funções da moeda", "Meio de troca, unidade de conta e reserva de valor."],
    ["Dupla coincidência de desejos", "Problema do escambo: precisa que cada parte tenha exatamente o que a outra quer."],
    ["Moeda fiduciária", "Sem valor intrínseco, vale por decreto do governo (R$, US$). Oposto: moeda-mercadoria (ouro)."],
    ["M1 e M2", "M1 = papel-moeda em poder do público + depósitos à vista. M2 = M1 + poupança + títulos privados do SFN."],
    ["Razão de reserva R", "\\(R = \\dfrac{\\text{Reservas}}{\\text{Depósitos}}\\)"],
    ["Multiplicador monetário", "\\(m = \\dfrac{1}{R}\\). Com R = 10%, R$ 100 de reservas sustentam R$ 1.000 de moeda."],
    ["Ferramenta mais usada pelo BACEN", "Operações de mercado aberto (compra e venda de títulos públicos)."],
    ["Taxa de desconto", "Juros que o BACEN cobra ao emprestar aos bancos. Usada principalmente em crises."],
    ["Corrida bancária e oferta de moeda", "Saques em massa + bancos retendo reservas → R sobe → oferta de moeda cai."],
    ["Reserva compulsória × excedente", "Compulsória é o mínimo exigido pelo BACEN; excedente é o que o banco guarda a mais por vontade própria."]
  ]
},
/* ============================================================ AULA 4 */
{
  id: "Aula 4",
  cor: "#f472b6",
  titulo: "Macroeconomia Aberta — Conceitos Básicos",
  cap: "Cap. 31 Mankiw",
  tema: "EL, IEL, câmbio nominal e real, paridade do poder de compra",
  lab: "cambio",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> uma economia aberta troca <b>bens</b> (medido por EL) e <b>ativos</b> (medido por IEL) com o mundo, e os dois fluxos são iguais: <b>EL = IEL</b>. O câmbio <b>nominal</b> é o preço de uma moeda em outra; o câmbio <b>real</b> é o preço dos bens de um país em bens do outro.</div>

  <section class="sec">
    <h3><span class="n">1</span> Fluxo de bens: exportações líquidas (EL)</h3>
    <p><b>Economia aberta</b>: interage livremente com outras economias. <b>Exportações</b>: produzidas aqui e vendidas lá fora. <b>Importações</b>: produzidas lá fora e vendidas aqui. <b>EL = X − M</b> (também chamada de <b>balança comercial</b>).</p>
    <div class="grid3">
      <div class="box"><b class="ok">Superávit comercial</b><br>X &gt; M (EL &gt; 0)</div>
      <div class="box"><b class="no">Déficit comercial</b><br>M &gt; X (EL &lt; 0)</div>
      <div class="box"><b>Equilíbrio comercial</b><br>X = M (EL = 0)</div>
    </div>
    <div class="box"><b>6 variáveis que influenciam EL:</b> (1) preferências por bens nacionais × estrangeiros; (2) preços dos bens aqui e lá fora; (3) renda dos consumidores aqui e lá fora; (4) taxa de câmbio; (5) custos de transporte; (6) políticas governamentais.</div>
  </section>

  <section class="sec">
    <h3><span class="n">2</span> Fluxo de ativos: investimento externo líquido (IEL)</h3>
    <div class="f big">IEL = (ativos estrangeiros comprados por residentes) − (ativos nacionais comprados por estrangeiros)</div>
    <div class="grid2">
      <div class="box"><b>IEL &gt; 0 → saída de capitais</b><br>Brasileiros compram mais lá fora do que estrangeiros compram aqui.</div>
      <div class="box"><b>IEL &lt; 0 → entrada de capitais</b><br>Estrangeiros compram mais aqui do que brasileiros lá fora.</div>
    </div>
    <div class="grid2">
      <div class="box"><b>Investimento externo direto</b>: o residente <b>opera ativamente</b> o negócio lá fora. Ex.: Magazine Luiza abre uma loja no Uruguai.</div>
      <div class="box"><b>Investimento em carteira</b>: o residente compra <b>ações ou títulos</b> de empresa estrangeira, fornecendo fundos sem administrar.</div>
    </div>
    <div class="box"><b>4 variáveis que influenciam IEL:</b> (1) juros reais pagos nos ativos externos; (2) juros reais pagos nos ativos internos; (3) riscos percebidos de manter ativos externos; (4) políticas do governo sobre a compra de ativos internos por estrangeiros.</div>
    <div class="extra"><b>Complemento — por que EL = IEL?</b> Toda exportação é paga com algum ativo. Se a Embraer vende um avião aos EUA e recebe dólares, o Brasil passou a ter um ativo estrangeiro (os dólares, ou o que for comprado com eles). Exportar mais do que importar (EL &gt; 0) significa, necessariamente, acumular ativos lá fora (IEL &gt; 0). Na Q19: X = 400, M = 250 → EL = 150 = IEL.</div>
  </section>

  <section class="sec">
    <h3><span class="n">3</span> Câmbio nominal</h3>
    <p>A taxa à qual se troca a moeda de um país pela de outro. Nos slides: <b>moeda nacional por unidade de moeda estrangeira</b> (ex.: 5 R$/US$).</p>
    <div class="grid2">
      <div class="box"><b class="ok">Valorização (apreciação)</b><br>A moeda nacional compra <b>mais</b> moeda estrangeira. Real mais forte. Ex.: de 2 R$/US$ para 1 R$/US$.</div>
      <div class="box"><b class="no">Desvalorização (depreciação)</b><br>A moeda nacional compra <b>menos</b> moeda estrangeira. Real mais fraco. Ex.: de 1 R$/US$ para 2 R$/US$.</div>
    </div>
  </section>

  <section class="sec">
    <h3><span class="n">4</span> Câmbio real</h3>
    <div class="f big">\\(E = \\dfrac{e \\times P^{*}}{P}\\)</div>
    <p>P = preço doméstico (em R$); P* = preço externo (em moeda estrangeira); e = câmbio nominal. Para muitos bens, P é um índice como o IPCA e P* o índice de preços dos EUA.</p>
    <div class="ex"><b>Exemplo do Big Mac:</b> US$ 3 nos EUA, R$ 30 no Brasil, e = 5 R$/US$.<br>
      e × P* = 5 × 3 = R$ 15 (preço em reais do Big Mac americano).<br>
      \\(E = \\dfrac{15}{30}\\) = <b>0,5 Big Mac brasileiro por Big Mac americano</b>.<br>
      Leitura: para comprar um Big Mac nos EUA, o brasileiro abre mão do que compraria 0,5 Big Mac aqui → o lanche americano está “barato” para nós.</div>
    <p>Se o câmbio real do Brasil se <b>aprecia</b>, os bens brasileiros ficam <b>mais caros</b> em relação aos estrangeiros (exportamos menos, importamos mais).</p>
  </section>

  <section class="sec">
    <h3><span class="n">5</span> Lei do preço único e PPC</h3>
    <p><b>Lei do preço único</b>: um bem deve custar o mesmo em todo lugar. Café a R$ 4 em São Paulo e R$ 5 em Buenos Aires, sem custo de transporte → <b>arbitragem</b>: compra em SP, vende em BA. Isso sobe o preço em SP e derruba em BA até igualar.</p>
    <p><b>Paridade do Poder de Compra (PPC)</b>: uma unidade de qualquer moeda deveria comprar a mesma quantidade de bens em todos os países. Implica que o câmbio nominal se ajusta para igualar o preço da cesta em todo lugar:</p>
    <div class="f big">\\(e = \\dfrac{P^{*}}{P}\\)</div>
    <p>Se a inflação é maior na Argentina que no Brasil, P* sobe mais rápido que P, <b>e aumenta</b> — o real valoriza contra o peso.</p>
    <div class="grid2">
      <div class="box"><b>Limitação 1 — bens não comercializáveis</b> (non-tradables): corte de cabelo, massagem, troca de pneu. Não dá para arbitrar.</div>
      <div class="box"><b>Limitação 2 — bens não são substitutos perfeitos</b>: preferências e curvas de demanda diferem entre países, e os preços refletem isso.</div>
    </div>
  </section>

  <section class="sec warn">
    <h3>⚠️ A maior pegadinha do curso: as duas convenções do câmbio</h3>
    <p>Os slides usam duas maneiras de medir o câmbio, e elas andam em <b>sentidos opostos</b>:</p>
    <table class="t">
      <thead><tr><th></th><th>Convenção A — “R$ por US$”</th><th>Convenção B — Mankiw</th></tr></thead>
      <tbody>
        <tr><td>Câmbio nominal</td><td>e = reais por dólar (5 R$/US$)</td><td>e = moeda estrangeira por real</td></tr>
        <tr><td>Câmbio real</td><td>\\(E = \\dfrac{e \\cdot P^{*}}{P}\\) = bens BR por bem estrangeiro (Big Mac: 0,5)</td><td>E = bens estrangeiros por bem BR</td></tr>
        <tr><td>Se e ou E <b>sobe</b>…</td><td>o real <b class="no">desvaloriza</b></td><td>o real <b class="ok">valoriza</b></td></tr>
        <tr><td>Onde aparece</td><td>Slides de câmbio nominal e do Big Mac (Aula 4)</td><td>Slide da PPC (\\(e = \\dfrac{P^{*}}{P}\\)) e <b>toda a Aula 5</b></td></tr>
      </tbody>
    </table>
    <p><b>Na prova:</b> nas contas (Q11, Q15), aplique a fórmula exatamente como o enunciado der. Para dizer se “aumento” é apreciação ou depreciação, veja qual convenção a questão usa. Na Aula 5 vale sempre: <b>E ↑ = apreciação real do real</b>.</p>
    <p class="muted">Por que a PPC dá \\(e = \\dfrac{P^{*}}{P}\\)? Na convenção B, R$ 1 compra \\(\\dfrac{1}{P}\\) bens aqui e \\(\\dfrac{e}{P^{*}}\\) bens lá fora. Igualando: \\(e = \\dfrac{P^{*}}{P}\\). Na convenção A, a mesma ideia daria \\(e = \\dfrac{P}{P^{*}}\\) (no Big Mac: \\(\\dfrac{30}{3} = 10\\) R$/US$, o inverso de 0,1 US$/R$).</p>
  </section>`,
  pegadinhas: [
    "IEL > 0 é SAÍDA de capitais; IEL < 0 é ENTRADA.",
    "Abrir filial/loja no exterior = investimento direto. Comprar ações/títulos estrangeiros = carteira.",
    "Câmbio nominal = preço relativo das MOEDAS. Câmbio real = preço relativo dos BENS.",
    "Duas convenções de câmbio andam em sentidos opostos. Na Aula 5 (Mankiw), E ↑ = apreciação.",
    "A PPC falha para non-tradables (corte de cabelo) e quando os bens não são substitutos perfeitos.",
    "EL = IEL: se X = 400 e M = 250, então IEL = +150 (saída de capitais)."
  ],
  cards: [
    ["Exportações líquidas (EL)", "X − M, também chamada de balança comercial."],
    ["Investimento externo líquido (IEL)", "Compra de ativos estrangeiros por residentes − compra de ativos nacionais por estrangeiros."],
    ["IEL > 0 significa…", "Saída líquida de capitais."],
    ["Investimento direto × carteira", "Direto: opera o negócio lá fora (Magalu no Uruguai). Carteira: compra ações/títulos estrangeiros."],
    ["Identidade das contas externas", "EL = IEL (o que se exporta a mais vira ativo estrangeiro)."],
    ["Câmbio real (fórmula da Aula 4)", "\\(E = \\dfrac{e \\times P^{*}}{P}\\)"],
    ["Big Mac: e = 5, P* = US$ 3, P = R$ 30", "\\(E = \\dfrac{5 \\times 3}{30} = 0{,}5\\) Big Mac BR por Big Mac EUA."],
    ["Lei do preço único", "Um bem deve custar o mesmo em todo lugar; a arbitragem iguala os preços."],
    ["PPC", "Uma unidade de moeda compra a mesma quantidade de bens em todo país: \\(e = \\dfrac{P^{*}}{P}\\)."],
    ["2 limitações da PPC", "Bens não comercializáveis e bens que não são substitutos perfeitos."],
    ["6 determinantes de EL", "Preferências, preços aqui e lá, rendas aqui e lá, câmbio, custo de transporte, políticas."],
    ["4 determinantes de IEL", "Juros reais externos, juros reais internos, risco percebido, políticas sobre ativos internos."]
  ]
},
/* ============================================================ AULA 5 */
{
  id: "Aula 5",
  cor: "#a78bfa",
  titulo: "Teoria Macroeconômica da Economia Aberta",
  cap: "Cap. 32 Mankiw",
  tema: "Fundos emprestáveis + câmbio: déficit, incentivos, tarifas e fuga de capitais",
  lab: "aberta",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> dois mercados ligados. No de <b>fundos emprestáveis</b> se define a taxa de juros <b>r</b>; o r define o <b>IEL</b>; o IEL é a <b>oferta de reais</b> no mercado de câmbio, que define o câmbio real <b>E</b>; e o E define as exportações líquidas, com <b>EL = IEL</b>.</div>

  <section class="sec">
    <h3><span class="n">1</span> A identidade-chave: <span class="f">\\(S = I + IEL\\)</span></h3>
    <p>De Y = C + I + G + EL, temos Y − C − G = I + EL, ou seja, <b>S = I + EL</b>. Como EL = IEL: <b>S = I + IEL</b>. Cada real poupado financia ou capital <b>nacional</b> (I) ou um ativo <b>estrangeiro</b> (IEL).</p>
    <div class="ex"><b>Q2:</b> S = 500 e I = 380 → IEL = 500 − 380 = <b>120</b> (saída de capitais) e, portanto, EL = 120.</div>
  </section>

  <section class="sec">
    <h3><span class="n">2</span> Os dois mercados</h3>
    <div class="grid2">
      <div class="box"><b class="c1">Mercado de fundos emprestáveis → define r</b>
        <ul>
          <li><b>Oferta = S</b>: cresce com r.</li>
          <li><b>Demanda = I + IEL</b>: cai com r, porque <b>os dois</b> caem quando r sobe.</li>
          <li>Por que IEL cai com r? r é o retorno dos ativos brasileiros. r ↓ → ativos BR menos atraentes → brasileiros compram mais lá fora e estrangeiros compram menos aqui → <b>IEL ↑</b>.</li>
        </ul>
      </div>
      <div class="box"><b class="c2">Mercado de câmbio → define E</b>
        <ul>
          <li>E = câmbio real = bens estrangeiros por bem brasileiro (convenção B). <b>E ↑ = apreciação</b>.</li>
          <li><b>Demanda por R$ = EL</b>: estrangeiros precisam de reais para comprar nossas exportações líquidas. Inclinação negativa: E ↑ encarece nossos produtos e reduz EL.</li>
          <li><b>Oferta de R$ = IEL</b>: brasileiros vendem reais para comprar ativos lá fora. É <b>vertical</b>: E não afeta S nem I, logo não afeta IEL.</li>
        </ul>
      </div>
    </div>
    <div class="chain"><span>r ↑</span><span>IEL ↓</span><span>oferta de R$ ↓</span><span>E ↑ (aprecia)</span><span>EL ↓</span></div>
    <p class="cta-lab">🧪 Veja os três gráficos andando juntos no <a href="#" data-goto="lab">Laboratório desta aula</a>.</p>
  </section>

  <section class="sec">
    <h3><span class="n">3</span> Receita para analisar qualquer choque</h3>
    <ol>
      <li><b>Qual curva mexe?</b> S (poupança/déficit), I (incentivo), IEL (confiança/risco) ou EL (política comercial).</li>
      <li><b>Fundos emprestáveis</b>: o que acontece com r?</li>
      <li><b>IEL</b>: anda <i>ao longo</i> da curva (por causa de r) ou a curva inteira se <i>desloca</i>?</li>
      <li><b>Câmbio</b>: a oferta vertical (= IEL) vai para que lado? O que acontece com E?</li>
      <li><b>EL = IEL</b> no novo equilíbrio.</li>
    </ol>
    <table class="t">
      <thead><tr><th>Choque</th><th>Curva</th><th>r</th><th>I</th><th>IEL</th><th>E</th><th>EL</th></tr></thead>
      <tbody>
        <tr><td><b>Déficit público</b></td><td>S ←</td><td class="up">↑</td><td class="dn">↓</td><td class="dn">↓</td><td class="up">↑ aprecia</td><td class="dn">↓</td></tr>
        <tr><td><b>Incentivo ao investimento</b></td><td>D (I) →</td><td class="up">↑</td><td class="up">↑</td><td class="dn">↓</td><td class="up">↑ aprecia</td><td class="dn">↓</td></tr>
        <tr><td><b>Fuga de capitais</b></td><td>IEL → (e D →)</td><td class="up">↑</td><td class="dn">↓</td><td class="up">↑</td><td class="dn">↓ deprecia</td><td class="up">↑</td></tr>
        <tr><td><b>Tarifa/quota</b> <span class="tag">complemento</span></td><td>D por R$ →</td><td>=</td><td>=</td><td>=</td><td class="up">↑ aprecia</td><td>=</td></tr>
      </tbody>
    </table>
    <div class="trap"><b>Déficit × incentivo ao investimento:</b> os dois sobem r, reduzem IEL, apreciam E e reduzem EL. A <b>única</b> diferença: o déficit <b>derruba</b> I (crowding-out) e o incentivo <b>aumenta</b> I — o que eleva a produtividade e a qualidade de vida no longo prazo.</div>
  </section>

  <section class="sec">
    <h3><span class="n">4</span> Política comercial</h3>
    <p>Política do governo que afeta diretamente a quantidade importada ou exportada:</p>
    <ul>
      <li><b>Tarifa</b>: imposto sobre importação.</li>
      <li><b>Quota de importação</b>: limite à quantidade importada.</li>
      <li><b>“Restrição voluntária de exportação”</b>: o governo pressiona outro país a limitar o que exporta.</li>
    </ul>
    <p>Justificativas mais comuns: <b>salvar empregos</b> de uma indústria nacional que não consegue competir e <b>reduzir o déficit comercial</b>.</p>
    <div class="extra"><b>Complemento (Mankiw, além dos slides):</b> no modelo, a tarifa <b>não reduz o déficit comercial</b>. Ela aumenta EL a cada câmbio (demanda por R$ →), mas como a oferta de R$ (= IEL) é vertical e não muda, o real só se aprecia — e a apreciação devolve EL ao valor de antes. Como S, I e r não mudaram, IEL e EL também não mudam.</div>
  </section>

  <section class="sec">
    <h3><span class="n">5</span> Estudos de caso</h3>
    <div class="grid2">
      <div class="box"><b>China comprando ativos dos EUA</b><br>A China acumulou ativos americanos para desvalorizar sua moeda e exportar mais. Nos EUA: <b>dólar valorizado</b>, <b>mais importações da China</b> e <b>maior déficit comercial</b>. Há quem defenda restringir o comércio, mas os consumidores americanos se beneficiam e o efeito líquido seria pequeno — “Será mesmo??” (provocação do professor).</div>
      <div class="box"><b>Fuga de capitais — México, 1994</b><br>Instabilidade política → investidores vendem ativos mexicanos. <b>Fuga de capital</b> = queda grande e súbita da demanda pelos ativos de um país. A curva de IEL se desloca para a direita → demanda por fundos (I + IEL) sobe → <b>r e IEL sobem juntos</b> → mais pesos ofertados → <b>peso deprecia</b>. Mesmo padrão: Sudeste Asiático 1997 (won, baht, rupia), Rússia 1998, Argentina 2002.</div>
    </div>
    <div class="trap"><b>Como r e IEL sobem juntos se IEL cai com r?</b> Porque a curva de IEL <b>se desloca</b> (para cada r, sai mais capital). A relação negativa vale para movimentos <i>ao longo</i> da curva (Q19).</div>
  </section>`,
  pegadinhas: [
    "Na Aula 5, E ↑ = APRECIAÇÃO real (convenção do Mankiw).",
    "No câmbio: demanda por R$ = EL; oferta de R$ = IEL (vertical).",
    "A oferta de R$ é vertical porque E não altera S, I nem IEL.",
    "Déficit e incentivo ao investimento têm os mesmos efeitos em r, IEL, E e EL; só diferem em I.",
    "Fuga de capitais: r ↑ E IEL ↑ ao mesmo tempo (a curva de IEL se desloca).",
    "Fuga de capitais DEPRECIA a moeda (mais oferta de moeda local)."
  ],
  cards: [
    ["Identidade da economia aberta", "S = I + IEL."],
    ["Demanda por fundos emprestáveis (aberta)", "I + IEL, ambos caem quando r sobe."],
    ["Por que IEL cai quando r sobe?", "Ativos domésticos ficam mais atraentes: residentes compram menos lá fora e estrangeiros compram mais aqui."],
    ["Demanda e oferta de reais no câmbio", "Demanda = EL (estrangeiros compram nossos bens). Oferta = IEL (residentes compram ativos lá fora)."],
    ["Por que a oferta de reais é vertical?", "IEL depende de r, não de E; mudar E não altera S, I nem IEL."],
    ["Efeitos de um déficit público", "S ↓ → r ↑ → I ↓ e IEL ↓ → oferta de R$ ↓ → E ↑ (aprecia) → EL ↓."],
    ["Incentivo ao investimento × déficit", "Mesmos efeitos em r, IEL, E, EL; mas o incentivo aumenta I e o déficit reduz I."],
    ["Fuga de capital", "Queda grande e súbita da demanda por ativos de um país. IEL desloca à direita: r ↑, IEL ↑, moeda deprecia."],
    ["Tarifa × quota", "Tarifa = imposto sobre importação. Quota = limite à quantidade importada."],
    ["Caso China–EUA", "China compra ativos dos EUA → dólar valoriza → mais importações americanas → maior déficit comercial dos EUA."]
  ]
},
/* ============================================================ AULA 6.1 */
{
  id: "Aula 6.1",
  cor: "#fb923c",
  titulo: "Oferta Agregada e Demanda Agregada (Parte 1)",
  cap: "Cap. 33 Mankiw",
  tema: "Flutuações, inclinação e deslocamentos da DA, OA de longo prazo",
  lab: "oada1",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> no longo prazo o PIB real cresce numa tendência; no curto prazo ele <b>flutua</b> em torno dela. O modelo <b>OA–DA</b> (P no eixo vertical, Y no horizontal) explica essas flutuações. A DA é negativamente inclinada por 3 efeitos; a OA de longo prazo é <b>vertical</b> no produto potencial Y<sub>N</sub>.</div>

  <section class="sec">
    <h3><span class="n">1</span> Flutuações econômicas</h3>
    <ul>
      <li><b>Recessão</b>: período de queda da renda real e aumento do desemprego. <b>Depressão</b>: recessão severa (rara).</li>
      <li>As flutuações de curto prazo também são chamadas de <b>ciclos de negócios</b> (business cycles).</li>
    </ul>
    <div class="grid3">
      <div class="box"><b>Fato 1</b><br>São <b>irregulares e imprevisíveis</b>.</div>
      <div class="box"><b>Fato 2</b><br>A maioria das variáveis macro <b>flutua junto</b>.</div>
      <div class="box"><b>Fato 3</b><br>Quando o <b>produto cai</b>, o <b>desemprego sobe</b>.</div>
    </div>
  </section>

  <section class="sec">
    <h3><span class="n">2</span> Por que a DA é negativamente inclinada</h3>
    <p>A DA mostra a quantidade de bens e serviços demandada para cada nível de preços. Como Y = C + I + G + EL e G é fixo, basta ver o que um aumento de P faz com C, I e EL:</p>
    <div class="chain lbl" data-lbl="Riqueza"><span>P ↑</span><span>reais compram menos</span><span>riqueza real ↓</span><span>C ↓</span></div>
    <div class="chain lbl" data-lbl="Juros"><span>P ↑</span><span>precisa de mais dinheiro</span><span>vende títulos</span><span>r ↑</span><span>I ↓</span></div>
    <div class="chain lbl" data-lbl="Câmbio"><span>P ↑</span><span>r ↑</span><span>estrangeiros querem títulos BR</span><span>R$ aprecia</span><span>EL ↓</span></div>
  </section>

  <section class="sec">
    <h3><span class="n">3</span> Movimento ao longo × deslocamento da DA</h3>
    <p>Mudança no <b>próprio P</b> = movimento <b>ao longo</b> da DA. Qualquer outra coisa que mude C, I, G ou EL <b>a um dado P</b> = <b>desloca</b> a DA.</p>
    <table class="t">
      <thead><tr><th>Componente</th><th>Exemplos que deslocam a DA</th></tr></thead>
      <tbody>
        <tr><td><b>C</b></td><td>Boom/crash da bolsa; preferências consumo × poupança; aumento/redução de impostos</td></tr>
        <tr><td><b>I</b></td><td>Empresas compram equipamentos/constroem fábricas; otimismo/pessimismo; juros e política monetária; incentivos fiscais/crédito</td></tr>
        <tr><td><b>G</b></td><td>Gastos federais (defesa); gastos estaduais e municipais (escolas, estradas)</td></tr>
        <tr><td><b>EL</b></td><td>Booms/recessões em outros países; valorização/desvalorização do câmbio (frequente com especulação)</td></tr>
      </tbody>
    </table>
  </section>

  <section class="sec">
    <h3><span class="n">4</span> Oferta agregada de longo prazo (OAlp)</h3>
    <p><b>Y<sub>N</sub></b> (taxa natural de produto, produto potencial ou de pleno emprego) é o que a economia produz quando o desemprego está na sua <b>taxa natural</b> — que <b>não é zero</b>.</p>
    <p><b>Por que vertical?</b> Y<sub>N</sub> depende de trabalho, capital, recursos naturais e tecnologia. Um aumento de P não muda nada disso (<b>dicotomia clássica</b>).</p>
    <table class="t">
      <thead><tr><th>Determinante</th><th>Exemplos que deslocam a OAlp</th></tr></thead>
      <tbody>
        <tr><td><b>Trabalho (L)</b> ou taxa natural de desemprego</td><td>Imigração (→), aposentadoria dos baby-boomers (←), políticas do governo</td></tr>
        <tr><td><b>Capital físico (K) e humano (H)</b></td><td>Investimento em fábricas e equipamentos (→), mais graduados (→), fábricas destruídas por tragédias (←)</td></tr>
        <tr><td><b>Recursos naturais</b></td><td>Descoberta de minerais (→), mudança nos padrões de temperatura</td></tr>
        <tr><td><b>Tecnologia</b></td><td>Progresso tecnológico aumenta a produtividade (→)</td></tr>
      </tbody>
    </table>
  </section>

  <section class="sec">
    <h3><span class="n">5</span> Crescimento com inflação e a OA de curto prazo</h3>
    <p>Ao longo das décadas, o progresso tecnológico empurra a <b>OAlp para a direita</b> e a demanda também cresce (<b>DA para a direita</b>). Resultado ilustrado nos slides: <b>crescimento do produto e inflação</b>. O que acontece com P depende de quanto cada curva anda (Q20).</p>
    <div class="grid2">
      <div class="box"><b>OAcp</b>: <b>positivamente inclinada</b> em períodos curtos (1–2 anos): P ↑ aumenta a quantidade produzida.</div>
      <div class="box"><b>Por que a inclinação importa?</b> Se a OA fosse vertical, mudanças na DA só mexeriam em P. Como a OAcp é inclinada, a DA afeta <b>produto e emprego</b> no curto prazo.</div>
    </div>
  </section>`,
  pegadinhas: [
    "Eixos do OA–DA: horizontal = PIB real (Y); vertical = nível de preços (P).",
    "Mudança de P = movimento AO LONGO da DA. Mudança em C, I, G ou EL a um dado P = DESLOCA a DA.",
    "Pleno emprego ≠ desemprego zero. É desemprego na taxa natural.",
    "Aumento de P não desloca a OAlp (dicotomia clássica).",
    "Gasto estadual/municipal também é G.",
    "Corte de impostos desloca a DA (via C), não a OAlp, no modelo da aula."
  ],
  cards: [
    ["3 fatos sobre flutuações", "Irregulares e imprevisíveis; variáveis flutuam juntas; produto cai e desemprego sobe."],
    ["Recessão × depressão", "Recessão: queda da renda real e alta do desemprego. Depressão: recessão severa."],
    ["Efeito riqueza", "P ↑ → riqueza real ↓ → C ↓."],
    ["Efeito taxa de juros", "P ↑ → mais demanda por dinheiro → vende títulos → r ↑ → I ↓."],
    ["Efeito taxa de câmbio", "P ↑ → r ↑ → capital estrangeiro entra → moeda aprecia → EL ↓."],
    ["O que desloca a DA?", "Qualquer mudança em C, I, G ou EL que não seja causada por P."],
    ["\\(Y_N\\) (produto potencial)", "Produto com desemprego na taxa natural. Depende de L, K, H, recursos naturais e tecnologia."],
    ["Por que a OAlp é vertical?", "\\(Y_N\\) depende de fatores reais, não de P (dicotomia clássica)."],
    ["Exemplos que deslocam a OAlp", "Imigração, mais graduados, novas fábricas, descobertas minerais, tecnologia (→); tragédias que destroem capital (←)."],
    ["Inclinação da OAcp", "Positiva no curto prazo (1–2 anos)."]
  ]
},
/* ============================================================ AULA 6.2 */
{
  id: "Aula 6.2",
  cor: "#f87171",
  titulo: "Oferta Agregada e Demanda Agregada (Parte 2)",
  cap: "Cap. 33 Mankiw",
  tema: "As 3 teorias da OAcp, a equação de oferta e o ajuste a choques",
  lab: "oada2",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> no curto prazo, quando o preço efetivo P difere do esperado P<sub>E</sub>, alguma imperfeição faz o produto se afastar do natural: <b>Y = Y<sub>N</sub> + a(P − P<sub>E</sub>)</b>. Com o tempo, as expectativas se ajustam (P<sub>E</sub> = P) e a economia volta a Y<sub>N</sub>.</div>

  <section class="sec">
    <h3><span class="n">1</span> As três teorias da OAcp positivamente inclinada</h3>
    <table class="t">
      <thead><tr><th>Teoria</th><th>Imperfeição</th><th>Quando P &gt; P<sub>E</sub>…</th></tr></thead>
      <tbody>
        <tr><td><b>1. Rigidez salarial</b></td><td>Salários nominais fixados antes (contratos, normas sociais), com base em P<sub>E</sub>.</td><td>Receita sobe e o custo do trabalho não → produzir fica mais rentável → Y e emprego ↑</td></tr>
        <tr><td><b>2. Preços rígidos</b></td><td><b>Custos de menu</b>: imprimir cardápios, trocar etiquetas.</td><td>Após expansão monetária inesperada, quem demora a reajustar fica relativamente barato → vende mais → Y ↑</td></tr>
        <tr><td><b>3. Percepções equivocadas</b></td><td>Firmas confundem alta geral de preços com alta do <b>preço relativo</b> do seu produto.</td><td>A firma vê seu preço subir antes de perceber que tudo subiu → acha que vale a pena produzir mais → Y ↑</td></tr>
      </tbody>
    </table>
  </section>

  <section class="sec">
    <h3><span class="n">2</span> A equação da oferta agregada</h3>
    <div class="f big">\\(Y = Y_N + a\\,(P - P_E), \\quad a > 0\\)</div>
    <p><b>a</b> mede o quanto Y responde a uma surpresa de preços.</p>
    <div class="grid3">
      <div class="box"><b>P &gt; P<sub>E</sub></b><br>Y &gt; Y<sub>N</sub><br><span class="muted">Q4: 1.000 + 4×(110−100) = 1.040</span></div>
      <div class="box"><b>P &lt; P<sub>E</sub></b><br>Y &lt; Y<sub>N</sub><br><span class="muted">Q13: 800 + 3×(90−100) = 770</span></div>
      <div class="box"><b>P = P<sub>E</sub></b><br>Y = Y<sub>N</sub><br><span class="muted">equilíbrio de longo prazo</span></div>
    </div>
    <div class="trap"><b>P<sub>E</sub> desloca a OAcp:</b> se P<sub>E</sub> <b>sobe</b>, para o mesmo P a surpresa (P − P<sub>E</sub>) é menor → Y menor → OAcp vai para a <b>esquerda</b>. Se P<sub>E</sub> cai, a OAcp vai para a direita.</div>
    <p>No longo prazo as imperfeições somem: preços e salários se flexibilizam, as percepções se corrigem, <b>P<sub>E</sub> = P</b> e a OA fica vertical.</p>
  </section>

  <section class="sec">
    <h3><span class="n">3</span> Os 4 passos para analisar uma flutuação</h3>
    <ol>
      <li>O evento desloca a <b>DA</b> ou a <b>OA</b>?</li>
      <li>Para a <b>esquerda</b> ou para a <b>direita</b>?</li>
      <li>Use o diagrama para ver o novo equilíbrio de <b>curto prazo</b> (Y e P).</li>
      <li>Veja como a economia vai do equilíbrio de curto para o de <b>longo prazo</b>.</li>
    </ol>
    <p class="cta-lab">🧪 Faça esse passo a passo, com animação, no <a href="#" data-goto="lab">Laboratório desta aula</a>.</p>
  </section>

  <section class="sec">
    <h3><span class="n">4</span> Os dois tipos de choque</h3>
    <div class="grid2">
      <div class="box"><b class="c1">Queda da demanda</b> (crash da bolsa)
        <ol class="mini"><li>Afeta C → DA</li><li>DA ←</li><li>Curto prazo (B): P ↓, Y ↓, desemprego ↑</li><li>Com o tempo P<sub>E</sub> ↓ → OAcp → → longo prazo (C): Y volta a Y<sub>N</sub> com <b>P mais baixo</b></li></ol>
      </div>
      <div class="box"><b class="c2">Choque adverso de oferta</b> (petróleo)
        <ol class="mini"><li>Custos ↑ → OAcp</li><li>OAcp ←</li><li>Curto prazo (B): <b>P ↑ e Y ↓ = estagflação</b></li><li>Sem intervenção: desemprego derruba salários → OAcp volta → A. <b>Com acomodação</b> (DA →): Y volta a Y<sub>N</sub>, mas <b>P fica mais alto</b></li></ol>
      </div>
    </div>
    <div class="trap"><b>O dilema da acomodação:</b> diante de um choque de oferta, o governo escolhe entre <b>esperar</b> (recessão mais longa, preços voltam) ou <b>expandir a DA</b> (produto volta logo, preços ficam permanentemente mais altos).</div>
  </section>

  <section class="sec">
    <h3><span class="n">5</span> Episódios históricos</h3>
    <div class="grid3">
      <div class="box"><b>Grande Depressão (1929)</b><br>Crash da bolsa e perda de confiança → C e I ↓ → DA ←. Produto e preços caíram, desemprego explodiu.</div>
      <div class="box"><b>2ª Guerra Mundial</b><br>Aumento enorme de G → DA →. Produto e preços subiram, desemprego despencou.</div>
      <div class="box"><b>Crise de 2008–09</b><br>Preços dos imóveis caem → muitos devem na hipoteca <b>mais que o valor da casa</b> → execuções → bancos vendem casas → <b>mais oferta, preços caem ainda mais</b> → C e I ↓ → DA ←. Resposta: estímulo para levar a DA de volta à direita.</div>
    </div>
    <div class="quote">“O longo prazo é um guia enganoso para os negócios atuais. No longo prazo, estaremos todos mortos.”<span>— J. M. Keynes, <i>A Teoria Geral do Emprego, do Juro e da Moeda</i> (1936). Recessões podem vir de demanda insuficiente; o governo deve agir sobre a DA.</span></div>
  </section>`,
  pegadinhas: [
    "\\(P_E\\) ↑ desloca a OAcp para a ESQUERDA (e não para a direita).",
    "Choque de oferta adverso = P ↑ e Y ↓ (estagflação). Choque de demanda negativo = P ↓ e Y ↓.",
    "Acomodar o choque de oferta recupera Y, mas deixa P permanentemente mais alto.",
    "Sem intervenção, após queda da DA, a economia volta a \\(Y_N\\) com P MAIS BAIXO.",
    "As 3 teorias têm em comum uma imperfeição temporária que liga Y a \\((P - P_E)\\).",
    "No longo prazo, \\(P_E = P\\) e \\(Y = Y_N\\)."
  ],
  cards: [
    ["Teoria da rigidez salarial", "Salário nominal fixado antes com base em \\(P_E\\); se \\(P > P_E\\), a receita sobe sem o custo subir → Y ↑."],
    ["Teoria dos preços rígidos", "Custos de menu: quem demora a reajustar fica relativamente barato e vende mais."],
    ["Teoria das percepções equivocadas", "Firmas confundem alta geral de preços com alta do preço relativo do próprio produto."],
    ["Equação da OAcp", "\\(Y = Y_N + a\\,(P - P_E)\\), com \\(a > 0\\)."],
    ["Efeito de \\(P_E\\) ↑ na OAcp", "Desloca para a esquerda (menos produto para cada P)."],
    ["4 passos para analisar flutuações", "Qual curva; para que lado; equilíbrio de curto prazo; ajuste para o longo prazo."],
    ["Estagflação", "P ↑ e Y ↓ ao mesmo tempo, típico de choque adverso de oferta (OAcp ←)."],
    ["Acomodar um choque de oferta", "Expandir a DA: Y volta a \\(Y_N\\), mas P fica mais alto."],
    ["Hipoteca 'underwater'", "Dívida da hipoteca maior que o valor de mercado da casa."],
    ["Ideia central de Keynes", "Recessões podem vir de demanda insuficiente; política deve agir sobre a DA. 'No longo prazo, estaremos todos mortos.'"]
  ]
},
/* ============================================================ AULA 7.2 */
{
  id: "Aula 7.2",
  cor: "#2dd4bf",
  titulo: "Debates de Política Macroeconômica + Estudo Empírico",
  cap: "Cap. 36 Mankiw + Tesouro/IBGE",
  tema: "Os 6 debates e a ciclicidade da despesa primária no Brasil (1997–2025)",
  lab: "debates",
  resumo: `
  <div class="tldr"><b>Em uma frase:</b> “não há almoço grátis” — cada um dos 6 debates tem argumentos dos dois lados, e a prova cobra <b>qual argumento pertence a qual lado</b>. O estudo empírico mostra que a despesa do governo brasileiro é pró-cíclica em tempos normais e <b>fortemente contracíclica só nas grandes crises</b> (2008–09 e 2020).</div>

  <section class="sec">
    <h3>Os 6 debates — a favor × contra</h3>
    <div class="debate">
      <h4>1. Os formuladores de política devem tentar estabilizar a economia?</h4>
      <div class="pc"><div class="pro"><b>Sim (estabilização ativa)</b><ul><li>Deixadas por conta própria, as economias flutuam (ex.: pessimismo derruba a DA e causa recessão).</li><li>A política pode “<b>se inclinar contra o vento</b>”: usar política monetária e fiscal para estabilizar DA, produção e emprego.</li><li>Uma economia mais estável beneficia todos.</li></ul></div>
      <div class="con"><b>Não</b><ul><li>As políticas têm <b>longas defasagens</b>, então teriam que agir antes dos choques.</li><li>Mas os choques são imprevisíveis e as previsões, imprecisas.</li><li>Se o efeito chega tarde, a política <b>piora</b> as flutuações → melhor deixar a economia seguir sozinha.</li></ul></div></div>
    </div>
    <div class="debate">
      <h4>2. A política fiscal deveria combater recessões? Com gasto ou com corte de impostos?</h4>
      <div class="pc"><div class="pro"><b>Com aumento de gastos (G)</b><ul><li>Cada real gasto pelo governo entra <b>direto</b> na DA; num corte de impostos, parte é <b>poupada</b>. Ex.: R$ 100 de G = R$ 100 de demanda direta; R$ 100 de corte com 60% gastos = R$ 60.</li><li>Como a maioria dos estados (EUA) precisa manter orçamento equilibrado, o gasto federal pode evitar demissões.</li></ul></div>
      <div class="con"><b>Com corte de impostos (T)</b><ul><li>Aumenta a renda disponível e o consumo.</li><li>Pode estimular investimento (ex.: crédito fiscal ao investimento).</li><li>Pode aumentar a <b>oferta agregada</b> (mais incentivo a trabalhar e produzir).</li><li>Aumentos rápidos de gasto podem ser desperdício (“<b>pontes para lugar nenhum</b>”) e exigem impostos futuros.</li></ul></div></div>
    </div>
    <div class="debate">
      <h4>3. Política monetária: regra ou discrição?</h4>
      <div class="pc"><div class="pro"><b>Regra</b> — ex.: crescimento constante da moeda; ou metas de inflação (inflação abaixo da meta → mais moeda; acima → menos moeda)<ul><li>Discrição pode causar grande dano se o banqueiro central for <b>incompetente</b>.</li><li>Permite <b>abuso</b>: usar a política para influenciar eleições → <b>ciclo de negócios políticos</b>.</li><li><b>Inconsistência temporal</b>: discrepância entre a política anunciada e a adotada (promete estabilidade de preços e volta atrás numa recessão).</li></ul></div>
      <div class="con"><b>Discrição</b><ul><li>Dá <b>flexibilidade</b> para reagir a eventos imprevistos.</li><li>Ciclos políticos e inconsistência temporal são possibilidades teóricas, <b>pouco importantes na prática</b>.</li><li>É difícil especificar regras precisas e saber qual seria a melhor.</li></ul></div></div>
    </div>
    <div class="debate">
      <h4>4. A meta do banco central deve ser inflação zero?</h4>
      <p class="muted">Lembre: (1) os preços sobem quando o governo emite moeda demais; (2) no curto prazo há um <b>tradeoff entre inflação e desemprego</b>.</p>
      <div class="pc"><div class="pro"><b>Sim</b><ul><li>Os custos da inflação podem ser substanciais mesmo com inflação baixa.</li><li>Chegar a zero tem custos <b>temporários</b> (desemprego) e benefícios <b>permanentes</b>.</li><li>Se o compromisso for <b>crível</b>, a inflação esperada cai e o custo da transição diminui.</li></ul></div>
      <div class="con"><b>Não</b><ul><li>Benefícios pequenos, custos grandes: estima-se sacrificar <b>5% do PIB de um ano para cada 1 ponto</b> de redução da inflação.</li><li>A desinflação deixaria <b>cicatrizes permanentes</b>: menos investimento (menos capital no futuro) e trabalhadores perdendo qualificação no desemprego.</li><li>Parte dos custos da inflação pode ser reduzida com <b>indexação</b> mais difundida.</li></ul></div></div>
    </div>
    <div class="debate">
      <h4>5. O governo deve equilibrar o orçamento?</h4>
      <div class="pc"><div class="pro"><b>Sim</b><ul><li>A dívida é um <b>fardo para as gerações futuras</b>.</li><li>Déficits expulsam investimento (<b>crowding-out</b>), reduzindo crescimento e padrão de vida futuros.</li><li>Déficits se justificam em <b>recessões e guerras</b>, mas a dívida crescente em tempos de paz é insustentável.</li></ul></div>
      <div class="con"><b>Não</b><ul><li>O peso da dívida é <b>exagerado</b>: é uma pequena fração da renda de uma vida inteira.</li><li>Cortar o déficit pode fazer mais mal que bem: cortar <b>educação</b> reduz capital humano; subir impostos reduz incentivos a trabalhar e poupar.</li><li>Focar no déficit desvia a atenção de outros programas que redistribuem renda entre gerações (ex.: Previdência).</li><li>O que importa é a relação <b>dívida/renda</b>, não a dívida em si.</li></ul></div></div>
    </div>
    <div class="debate">
      <h4>6. As leis tributárias devem ser reformadas para incentivar a poupança?</h4>
      <div class="pc"><div class="pro"><b>Sim</b><ul><li>As pessoas <b>respondem a incentivos</b>.</li><li>Alíquotas marginais altas reduzem o retorno da poupança.</li><li>Sugestão: trocar o imposto de renda por um <b>imposto sobre o consumo</b>.</li></ul></div>
      <div class="con"><b>Não</b><ul><li>A reforma beneficiaria principalmente os <b>ricos</b>, que precisam menos de alívio.</li><li>Impostos sobre consumo são <b>regressivos</b>: pesam mais sobre os pobres.</li><li>Cortar impostos sobre rendimentos do capital pode <b>aumentar o déficit</b> (menos poupança pública), anulando o ganho de poupança privada.</li></ul></div></div>
    </div>
  </section>

  <section class="sec art">
    <h3>📊 Estudo empírico: a despesa primária do governo é contracíclica? (Brasil, 1997–2025)</h3>
    <p class="muted">Dados: despesa primária real do Governo Central (Tesouro, RTN), hiato do produto (IBGE, via filtro HP), deflacionado pelo IPCA. Séries trimestrais.</p>
    <div class="box"><b>Como ler o sinal da correlação (hiato × despesa):</b> <span class="ok">r &gt; 0 = pró-cíclica</span> (gasta mais quando a economia está aquecida e menos na crise — amplifica o ciclo). <span class="c1">r &lt; 0 = contracíclica</span> (gasta mais na crise — amortece o ciclo). r ≈ 0 = acíclica.</div>

    <h4>1. Por que testar a despesa e não o saldo primário</h4>
    <p><b>Ilzetzki &amp; Végh (2008)</b>: o saldo primário mistura dois efeitos — a <b>arrecadação sobe sozinha</b> com o PIB (estabilizador automático, sem decisão nenhuma) e a <b>decisão discricionária</b> de gastar. A despesa isola a decisão de política.</p>

    <h4>2. Literatura internacional</h4>
    <ul>
      <li><b>Gavin &amp; Perotti (1997)</b> e <b>Kaminsky, Reinhart &amp; Végh (2004, “When It Rains, It Pours”)</b>: em países em desenvolvimento a política fiscal tende a ser <b>pró-cíclica</b> — o oposto dos desenvolvidos.</li>
      <li><b>Talvi &amp; Végh (2005)</b>: a base tributária volátil cria <b>pressão política para gastar</b> todo o excesso de arrecadação nos booms, sem reservas para a recessão.</li>
      <li><b>Frankel, Végh &amp; Vuletin (2013)</b>: cerca de <b>1/3 dos países em desenvolvimento “se graduou”</b> da pró-ciclicidade nos anos 2000; o fator causal é a <b>qualidade das instituições</b>.</li>
    </ul>

    <h4>3. Literatura brasileira</h4>
    <table class="t sm">
      <thead><tr><th>Estudo</th><th>Variável</th><th>Técnica</th><th>Resultado</th></tr></thead>
      <tbody>
        <tr><td>Mello (2005)</td><td>Saldo primário</td><td>MQO</td><td>Acíclica</td></tr>
        <tr><td>Blanco &amp; Herrera (2006)</td><td>Saldo primário</td><td>ARDL</td><td>Pró-cíclica (CP) / contracíclica (LP)</td></tr>
        <tr class="hl"><td>Mendonça, Santos &amp; Sachsida (2009)</td><td>NFSP</td><td>Markov-Switching</td><td>Contracíclica moderada (2 regimes)</td></tr>
        <tr><td>Rocha (2009)</td><td>Saldo primário ajustado</td><td>MQO</td><td>Acíclica</td></tr>
        <tr><td>Gadelha &amp; Divino (2013)</td><td>Gasto/PIB</td><td>GMM</td><td>Pró-cíclica</td></tr>
        <tr class="hl"><td>Wichmann &amp; Portugal (2013)</td><td>Superávit, gastos, receitas</td><td>VAR com mudança markoviana</td><td>Assimétrica (contracíclica na recessão)</td></tr>
        <tr><td>Luporini (2015)</td><td>Saldo primário</td><td>Cointegração (MQO)</td><td>Acíclica</td></tr>
        <tr class="hl"><td>Pires (2014)</td><td>Multiplicador fiscal</td><td>Markov-Switching</td><td>Regime-dependente (mais forte em baixa volatilidade)</td></tr>
      </tbody>
    </table>
    <div class="trap"><b>A lição metodológica:</b> estudos de <b>equação única</b> (assumem relação fixa no tempo) tendem a achar “<b>acíclica</b>” porque períodos pró e contracíclicos <b>se anulam</b> na média. Os três que modelam <b>mudança de regime</b> (destacados) acham resultados mais ricos. Por isso o estudo testa explicitamente se há regimes.</div>

    <h4>4. Metodologia</h4>
    <div class="grid2">
      <div class="box"><b class="no">Tentativa 1 — K-Means</b><br>Agrupou trimestres por (hiato, despesa). Os grupos faziam sentido econômico, mas ficavam <b>espalhados ao longo de 30 anos</b>, sem formar blocos no tempo. Motivo: a despesa trimestral é <b>ruidosa</b> (precatórios, itens pontuais, sazonalidade) — o K-Means agrupa por “tipo de trimestre”, não por “época”.</div>
      <div class="box"><b class="ok">Tentativa 2 — correlação móvel (usada)</b><br>Correlação entre hiato e despesa numa <b>janela de 12 trimestres (3 anos)</b>. Captura mudanças de força e de sinal ao longo do tempo e <b>preserva a ordem cronológica</b>. Complementada por correlação por defasagem e <b>causalidade de Granger</b>.</div>
    </div>

    <h4>5. Resultado do teste de Granger (invertido e interessante)</h4>
    <div class="grid2">
      <div class="box"><b>Hiato → Despesa</b>: <b class="no">não significativo</b> em nenhuma defasagem (melhor caso: lag 2, p = 0,11). O ciclo não ajuda a prever a despesa.</div>
      <div class="box"><b>Despesa → Hiato</b>: <b class="ok">marginalmente significativo</b> nos lags 1, 4 e 5 (p entre 0,067 e 0,099). O gasto parece <b>influenciar</b> o ciclo — compatível com um <b>multiplicador keynesiano</b>, não só reação passiva.</div>
    </div>

    <h4>6. Os sete regimes</h4>
    <div id="regimes-chart"></div>
    <table class="t sm">
      <thead><tr><th>Período</th><th>Governo</th><th>Regime</th></tr></thead>
      <tbody>
        <tr><td>1999–2002</td><td>FHC (2º mandato)</td><td>Quase acíclico</td></tr>
        <tr><td>2003–2007</td><td>Lula 1 e 2</td><td class="up">Fortemente pró-cíclico (r ≈ +0,65 a +0,71)</td></tr>
        <tr><td>2008–2011</td><td>Fim de Lula 2 / início Dilma 1</td><td class="dn">Fortemente contracíclico (r ≈ −0,77) — crise de 2008–09</td></tr>
        <tr><td>2012–2016</td><td>Dilma 1 e 2</td><td class="up">Pró-cíclico, crescente (pico r ≈ +0,77 em 2015)</td></tr>
        <tr><td>2016–2019</td><td>Temer / início Bolsonaro</td><td>Quase acíclico — Teto de Gastos restringindo</td></tr>
        <tr><td>2020–2023</td><td>Bolsonaro (pandemia) / início Lula 3</td><td class="dn">Extremamente contracíclico (r ≈ −0,94) — pandemia</td></tr>
        <tr><td>2024–2025</td><td>Lula 3</td><td class="up">Pró-cíclico, em ascensão (r ≈ +0,3 a +0,4)</td></tr>
      </tbody>
    </table>

    <h4>7. Conclusões</h4>
    <ul>
      <li>Granger aponta <b>despesa → hiato</b> (fraco, mas presente), não o contrário.</li>
      <li>A relação <b>muda de sinal</b>: pró-cíclica na maior parte do tempo, mas fortemente contracíclica <b>exatamente nos dois maiores choques</b> (2008–09 e 2020).</li>
      <li>O padrão <b>atravessa partidos</b> (Lula/Dilma em 2008–09; Bolsonaro/Lula na pandemia): a contraciclicidade é acionada por <b>emergências</b>, não por ideologia.</li>
      <li>Nem pró-cíclico constante (Kaminsky-Reinhart-Végh), nem contracíclico sustentado como os desenvolvidos: uma <b>“graduação condicional”</b>, ativada só em crises agudas (compatível com Frankel, Végh &amp; Vuletin).</li>
    </ul>
  </section>`,
  pegadinhas: [
    "'Inclinar-se contra o vento' é argumento A FAVOR da estabilização ativa. Defasagens são o argumento CONTRA.",
    "G entra 100% direto na DA; corte de impostos só na parte gasta (ex.: 60%). Isso é efeito direto, antes do multiplicador.",
    "'Pontes para lugar nenhum' é crítica ao aumento rápido de GASTOS (argumento pró-corte de impostos).",
    "Taxa de sacrifício: reduzir de 4% para 2% = 2 pontos × 5% = 10% do PIB de um ano.",
    "Inconsistência temporal = diferença entre a política anunciada e a efetivamente adotada.",
    "Imposto sobre consumo é REGRESSIVO (argumento contra a reforma pró-poupança).",
    "Estudo: use a DESPESA, não o saldo primário, porque o saldo mistura a arrecadação automática.",
    "Estudo: Granger deu Despesa → Hiato (não Hiato → Despesa).",
    "Estudo: contracíclica forte só em 2008–09 (r ≈ −0,77) e 2020 (r ≈ −0,94), sob partidos diferentes."
  ],
  cards: [
    ["Argumento a favor da estabilização ativa", "Políticas podem compensar quedas da DA (ex.: pessimismo) e 'se inclinar contra o vento'."],
    ["Argumento contra a estabilização ativa", "Defasagens longas + choques imprevisíveis: a política pode chegar tarde e piorar as flutuações."],
    ["Gasto (G) × corte de impostos (efeito direto)", "R$ 100 de G = R$ 100 na DA. R$ 100 de corte com 60% gastos = R$ 60."],
    ["Ciclo de negócios políticos", "Uso da política monetária para influenciar eleições."],
    ["Inconsistência temporal", "Discrepância entre a política anunciada e a política efetivamente adotada depois."],
    ["Exemplos de regra monetária", "Crescimento constante da moeda; metas de inflação (acima da meta → menos moeda)."],
    ["Taxa de sacrifício citada", "5% do PIB de um ano para cada 1 ponto percentual de redução da inflação."],
    ["Credibilidade e inflação zero", "Compromisso crível reduz a inflação esperada e barateia a transição."],
    ["Métrica relevante da dívida", "Relação dívida/renda (PIB)."],
    ["Crítica ao imposto sobre consumo", "É regressivo, beneficia os ricos e pode aumentar o déficit."],
    ["Por que despesa e não saldo? (Ilzetzki & Végh)", "O saldo mistura a arrecadação que sobe sozinha com o PIB e a decisão do governo; a despesa isola a decisão."],
    ["Por que K-Means falhou no estudo?", "A despesa trimestral é ruidosa (precatórios, sazonalidade); os grupos não formavam períodos contínuos."],
    ["Janela da correlação móvel", "12 trimestres (3 anos)."],
    ["'Graduação condicional'", "Brasil é pró-cíclico em tempos normais e fortemente contracíclico só nas grandes crises (2008–09 e 2020)."]
  ]
}
];

// Formulário geral
const FORMULAS = [
  ["Aula 1", "Identidade do PIB", "\\(Y = C + I + G + EL\\)", "\\(EL = X - M\\)"],
  ["Aula 1", "PIB nominal", "\\(\\sum P_{\\text{atual}} \\times Q_{\\text{atual}}\\)", "preços e quantidades do próprio ano"],
  ["Aula 1", "PIB real", "\\(\\sum P_{\\text{base}} \\times Q_{\\text{atual}}\\)", "preços do ano-base"],
  ["Aula 1", "Deflator do PIB", "\\(\\text{Deflator} = 100 \\times \\dfrac{\\text{PIB nominal}}{\\text{PIB real}}\\)", "nível geral de preços"],
  ["Aula 1", "Inflação pelo deflator", "\\(\\pi = \\dfrac{D_2 - D_1}{D_1}\\)", "variação percentual"],
  ["Aula 1", "PIB real a partir do deflator", "\\(\\text{PIB real} = 100 \\times \\dfrac{\\text{PIB nominal}}{\\text{Deflator}}\\)", "usado na Q18"],
  ["Aula 2", "Poupança privada", "\\(S_{\\text{priv}} = Y - T - C\\)", ""],
  ["Aula 2", "Poupança pública", "\\(S_{\\text{pub}} = T - G\\)", "> 0 superávit; < 0 déficit"],
  ["Aula 2", "Poupança nacional", "\\(S = Y - C - G\\)", "economia fechada: S = I"],
  ["Aula 3", "Razão de reserva", "\\(R = \\dfrac{\\text{Reservas}}{\\text{Depósitos}}\\)", ""],
  ["Aula 3", "Multiplicador monetário", "\\(m = \\dfrac{1}{R}\\)", "oferta máxima = reservas × m"],
  ["Aula 4", "Exportações líquidas", "\\(EL = X - M\\)", ""],
  ["Aula 4", "Investimento externo líquido", "IEL = ativos externos comprados por residentes − ativos internos comprados por estrangeiros", "> 0 saída; < 0 entrada"],
  ["Aula 4", "Identidade externa", "\\(EL = IEL\\)", ""],
  ["Aula 4", "Câmbio real", "\\(E = \\dfrac{e \\times P^{*}}{P}\\)", "Big Mac: \\(\\dfrac{5 \\times 3}{30} = 0{,}5\\)"],
  ["Aula 4", "PPC", "\\(e = \\dfrac{P^{*}}{P}\\)", "convenção do Mankiw"],
  ["Aula 5", "Poupança na economia aberta", "\\(S = I + IEL\\)", "\\(IEL = S - I\\)"],
  ["Aula 6.2", "Oferta agregada de curto prazo", "\\(Y = Y_N + a\\,(P - P_E)\\)", "a > 0; no longo prazo, P = P_E e Y = Y_N"],
  ["Aula 7.2", "Efeito direto do corte de impostos", "\\(\\Delta C = \\text{PMgC} \\times \\Delta T\\)", "R$ 100 × 0,6 = R$ 60"],
  ["Aula 7.2", "Custo da desinflação", "\\(\\text{custo} = 5\\% \\text{ do PIB} \\times \\text{pontos reduzidos}\\)", "4% → 2% = 10% do PIB"]
];

// Regimes do estudo empírico (valores aproximados; nos períodos "quase acíclicos" o estudo não informa r)
const REGIMES = [
  { p: "1999–02", gov: "FHC 2", r: 0.05, txt: "Quase acíclico", aprox: true },
  { p: "2003–07", gov: "Lula 1–2", r: 0.68, txt: "Fortemente pró-cíclico (r ≈ +0,65 a +0,71)" },
  { p: "2008–11", gov: "Lula 2–Dilma 1", r: -0.77, txt: "Fortemente contracíclico — crise 2008–09" },
  { p: "2012–16", gov: "Dilma 1–2", r: 0.77, txt: "Pró-cíclico crescente (pico +0,77 em 2015)" },
  { p: "2016–19", gov: "Temer–Bolsonaro", r: 0.05, txt: "Quase acíclico — Teto de Gastos", aprox: true },
  { p: "2020–23", gov: "Bolsonaro–Lula 3", r: -0.94, txt: "Extremamente contracíclico — pandemia" },
  { p: "2024–25", gov: "Lula 3", r: 0.35, txt: "Pró-cíclico em ascensão (r ≈ +0,3 a +0,4)" }
];
