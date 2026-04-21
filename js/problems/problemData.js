/**
 * Logic Studies - Problem Data
 * Database of logic problems with step-by-step solutions
 */

const PROBLEMS = [
  // ==========================================
  // PROBLEM 1: Logic Table (people/jobs)
  // ==========================================
  {
    id: 1,
    title: "Quem ocupa cada cargo?",
    type: "table",
    difficulty: "fácil",
    icon: "📋",
    description: "Um clássico problema de tabela lógica com pessoas e cargos.",
    statement: `
            <p>Ana, Bruno e Carla trabalham em uma empresa. Cada um ocupa um cargo diferente: <strong>Médica</strong>, <strong>Advogado</strong> ou <strong>Engenheira</strong>.</p>
            <p>Com base nas pistas abaixo, descubra o cargo de cada pessoa:</p>
            <span class="clue">1. Ana não é advogada.</span>
            <span class="clue">2. Bruno não é médico nem engenheiro.</span>
            <span class="clue">3. Carla não é médica.</span>
        `,
    initialState: {
      rows: ["Ana", "Bruno", "Carla"],
      cols: ["Médica", "Advogado", "Engenheira"],
      cells: [
        ["?", "?", "?"],
        ["?", "?", "?"],
        ["?", "?", "?"],
      ],
    },
    steps: [
      {
        instruction: "Vamos começar montando nossa tabela!",
        explanation:
          "Primeiro, criamos uma tabela com as pessoas nas linhas e os cargos nas colunas. O '?' significa que ainda não sabemos se a pessoa ocupa aquele cargo.",
        action: { type: "init" },
        tip: "Tabelas lógicas são ótimas para organizar eliminações!",
      },
      {
        instruction: "Pista 1: 'Ana não é advogada'",
        explanation:
          "Se Ana NÃO é advogada, podemos eliminar essa possibilidade da tabela. Vamos marcar com um ✗.",
        action: { type: "eliminate", row: 0, col: 1 },
        tip: "Sempre que uma pista diz 'NÃO É', podemos eliminar!",
      },
      {
        instruction: "Pista 2: 'Bruno não é médico nem engenheiro'",
        explanation:
          "Bruno não pode ser médico E não pode ser engenheiro. Isso significa que só sobra uma opção para ele...",
        action: { type: "eliminate", row: 1, col: 0 },
        tip: "Preste atenção quando uma pista elimina duas opções de uma vez!",
      },
      {
        instruction: "Continuando a Pista 2...",
        explanation: "Eliminamos também a opção de engenheiro para Bruno.",
        action: { type: "eliminate", row: 1, col: 2 },
        tip: null,
      },
      {
        instruction: "Bruno só pode ser Advogado!",
        explanation:
          "Se Bruno não é médico nem engenheiro, só sobra uma opção: ele é o ADVOGADO! Quando sobra apenas uma opção, podemos confirmar.",
        action: { type: "confirm", row: 1, col: 1 },
        tip: "Quando sobra só uma opção em uma linha ou coluna, encontramos a resposta!",
      },
      {
        instruction: "Se Bruno é advogado, ninguém mais pode ser",
        explanation:
          "Como Bruno é o advogado, Ana e Carla não podem ser. Mas Ana já estava eliminada. Vamos eliminar Carla.",
        action: { type: "eliminate", row: 2, col: 1 },
        tip: "Cada cargo só pode ter uma pessoa!",
      },
      {
        instruction: "Pista 3: 'Carla não é médica'",
        explanation: "Eliminamos a opção de médica para Carla.",
        action: { type: "eliminate", row: 2, col: 0 },
        tip: null,
      },
      {
        instruction: "Carla só pode ser Engenheira!",
        explanation:
          "Carla não é advogada (Bruno é) e não é médica (pista 3). Só sobra Engenheira!",
        action: { type: "confirm", row: 2, col: 2 },
        tip: "Use a lógica de exclusão: elimine todas as opções impossíveis.",
      },
      {
        instruction: "Se Carla é engenheira, Ana não pode ser",
        explanation:
          "Como Carla é a engenheira, eliminamos essa opção para Ana.",
        action: { type: "eliminate", row: 0, col: 2 },
        tip: null,
      },
      {
        instruction: "Ana só pode ser Médica!",
        explanation:
          "Ana não é advogada (pista 1) e não é engenheira (Carla é). Só sobra Médica!",
        action: { type: "confirm", row: 0, col: 0 },
        tip: "Problema resolvido! Cada pessoa tem seu cargo definido.",
      },
    ],
    answer: "Ana é Médica, Bruno é Advogado, Carla é Engenheira",
    summary:
      "Usamos eliminação por exclusão: cada pista 'NÃO É' elimina uma opção. Quando sobra apenas uma opção para uma pessoa ou um cargo, confirmamos a resposta.",
  },

  // ==========================================
  // PROBLEM 2: Numeric Sequence
  // ==========================================
  {
    id: 2,
    title: "Complete a sequência",
    type: "sequence",
    difficulty: "fácil",
    icon: "🔢",
    description: "Descubra o padrão e encontre o próximo número.",
    statement: `
            <p>Observe a sequência numérica abaixo e descubra qual número deve ocupar a posição marcada com <strong>?</strong>:</p>
            <p style="font-size: 1.5rem; text-align: center; margin: 1rem 0;">
                <strong>2, 4, 8, 16, ?</strong>
            </p>
        `,
    initialState: {
      numbers: [2, 4, 8, 16, "?"],
      pattern: null,
      differences: [],
    },
    steps: [
      {
        instruction: "Vamos analisar a sequência!",
        explanation:
          "Primeiro, observamos os números: 2, 4, 8, 16, ?. Precisamos descobrir qual é a relação entre eles.",
        action: { type: "init" },
        tip: "Em sequências, sempre procure o padrão entre números consecutivos.",
      },
      {
        instruction: "Qual a relação entre 2 e 4?",
        explanation:
          "De 2 para 4, o que acontece? Podemos somar 2 (2+2=4) OU multiplicar por 2 (2×2=4). Vamos verificar qual padrão funciona para todos.",
        action: { type: "highlight", index: 0 },
        tip: "Teste as operações básicas: soma, subtração, multiplicação, divisão.",
      },
      {
        instruction: "Qual a relação entre 4 e 8?",
        explanation:
          "De 4 para 8: 4+4=8 OU 4×2=8. Ambas ainda funcionam! Mas note que se fosse +2, teríamos 4+2=6, não 8. Então não é +2 sempre.",
        action: { type: "highlight", index: 1 },
        tip: "Se um padrão não funciona para todos, descarte-o.",
      },
      {
        instruction: "Confirmando o padrão: 8 para 16",
        explanation:
          "De 8 para 16: 8×2=16 ✓. O padrão é MULTIPLICAR POR 2! Cada número é o dobro do anterior.",
        action: { type: "highlight", index: 2 },
        tip: "Sequências de multiplicação são chamadas de progressões geométricas.",
      },
      {
        instruction: "Aplicando o padrão: 16 × 2 = ?",
        explanation: "Seguindo o padrão (×2), o próximo número é: 16 × 2 = 32",
        action: { type: "reveal", value: 32 },
        tip: "O padrão ×2 é muito comum em sequências de concursos!",
      },
    ],
    answer: "32",
    summary:
      "Identificamos que o padrão é uma progressão geométrica de razão 2 (cada número é multiplicado por 2). Assim: 2→4→8→16→32.",
  },

  // ==========================================
  // PROBLEM 3: Order/Position
  // ==========================================
  {
    id: 3,
    title: "Quem está em qual posição?",
    type: "order",
    difficulty: "médio",
    icon: "🏃",
    description: "Descubra a ordem de chegada em uma corrida.",
    statement: `
            <p>Em uma corrida, participaram 4 pessoas: <strong>Diana</strong>, <strong>Eduardo</strong>, <strong>Fábio</strong> e <strong>Gabi</strong>.</p>
            <p>Com base nas informações abaixo, descubra a ordem de chegada:</p>
            <span class="clue">1. Diana chegou antes de Eduardo.</span>
            <span class="clue">2. Fábio não chegou em primeiro nem em último.</span>
            <span class="clue">3. Gabi chegou imediatamente depois de Diana.</span>
            <span class="clue">4. Eduardo chegou em último.</span>
        `,
    initialState: {
      positions: ["1º", "2º", "3º", "4º"],
      people: ["Diana", "Eduardo", "Fábio", "Gabi"],
      slots: [null, null, null, null],
      eliminated: {
        Diana: [],
        Eduardo: [],
        Fábio: [],
        Gabi: [],
      },
    },
    steps: [
      {
        instruction: "Vamos organizar as posições!",
        explanation:
          "Temos 4 posições (1º ao 4º) e 4 pessoas. Cada pessoa ocupa uma posição diferente.",
        action: { type: "init" },
        tip: "Comece pelas pistas mais diretas, que dão informações certas.",
      },
      {
        instruction: "Pista 4: 'Eduardo chegou em último'",
        explanation:
          "Essa é a pista mais direta! Eduardo está na 4ª posição. Vamos confirmar.",
        action: { type: "place", person: "Eduardo", position: 3 },
        tip: "Sempre comece pelas informações mais concretas.",
      },
      {
        instruction: "Pista 2: 'Fábio não chegou em 1º nem em último'",
        explanation:
          "Fábio não é 1º e não é 4º (que já é do Eduardo). Então Fábio só pode ser 2º ou 3º.",
        action: { type: "eliminate", person: "Fábio", positions: [0, 3] },
        tip: "Anote quais posições cada pessoa NÃO pode ocupar.",
      },
      {
        instruction: "Pista 3: 'Gabi chegou imediatamente depois de Diana'",
        explanation:
          "Se Gabi vem LOGO DEPOIS de Diana, elas são consecutivas: Diana-Gabi. Isso significa que Diana não pode ser 4º (não haveria posição depois) e Gabi não pode ser 1º (não haveria posição antes).",
        action: { type: "info", text: "Diana e Gabi são consecutivas: Di→Ga" },
        tip: "'Imediatamente depois' significa posições consecutivas, sem ninguém no meio.",
      },
      {
        instruction: "Onde Diana e Gabi podem estar?",
        explanation:
          "Diana-Gabi podem estar nas posições: 1º-2º, 2º-3º ou 3º-4º. Mas 4º é do Eduardo! Então: 1º-2º ou 2º-3º.",
        action: { type: "info", text: "Opções: Di-Ga em 1º-2º ou 2º-3º" },
        tip: null,
      },
      {
        instruction: "Se Diana-Gabi forem 2º-3º, onde fica Fábio?",
        explanation:
          "Fábio só pode ser 2º ou 3º. Se Diana-Gabi ocupam 2º-3º, Fábio teria que ser 1º. Mas a pista 2 diz que Fábio não é 1º! Então Diana-Gabi NÃO podem estar em 2º-3º.",
        action: { type: "info", text: "Diana-Gabi em 2º-3º → impossível!" },
        tip: "Teste as possibilidades e veja qual gera contradição.",
      },
      {
        instruction: "Diana está em 1º e Gabi em 2º!",
        explanation: "A única opção válida é Diana em 1º e Gabi em 2º.",
        action: { type: "place", person: "Diana", position: 0 },
        tip: null,
      },
      {
        instruction: "Confirmando Gabi em 2º",
        explanation: "Gabi vem logo depois de Diana, então está em 2º lugar.",
        action: { type: "place", person: "Gabi", position: 1 },
        tip: null,
      },
      {
        instruction: "Fábio está em 3º!",
        explanation:
          "Só sobrou a 3ª posição para Fábio. Isso é consistente com a pista 2 (não é 1º nem 4º).",
        action: { type: "place", person: "Fábio", position: 2 },
        tip: "Quando todas as outras posições estão preenchidas, a última pessoa vai para a posição restante.",
      },
    ],
    answer: "1º Diana, 2º Gabi, 3º Fábio, 4º Eduardo",
    summary:
      "Começamos pela informação mais direta (Eduardo em 4º). Depois, analisamos a restrição 'consecutivas' de Diana-Gabi e testamos as possibilidades até encontrar a única válida.",
  },

  // ==========================================
  // PROBLEM 4: More complex table
  // ==========================================
  {
    id: 4,
    title: "Moradores e apartamentos",
    type: "table",
    difficulty: "médio",
    icon: "🏢",
    description: "Descubra em qual andar cada pessoa mora.",
    statement: `
            <p>Em um prédio de 3 andares, moram <strong>Pedro</strong>, <strong>Renata</strong> e <strong>Sérgio</strong>, um em cada andar.</p>
            <p>Cada um trabalha em uma área diferente: <strong>TI</strong>, <strong>Marketing</strong> ou <strong>Finanças</strong>.</p>
            <p>Descubra quem mora em cada andar e sua profissão:</p>
            <span class="clue">1. Pedro mora acima de quem trabalha com Marketing.</span>
            <span class="clue">2. Renata trabalha com TI.</span>
            <span class="clue">3. Quem mora no 1º andar não trabalha com Finanças.</span>
            <span class="clue">4. Sérgio não mora no 3º andar.</span>
        `,
    initialState: {
      rows: ["Pedro", "Renata", "Sérgio"],
      cols: ["1º Andar", "2º Andar", "3º Andar"],
      cells: [
        ["?", "?", "?"],
        ["?", "?", "?"],
        ["?", "?", "?"],
      ],
      professions: {
        Pedro: "?",
        Renata: "TI",
        Sérgio: "?",
      },
    },
    steps: [
      {
        instruction: "Vamos organizar as informações!",
        explanation:
          "Temos 3 pessoas, 3 andares e 3 profissões. Vamos usar a tabela para os andares e anotar as profissões separadamente.",
        action: { type: "init" },
        tip: "Quando há dois tipos de atributos, às vezes precisamos de duas tabelas ou anotações extras.",
      },
      {
        instruction: "Pista 2: 'Renata trabalha com TI'",
        explanation:
          "Já sabemos a profissão de Renata: TI. Isso significa que Pedro e Sérgio trabalham com Marketing ou Finanças.",
        action: { type: "info", text: "Renata = TI ✓" },
        tip: "Anote informações confirmadas imediatamente!",
      },
      {
        instruction: "Pista 4: 'Sérgio não mora no 3º andar'",
        explanation: "Eliminamos o 3º andar para Sérgio.",
        action: { type: "eliminate", row: 2, col: 2 },
        tip: null,
      },
      {
        instruction:
          "Pista 1: 'Pedro mora acima de quem trabalha com Marketing'",
        explanation:
          "Se Pedro mora ACIMA de alguém, Pedro não pode estar no 1º andar (não há andar abaixo). E quem trabalha com Marketing não pode estar no 3º (não há andar acima).",
        action: { type: "eliminate", row: 0, col: 0 },
        tip: "'Acima' ou 'abaixo' elimina os extremos para uma das partes.",
      },
      {
        instruction: "Quem trabalha com Marketing não está no 3º",
        explanation:
          "Renata é de TI. Então Marketing é Pedro ou Sérgio. Se Pedro mora acima de Marketing, Pedro não é Marketing. Logo, Sérgio trabalha com Marketing!",
        action: { type: "info", text: "Sérgio = Marketing ✓" },
        tip: "Use deduções em cadeia: uma conclusão leva à outra.",
      },
      {
        instruction: "Pedro trabalha com Finanças!",
        explanation:
          "Renata é TI, Sérgio é Marketing. Só sobra Finanças para Pedro.",
        action: { type: "info", text: "Pedro = Finanças ✓" },
        tip: null,
      },
      {
        instruction:
          "Pista 3: 'Quem mora no 1º andar não trabalha com Finanças'",
        explanation:
          "Pedro trabalha com Finanças. Então Pedro não mora no 1º andar. (Já eliminamos antes!)",
        action: { type: "info", text: "Confirmado: Pedro não está no 1º" },
        tip: null,
      },
      {
        instruction: "Sérgio (Marketing) não pode estar no 3º andar",
        explanation:
          "Já eliminamos Sérgio do 3º. E Pedro mora ACIMA de Sérgio (que é Marketing). Se Sérgio fosse 2º, Pedro seria 3º. Se Sérgio fosse 1º, Pedro poderia ser 2º ou 3º.",
        action: { type: "highlight", row: 2, col: 0 },
        tip: "Teste as possibilidades válidas.",
      },
      {
        instruction: "Se Sérgio está no 1º, quem está no 2º?",
        explanation:
          "Sérgio no 1º, Pedro acima (2º ou 3º), Renata em uma posição restante. Vamos testar: Sérgio-1º, Pedro-3º, Renata-2º.",
        action: { type: "confirm", row: 2, col: 0 },
        tip: null,
      },
      {
        instruction: "Pedro no 3º andar",
        explanation:
          "Pedro mora acima de Sérgio (1º), então pode ser 2º ou 3º. Vamos colocar no 3º.",
        action: { type: "confirm", row: 0, col: 2 },
        tip: null,
      },
      {
        instruction: "Renata no 2º andar",
        explanation: "Só sobrou o 2º andar para Renata.",
        action: { type: "confirm", row: 1, col: 1 },
        tip: "Complete eliminando as outras opções.",
      },
      {
        instruction: "Eliminando opções restantes",
        explanation:
          "Agora vamos limpar a tabela eliminando todas as opções impossíveis.",
        action: { type: "eliminate", row: 0, col: 1 },
        tip: null,
      },
      {
        instruction: "Finalizando eliminações",
        explanation:
          "Eliminando as últimas opções para deixar a tabela completa.",
        action: { type: "eliminate", row: 1, col: 0 },
        tip: null,
      },
      {
        instruction: "Última eliminação",
        explanation: "Renata não está no 3º.",
        action: { type: "eliminate", row: 1, col: 2 },
        tip: null,
      },
      {
        instruction: "Sérgio não está no 2º",
        explanation: "Finalizando a tabela.",
        action: { type: "eliminate", row: 2, col: 1 },
        tip: "Tabela completa!",
      },
    ],
    answer: "1º: Sérgio (Marketing), 2º: Renata (TI), 3º: Pedro (Finanças)",
    summary:
      "Combinamos pistas sobre andares e profissões. Primeiro deduzimos as profissões, depois usamos as relações 'acima/abaixo' para posicionar as pessoas nos andares.",
  },

  // ==========================================
  // PROBLEM 5: Sequence with pattern
  // ==========================================
  {
    id: 5,
    title: "Sequência alternada",
    type: "sequence",
    difficulty: "médio",
    icon: "🔢",
    description: "Uma sequência com padrão não óbvio.",
    statement: `
            <p>Observe a sequência abaixo e descubra o próximo número:</p>
            <p style="font-size: 1.5rem; text-align: center; margin: 1rem 0;">
                <strong>1, 4, 2, 5, 3, 6, ?</strong>
            </p>
        `,
    initialState: {
      numbers: [1, 4, 2, 5, 3, 6, "?"],
      pattern: null,
      differences: [],
    },
    steps: [
      {
        instruction: "Observando a sequência",
        explanation:
          "À primeira vista: 1, 4, 2, 5, 3, 6, ?. Não parece ter um padrão simples de soma ou multiplicação.",
        action: { type: "init" },
        tip: "Quando o padrão não é óbvio, tente separar a sequência em partes.",
      },
      {
        instruction: "Separando posições ímpares e pares",
        explanation:
          "Vamos olhar separadamente: Posições 1ª, 3ª, 5ª: 1, 2, 3. Posições 2ª, 4ª, 6ª: 4, 5, 6. São duas sequências!",
        action: { type: "highlight", indices: [0, 2, 4] },
        tip: "Sequências intercaladas são comuns em concursos!",
      },
      {
        instruction: "Padrão nas posições ímpares: 1, 2, 3...",
        explanation:
          "Nas posições ímpares temos: 1, 2, 3 → é uma sequência simples +1.",
        action: { type: "info", text: "Ímpares: 1 → 2 → 3 → 4..." },
        tip: null,
      },
      {
        instruction: "Padrão nas posições pares: 4, 5, 6...",
        explanation: "Nas posições pares temos: 4, 5, 6 → também +1.",
        action: { type: "info", text: "Pares: 4 → 5 → 6 → 7..." },
        tip: "Ambas são progressões aritméticas de razão 1.",
      },
      {
        instruction: "A próxima posição é ímpar (7ª)",
        explanation:
          "A 7ª posição é ímpar. Seguindo o padrão das ímpares (1, 2, 3...), o próximo é 4!",
        action: { type: "reveal", value: 4 },
        tip: "Identifique se a posição do '?' é ímpar ou par para saber qual sequência seguir.",
      },
    ],
    answer: "4",
    summary:
      "A sequência é formada por duas progressões intercaladas: posições ímpares (1,2,3,4...) e pares (4,5,6,7...). Como a 7ª posição é ímpar, seguimos a primeira progressão: 4.",
  },

  // ==========================================
  // PROBLEM 6: Easy - Fruits and Colors (Table)
  // ==========================================
  {
    id: 6,
    title: "Frutas e cores",
    type: "table",
    difficulty: "fácil",
    icon: "🍎",
    description: "Associe cada fruta à sua cor correta.",
    statement: `
      <p>Maria comprou três frutas: <strong>Maçã</strong>, <strong>Banana</strong> e <strong>Uva</strong>.</p>
      <p>Cada fruta tem uma cor diferente: <strong>Vermelha</strong>, <strong>Amarela</strong> ou <strong>Roxa</strong>.</p>
      <p>Descubra a cor de cada fruta:</p>
      <span class="clue">1. A maçã não é amarela.</span>
      <span class="clue">2. A banana não é roxa nem vermelha.</span>
      <span class="clue">3. A uva é roxa.</span>
    `,
    initialState: {
      rows: ["Maçã", "Banana", "Uva"],
      cols: ["Vermelha", "Amarela", "Roxa"],
      cells: [
        ["?", "?", "?"],
        ["?", "?", "?"],
        ["?", "?", "?"],
      ],
    },
    steps: [
      {
        instruction: "Vamos montar nossa tabela!",
        explanation: "Temos 3 frutas e 3 cores. Cada fruta tem exatamente uma cor.",
        action: { type: "init" },
        tip: "Comece pelas pistas mais diretas!",
      },
      {
        instruction: "Pista 3: 'A uva é roxa'",
        explanation: "Essa é a pista mais direta! Podemos confirmar imediatamente que a uva é roxa.",
        action: { type: "confirm", row: 2, col: 2 },
        tip: "Pistas afirmativas são as melhores para começar!",
      },
      {
        instruction: "Se a uva é roxa, as outras não são",
        explanation: "Como a uva é roxa, eliminamos a opção roxa para maçã e banana.",
        action: { type: "eliminate", row: 0, col: 2 },
        tip: "Cada cor só pode pertencer a uma fruta.",
      },
      {
        instruction: "Banana não é roxa",
        explanation: "Eliminando a opção roxa para banana também.",
        action: { type: "eliminate", row: 1, col: 2 },
        tip: null,
      },
      {
        instruction: "Pista 2: 'A banana não é roxa nem vermelha'",
        explanation: "A banana já não é roxa (uva é). Agora eliminamos vermelha também.",
        action: { type: "eliminate", row: 1, col: 0 },
        tip: null,
      },
      {
        instruction: "Banana só pode ser amarela!",
        explanation: "Se banana não é roxa nem vermelha, só sobra amarela!",
        action: { type: "confirm", row: 1, col: 1 },
        tip: "Eliminação por exclusão: quando sobra uma opção, é a resposta!",
      },
      {
        instruction: "Pista 1: 'A maçã não é amarela'",
        explanation: "Eliminamos amarela para maçã. Mas a banana já é amarela, então isso já estava implícito.",
        action: { type: "eliminate", row: 0, col: 1 },
        tip: null,
      },
      {
        instruction: "Maçã só pode ser vermelha!",
        explanation: "Maçã não é amarela (pista 1) e não é roxa (uva é). Só sobra vermelha!",
        action: { type: "confirm", row: 0, col: 0 },
        tip: "Problema resolvido!",
      },
      {
        instruction: "Eliminando as últimas opções",
        explanation: "Uva não é vermelha nem amarela.",
        action: { type: "eliminate", row: 2, col: 0 },
        tip: null,
      },
      {
        instruction: "Finalizando",
        explanation: "Uva não é amarela.",
        action: { type: "eliminate", row: 2, col: 1 },
        tip: "Tabela completa!",
      },
    ],
    answer: "Maçã é Vermelha, Banana é Amarela, Uva é Roxa",
    summary: "Começamos pela pista direta (uva é roxa) e usamos eliminação para deduzir as outras cores.",
  },

  // ==========================================
  // PROBLEM 7: Easy - Sports and Days (Table)
  // ==========================================
  {
    id: 7,
    title: "Esportes da semana",
    type: "table",
    difficulty: "fácil",
    icon: "⚽",
    description: "Descubra qual esporte cada amigo pratica.",
    statement: `
      <p>Três amigos - <strong>Lucas</strong>, <strong>Marcos</strong> e <strong>Nina</strong> - praticam esportes diferentes.</p>
      <p>Os esportes são: <strong>Futebol</strong>, <strong>Natação</strong> e <strong>Tênis</strong>.</p>
      <p>Descubra o esporte de cada um:</p>
      <span class="clue">1. Lucas não pratica natação.</span>
      <span class="clue">2. Marcos pratica futebol.</span>
      <span class="clue">3. Nina não pratica futebol.</span>
    `,
    initialState: {
      rows: ["Lucas", "Marcos", "Nina"],
      cols: ["Futebol", "Natação", "Tênis"],
      cells: [
        ["?", "?", "?"],
        ["?", "?", "?"],
        ["?", "?", "?"],
      ],
    },
    steps: [
      {
        instruction: "Vamos organizar na tabela!",
        explanation: "3 amigos, 3 esportes. Cada um pratica um esporte diferente.",
        action: { type: "init" },
        tip: "Procure pistas afirmativas primeiro!",
      },
      {
        instruction: "Pista 2: 'Marcos pratica futebol'",
        explanation: "Informação direta! Marcos = Futebol.",
        action: { type: "confirm", row: 1, col: 0 },
        tip: "Pistas do tipo 'X é Y' são as mais valiosas!",
      },
      {
        instruction: "Se Marcos pratica futebol, os outros não",
        explanation: "Eliminamos futebol para Lucas e Nina.",
        action: { type: "eliminate", row: 0, col: 0 },
        tip: null,
      },
      {
        instruction: "Nina não pratica futebol",
        explanation: "Eliminando futebol para Nina (também confirmado pela pista 3).",
        action: { type: "eliminate", row: 2, col: 0 },
        tip: null,
      },
      {
        instruction: "Marcos não pratica natação nem tênis",
        explanation: "Como Marcos pratica futebol, eliminamos as outras opções.",
        action: { type: "eliminate", row: 1, col: 1 },
        tip: null,
      },
      {
        instruction: "Continuando com Marcos",
        explanation: "Marcos não pratica tênis.",
        action: { type: "eliminate", row: 1, col: 2 },
        tip: null,
      },
      {
        instruction: "Pista 1: 'Lucas não pratica natação'",
        explanation: "Eliminamos natação para Lucas.",
        action: { type: "eliminate", row: 0, col: 1 },
        tip: null,
      },
      {
        instruction: "Lucas só pode praticar tênis!",
        explanation: "Lucas não pratica futebol (Marcos pratica) nem natação (pista 1). Sobra tênis!",
        action: { type: "confirm", row: 0, col: 2 },
        tip: "Quando sobra uma opção, é a resposta!",
      },
      {
        instruction: "Nina pratica natação!",
        explanation: "Nina não pratica futebol (Marcos) nem tênis (Lucas). Sobra natação!",
        action: { type: "confirm", row: 2, col: 1 },
        tip: null,
      },
      {
        instruction: "Finalizando a tabela",
        explanation: "Nina não pratica tênis.",
        action: { type: "eliminate", row: 2, col: 2 },
        tip: "Problema resolvido!",
      },
    ],
    answer: "Lucas pratica Tênis, Marcos pratica Futebol, Nina pratica Natação",
    summary: "A pista direta (Marcos = Futebol) foi o ponto de partida. Depois, eliminamos as opções restantes até encontrar o esporte de cada um.",
  },

  // ==========================================
  // PROBLEM 8: Medium - Four Friends (Table)
  // ==========================================
  {
    id: 8,
    title: "Amigos e profissões",
    type: "table",
    difficulty: "médio",
    icon: "👔",
    description: "Quatro amigos, quatro profissões diferentes.",
    statement: `
      <p>Quatro amigos - <strong>Alice</strong>, <strong>Beto</strong>, <strong>Cléo</strong> e <strong>Davi</strong> - têm profissões diferentes.</p>
      <p>As profissões são: <strong>Professor</strong>, <strong>Médico</strong>, <strong>Arquiteto</strong> e <strong>Chef</strong>.</p>
      <p>Descubra a profissão de cada um:</p>
      <span class="clue">1. Alice não é professora nem chef.</span>
      <span class="clue">2. Beto não é médico.</span>
      <span class="clue">3. Cléo é arquiteta.</span>
      <span class="clue">4. Davi não é professor.</span>
      <span class="clue">5. Alice não é arquiteta.</span>
    `,
    initialState: {
      rows: ["Alice", "Beto", "Cléo", "Davi"],
      cols: ["Professor", "Médico", "Arquiteto", "Chef"],
      cells: [
        ["?", "?", "?", "?"],
        ["?", "?", "?", "?"],
        ["?", "?", "?", "?"],
        ["?", "?", "?", "?"],
      ],
    },
    steps: [
      {
        instruction: "Vamos analisar 4 pessoas e 4 profissões!",
        explanation: "Tabela maior, mas a lógica é a mesma: eliminar impossibilidades.",
        action: { type: "init" },
        tip: "Com mais opções, organize bem as eliminações.",
      },
      {
        instruction: "Pista 3: 'Cléo é arquiteta'",
        explanation: "Informação direta! Confirmamos Cléo como arquiteta.",
        action: { type: "confirm", row: 2, col: 2 },
        tip: "Sempre comece pelas afirmações diretas!",
      },
      {
        instruction: "Ninguém mais é arquiteto",
        explanation: "Eliminamos arquiteto para todos os outros.",
        action: { type: "eliminate", row: 0, col: 2 },
        tip: null,
      },
      {
        instruction: "Beto não é arquiteto",
        explanation: "Continuando a eliminar a coluna de arquiteto.",
        action: { type: "eliminate", row: 1, col: 2 },
        tip: null,
      },
      {
        instruction: "Davi não é arquiteto",
        explanation: "Finalizando eliminação da coluna arquiteto.",
        action: { type: "eliminate", row: 3, col: 2 },
        tip: null,
      },
      {
        instruction: "Cléo não é as outras profissões",
        explanation: "Como Cléo é arquiteta, eliminamos as outras opções para ela.",
        action: { type: "eliminate", row: 2, col: 0 },
        tip: null,
      },
      {
        instruction: "Cléo não é médica",
        explanation: "Continuando eliminação da linha de Cléo.",
        action: { type: "eliminate", row: 2, col: 1 },
        tip: null,
      },
      {
        instruction: "Cléo não é chef",
        explanation: "Finalizando linha de Cléo.",
        action: { type: "eliminate", row: 2, col: 3 },
        tip: null,
      },
      {
        instruction: "Pista 1: 'Alice não é professora nem chef'",
        explanation: "Eliminamos professor e chef para Alice.",
        action: { type: "eliminate", row: 0, col: 0 },
        tip: null,
      },
      {
        instruction: "Alice não é chef",
        explanation: "Continuando pista 1.",
        action: { type: "eliminate", row: 0, col: 3 },
        tip: null,
      },
      {
        instruction: "Alice só pode ser médica!",
        explanation: "Alice não é professora, chef nem arquiteta. Sobra médica!",
        action: { type: "confirm", row: 0, col: 1 },
        tip: "Eliminação por exclusão funciona!",
      },
      {
        instruction: "Ninguém mais é médico",
        explanation: "Eliminando médico para os outros.",
        action: { type: "eliminate", row: 1, col: 1 },
        tip: null,
      },
      {
        instruction: "Davi não é médico",
        explanation: "Continuando eliminação.",
        action: { type: "eliminate", row: 3, col: 1 },
        tip: null,
      },
      {
        instruction: "Pista 4: 'Davi não é professor'",
        explanation: "Eliminamos professor para Davi.",
        action: { type: "eliminate", row: 3, col: 0 },
        tip: null,
      },
      {
        instruction: "Davi só pode ser chef!",
        explanation: "Davi não é médico, professor nem arquiteto. Sobra chef!",
        action: { type: "confirm", row: 3, col: 3 },
        tip: null,
      },
      {
        instruction: "Beto não é chef",
        explanation: "Como Davi é chef, eliminamos para Beto.",
        action: { type: "eliminate", row: 1, col: 3 },
        tip: null,
      },
      {
        instruction: "Beto só pode ser professor!",
        explanation: "Beto não é médico (pista 2), arquiteto (Cléo é), nem chef (Davi é). Sobra professor!",
        action: { type: "confirm", row: 1, col: 0 },
        tip: "Problema resolvido!",
      },
    ],
    answer: "Alice é Médica, Beto é Professor, Cléo é Arquiteta, Davi é Chef",
    summary: "Com 4x4 opções, a estratégia foi a mesma: começar pela pista direta (Cléo = Arquiteta) e eliminar sistematicamente até descobrir todas as profissões.",
  },

  // ==========================================
  // PROBLEM 9: Medium - Sequence Fibonacci-like
  // ==========================================
  {
    id: 9,
    title: "Sequência de Fibonacci",
    type: "sequence",
    difficulty: "médio",
    icon: "🐚",
    description: "Uma sequência famosa onde cada número é a soma dos dois anteriores.",
    statement: `
      <p>Observe a sequência abaixo e descubra o próximo número:</p>
      <p style="font-size: 1.5rem; text-align: center; margin: 1rem 0;">
        <strong>1, 1, 2, 3, 5, 8, ?</strong>
      </p>
      <p><em>Dica: Essa é uma das sequências mais famosas da matemática!</em></p>
    `,
    initialState: {
      numbers: [1, 1, 2, 3, 5, 8, "?"],
      pattern: null,
      differences: [],
    },
    steps: [
      {
        instruction: "Vamos analisar essa sequência famosa!",
        explanation: "Temos: 1, 1, 2, 3, 5, 8, ?. Não é uma simples soma ou multiplicação constante.",
        action: { type: "init" },
        tip: "Quando a diferença não é constante, tente olhar para DOIS números anteriores.",
      },
      {
        instruction: "Como chegamos de 1, 1 para 2?",
        explanation: "Observe: 1 + 1 = 2. O terceiro número é a soma dos dois primeiros!",
        action: { type: "highlight", indices: [0, 1] },
        tip: "Tente somar números consecutivos.",
      },
      {
        instruction: "Confirmando: 1 + 2 = 3",
        explanation: "O segundo (1) + o terceiro (2) = 3. O padrão se confirma!",
        action: { type: "highlight", indices: [1, 2] },
        tip: null,
      },
      {
        instruction: "Continuando: 2 + 3 = 5",
        explanation: "O terceiro (2) + o quarto (3) = 5. Padrão confirmado novamente!",
        action: { type: "highlight", indices: [2, 3] },
        tip: null,
      },
      {
        instruction: "E 3 + 5 = 8",
        explanation: "O quarto (3) + o quinto (5) = 8. Esse é o padrão de Fibonacci!",
        action: { type: "highlight", indices: [3, 4] },
        tip: "Cada número é a soma dos dois anteriores.",
      },
      {
        instruction: "Aplicando: 5 + 8 = ?",
        explanation: "Seguindo o padrão: 5 + 8 = 13. O próximo número é 13!",
        action: { type: "reveal", value: 13 },
        tip: "A sequência de Fibonacci aparece na natureza: conchas, girassóis, etc!",
      },
    ],
    answer: "13",
    summary: "Esta é a Sequência de Fibonacci: cada número é a soma dos dois anteriores (1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13).",
  },

  // ==========================================
  // PROBLEM 10: Hard - Five People Complex
  // ==========================================
  {
    id: 10,
    title: "O jantar dos cinco amigos",
    type: "table",
    difficulty: "difícil",
    icon: "🍽️",
    description: "Cinco pessoas sentadas à mesa. Quem está onde?",
    statement: `
      <p>Cinco amigos - <strong>Ana</strong>, <strong>Bruno</strong>, <strong>Carlos</strong>, <strong>Diana</strong> e <strong>Eduardo</strong> - estão sentados em uma mesa retangular.</p>
      <p>As posições são: <strong>Norte</strong>, <strong>Sul</strong>, <strong>Leste</strong>, <strong>Oeste</strong> e <strong>Centro</strong>.</p>
      <p>Cada um pediu uma bebida diferente: <strong>Água</strong>, <strong>Suco</strong>, <strong>Café</strong>, <strong>Chá</strong> ou <strong>Refrigerante</strong>.</p>
      <p>Descubra a posição de cada pessoa:</p>
      <span class="clue">1. Ana está sentada no Norte.</span>
      <span class="clue">2. Quem pediu café está no Sul.</span>
      <span class="clue">3. Bruno não está no Centro nem no Leste.</span>
      <span class="clue">4. Carlos está à direita de Ana (no Leste).</span>
      <span class="clue">5. Diana pediu café.</span>
      <span class="clue">6. Eduardo não está no Norte nem no Sul.</span>
    `,
    initialState: {
      rows: ["Ana", "Bruno", "Carlos", "Diana", "Eduardo"],
      cols: ["Norte", "Sul", "Leste", "Oeste", "Centro"],
      cells: [
        ["?", "?", "?", "?", "?"],
        ["?", "?", "?", "?", "?"],
        ["?", "?", "?", "?", "?"],
        ["?", "?", "?", "?", "?"],
        ["?", "?", "?", "?", "?"],
      ],
    },
    steps: [
      {
        instruction: "Este é um desafio maior: 5 pessoas, 5 posições!",
        explanation: "Vamos resolver passo a passo, começando pelas pistas diretas.",
        action: { type: "init" },
        tip: "Em problemas grandes, organize bem e vá eliminando sistematicamente.",
      },
      {
        instruction: "Pista 1: 'Ana está sentada no Norte'",
        explanation: "Informação direta! Ana = Norte.",
        action: { type: "confirm", row: 0, col: 0 },
        tip: "Sempre comece pelas afirmações diretas!",
      },
      {
        instruction: "Pista 4: 'Carlos está no Leste'",
        explanation: "A pista diz que Carlos está à direita de Ana, que é o Leste. Carlos = Leste.",
        action: { type: "confirm", row: 2, col: 2 },
        tip: "Interprete pistas espaciais com cuidado.",
      },
      {
        instruction: "Pistas 2 e 5: 'Diana pediu café' e 'Quem pediu café está no Sul'",
        explanation: "Se Diana pediu café e quem pediu café está no Sul, então Diana = Sul!",
        action: { type: "confirm", row: 3, col: 1 },
        tip: "Combine pistas relacionadas para deduzir informações!",
      },
      {
        instruction: "Pista 6: 'Eduardo não está no Norte nem no Sul'",
        explanation: "Eliminamos Norte e Sul para Eduardo.",
        action: { type: "eliminate", row: 4, col: 0 },
        tip: null,
      },
      {
        instruction: "Eduardo não está no Sul",
        explanation: "Continuando pista 6.",
        action: { type: "eliminate", row: 4, col: 1 },
        tip: null,
      },
      {
        instruction: "Eduardo também não está no Leste",
        explanation: "Carlos está no Leste. Eliminamos para Eduardo.",
        action: { type: "eliminate", row: 4, col: 2 },
        tip: null,
      },
      {
        instruction: "Pista 3: 'Bruno não está no Centro nem no Leste'",
        explanation: "Eliminamos Centro e Leste para Bruno.",
        action: { type: "eliminate", row: 1, col: 4 },
        tip: null,
      },
      {
        instruction: "Bruno não está no Leste",
        explanation: "E Carlos já está no Leste, então isso já estava implícito.",
        action: { type: "eliminate", row: 1, col: 2 },
        tip: null,
      },
      {
        instruction: "Bruno não está no Norte nem no Sul",
        explanation: "Ana está no Norte e Diana no Sul. Eliminamos para Bruno.",
        action: { type: "eliminate", row: 1, col: 0 },
        tip: null,
      },
      {
        instruction: "Bruno não está no Sul",
        explanation: "Diana está no Sul.",
        action: { type: "eliminate", row: 1, col: 1 },
        tip: null,
      },
      {
        instruction: "Bruno só pode estar no Oeste!",
        explanation: "Bruno não está no Norte, Sul, Leste nem Centro. Sobra Oeste!",
        action: { type: "confirm", row: 1, col: 3 },
        tip: "Eliminação por exclusão em tabelas maiores funciona igual!",
      },
      {
        instruction: "Eduardo não está no Oeste",
        explanation: "Bruno está no Oeste. Eliminamos para Eduardo.",
        action: { type: "eliminate", row: 4, col: 3 },
        tip: null,
      },
      {
        instruction: "Eduardo só pode estar no Centro!",
        explanation: "Eduardo não está em Norte, Sul, Leste nem Oeste. Sobra Centro!",
        action: { type: "confirm", row: 4, col: 4 },
        tip: null,
      },
      {
        instruction: "Eliminando opções restantes para Ana",
        explanation: "Ana está no Norte, eliminamos as outras posições.",
        action: { type: "eliminate", row: 0, col: 1 },
        tip: null,
      },
      {
        instruction: "Ana não está no Leste",
        explanation: "Continuando eliminações de Ana.",
        action: { type: "eliminate", row: 0, col: 2 },
        tip: null,
      },
      {
        instruction: "Ana não está no Oeste",
        explanation: "Continuando.",
        action: { type: "eliminate", row: 0, col: 3 },
        tip: null,
      },
      {
        instruction: "Ana não está no Centro",
        explanation: "Finalizando eliminações de Ana.",
        action: { type: "eliminate", row: 0, col: 4 },
        tip: null,
      },
      {
        instruction: "Eliminando coluna Norte",
        explanation: "Ninguém mais pode estar no Norte (Ana está).",
        action: { type: "eliminate", row: 1, col: 0 },
        tip: null,
      },
      {
        instruction: "Finalizando a tabela",
        explanation: "Limpando as últimas eliminações para completar o problema.",
        action: { type: "info", text: "Tabela completa!" },
        tip: "Problema difícil resolvido com método e organização!",
      },
    ],
    answer: "Ana: Norte, Bruno: Oeste, Carlos: Leste, Diana: Sul, Eduardo: Centro",
    summary: "Problema complexo com 5 pessoas! A chave foi combinar as pistas 2 e 5 (Diana pediu café + café está no Sul = Diana no Sul). Depois, eliminação sistemática resolveu o resto.",
  },
];

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = PROBLEMS;
}
