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

  // ==========================================
  // PROBLEM 11: Table 3×3 — Animais de estimação
  // ==========================================
  {
    id: 11,
    title: "Quem tem qual animal?",
    type: "table",
    difficulty: "fácil",
    icon: "🐾",
    description: "Três donos e três animais diferentes. Use as pistas para descobrir quem tem o quê.",
    statement: `
      <p><strong>Paulo</strong>, <strong>Quézia</strong> e <strong>Ricardo</strong> têm animais de estimação diferentes: um <strong>Cachorro</strong>, um <strong>Gato</strong> e um <strong>Pássaro</strong>.</p>
      <p>Com base nas pistas, descubra o animal de cada pessoa:</p>
      <span class="clue">1. Paulo não tem cachorro.</span>
      <span class="clue">2. Quézia não tem gato nem pássaro.</span>
      <span class="clue">3. Ricardo não tem gato.</span>
    `,
    initialState: {
      rows: ["Paulo", "Quézia", "Ricardo"],
      cols: ["Cachorro", "Gato", "Pássaro"],
      cells: [["?","?","?"],["?","?","?"],["?","?","?"]],
    },
    steps: [
      { instruction: "Montando a tabela!", explanation: "Pessoas nas linhas, animais nas colunas. Vamos preencher com as pistas.", action: { type: "init" }, tip: "Comece pelas pistas que eliminam mais de uma opção!" },
      { instruction: "Pista 2: Quézia não tem gato", explanation: "Eliminamos a combinação Quézia-Gato.", action: { type: "eliminate", row: 1, col: 1 }, tip: null },
      { instruction: "Pista 2: Quézia não tem pássaro", explanation: "Também eliminamos Quézia-Pássaro. Com duas eliminações, só sobra uma opção para Quézia!", action: { type: "eliminate", row: 1, col: 2 }, tip: "Quando duas das três opções são eliminadas, a terceira é a resposta!" },
      { instruction: "Quézia só pode ter Cachorro!", explanation: "Não tem gato, não tem pássaro → só pode ter cachorro. Confirmamos!", action: { type: "confirm", row: 1, col: 0 }, tip: null },
      { instruction: "Se Quézia tem cachorro, Paulo e Ricardo não podem ter", explanation: "Eliminamos cachorro para Paulo (e para Ricardo).", action: { type: "eliminate", row: 0, col: 0 }, tip: "Cada animal pertence a uma única pessoa." },
      { instruction: "Eliminando cachorro para Ricardo também", explanation: "Quézia tem o cachorro, Ricardo não pode ter.", action: { type: "eliminate", row: 2, col: 0 }, tip: null },
      { instruction: "Pista 3: Ricardo não tem gato", explanation: "Eliminamos Ricardo-Gato.", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Ricardo só pode ter Pássaro!", explanation: "Não tem cachorro (Quézia tem) e não tem gato (pista 3). Só sobra pássaro!", action: { type: "confirm", row: 2, col: 2 }, tip: null },
      { instruction: "Paulo não pode ter pássaro", explanation: "Ricardo tem o pássaro. Eliminamos para Paulo.", action: { type: "eliminate", row: 0, col: 2 }, tip: null },
      { instruction: "Paulo só pode ter Gato!", explanation: "Não tem cachorro (Quézia tem) e não tem pássaro (Ricardo tem). Paulo tem o gato!", action: { type: "confirm", row: 0, col: 1 }, tip: "Eliminação em cascata: cada confirmação abre novas deduções." },
    ],
    answer: "Paulo tem Gato, Quézia tem Cachorro, Ricardo tem Pássaro",
    summary: "A pista 2 foi a mais poderosa: eliminou duas opções de Quézia de uma vez, forçando a conclusão imediata. Depois, cada confirmação cascateou para as próximas.",
  },

  // ==========================================
  // PROBLEM 12: Sequence — Quadrados Perfeitos
  // ==========================================
  {
    id: 12,
    title: "Sequência dos quadrados",
    type: "sequence",
    difficulty: "fácil",
    icon: "⬜",
    description: "Cada número é o quadrado do seu índice. Descubra o próximo.",
    statement: `
      <p>Observe a sequência e descubra o padrão:</p>
      <p style="font-size:1.4rem;text-align:center;margin:1rem 0;"><strong>1, 4, 9, 16, 25, ?</strong></p>
      <span class="clue">Dica: pense em multiplicação de um número por ele mesmo.</span>
    `,
    initialState: {
      numbers: [1, 4, 9, 16, 25, "?"],
      highlighted: [],
      revealed: false,
    },
    steps: [
      { instruction: "Vamos analisar os números!", explanation: "Temos: 1, 4, 9, 16, 25. Qual é o padrão?", action: { type: "init" }, tip: "Tente calcular a raiz quadrada de cada número." },
      { instruction: "1 = 1 × 1 = 1²", explanation: "O primeiro número (1) é o quadrado de 1.", action: { type: "highlight", index: 0, operation: "1²" }, tip: null },
      { instruction: "4 = 2 × 2 = 2²", explanation: "O segundo número (4) é o quadrado de 2.", action: { type: "highlight", index: 1, operation: "2²" }, tip: null },
      { instruction: "9 = 3 × 3 = 3²", explanation: "O terceiro número (9) é o quadrado de 3.", action: { type: "highlight", index: 2, operation: "3²" }, tip: null },
      { instruction: "16 = 4 × 4 = 4²", explanation: "O quarto número (16) é o quadrado de 4.", action: { type: "highlight", index: 3, operation: "4²" }, tip: null },
      { instruction: "25 = 5 × 5 = 5²", explanation: "O quinto número (25) é o quadrado de 5.", action: { type: "highlight", index: 4, operation: "5²" }, tip: null },
      { instruction: "Portanto o próximo é 6² = 36!", explanation: "O padrão é n². O sexto número deve ser 6 × 6 = 36.", action: { type: "reveal", value: 36 }, tip: "Sequências de quadrados perfeitos são muito comuns em concursos!" },
    ],
    answer: "36 (pois 6² = 36)",
    summary: "Cada termo é n²: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36. Reconhecer quadrados perfeitos é fundamental para sequências.",
  },

  // ==========================================
  // PROBLEM 13: Table 3×3 — Horários de estudo
  // ==========================================
  {
    id: 13,
    title: "Quando cada um estuda?",
    type: "table",
    difficulty: "fácil",
    icon: "📚",
    description: "Três estudantes e três períodos do dia. Descubra o horário de cada um.",
    statement: `
      <p><strong>Alice</strong>, <strong>Beto</strong> e <strong>Carol</strong> estudam em períodos diferentes: <strong>Manhã</strong>, <strong>Tarde</strong> ou <strong>Noite</strong>.</p>
      <p>Com base nas pistas:</p>
      <span class="clue">1. Alice não estuda de manhã nem de noite.</span>
      <span class="clue">2. Beto não estuda de manhã.</span>
      <span class="clue">3. Carol não estuda de noite.</span>
    `,
    initialState: {
      rows: ["Alice", "Beto", "Carol"],
      cols: ["Manhã", "Tarde", "Noite"],
      cells: [["?","?","?"],["?","?","?"],["?","?","?"]],
    },
    steps: [
      { instruction: "Montando a tabela de horários!", explanation: "Cada estudante tem um único período. Vamos usar as pistas.", action: { type: "init" }, tip: "Pistas com dois 'NÃO' são ótimas para começar!" },
      { instruction: "Pista 1: Alice não estuda de manhã", explanation: "Eliminamos Alice-Manhã.", action: { type: "eliminate", row: 0, col: 0 }, tip: null },
      { instruction: "Pista 1: Alice não estuda de noite", explanation: "Também eliminamos Alice-Noite. Com isso, Alice só pode estudar de tarde!", action: { type: "eliminate", row: 0, col: 2 }, tip: "Duas eliminações na mesma linha = confirmação imediata!" },
      { instruction: "Alice só pode estudar de Tarde!", explanation: "Não é manhã, não é noite → só pode ser tarde. Confirmado!", action: { type: "confirm", row: 0, col: 1 }, tip: null },
      { instruction: "Beto e Carol não estudam de tarde", explanation: "Alice estuda de tarde, então eliminamos tarde para os outros dois.", action: { type: "eliminate", row: 1, col: 1 }, tip: null },
      { instruction: "Carol também não estuda de tarde", explanation: "Eliminando tarde para Carol.", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Pista 2: Beto não estuda de manhã", explanation: "Eliminamos Beto-Manhã.", action: { type: "eliminate", row: 1, col: 0 }, tip: null },
      { instruction: "Beto só pode estudar de Noite!", explanation: "Não é manhã (pista 2) e não é tarde (Alice tem). Beto estuda de noite!", action: { type: "confirm", row: 1, col: 2 }, tip: null },
      { instruction: "Carol não estuda de noite", explanation: "Beto estuda de noite. Eliminamos noite para Carol.", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Carol só pode estudar de Manhã!", explanation: "Não é tarde (Alice), não é noite (Beto e pista 3 confirma). Carol estuda de manhã!", action: { type: "confirm", row: 2, col: 0 }, tip: "Problema resolvido por eliminação em cascata!" },
    ],
    answer: "Alice estuda de Tarde, Beto estuda de Noite, Carol estuda de Manhã",
    summary: "A pista 1 foi decisiva: duas eliminações para Alice forçaram sua confirmação imediata. As demais confirmações vieram em cascata.",
  },

  // ==========================================
  // PROBLEM 14: Sequence — Progressão Aritmética
  // ==========================================
  {
    id: 14,
    title: "Progressão aritmética",
    type: "sequence",
    difficulty: "fácil",
    icon: "➕",
    description: "Uma sequência onde a diferença entre termos consecutivos é sempre a mesma.",
    statement: `
      <p>Encontre o próximo número da sequência:</p>
      <p style="font-size:1.4rem;text-align:center;margin:1rem 0;"><strong>2, 5, 8, 11, ?</strong></p>
      <span class="clue">Dica: calcule a diferença entre cada par de números consecutivos.</span>
    `,
    initialState: {
      numbers: [2, 5, 8, 11, "?"],
      highlighted: [],
      revealed: false,
    },
    steps: [
      { instruction: "Analise as diferenças!", explanation: "Para encontrar o padrão de uma PA, calcule quanto aumenta de um termo para o outro.", action: { type: "init" }, tip: "Na Progressão Aritmética (PA), a razão (diferença) é constante." },
      { instruction: "De 2 para 5: +3", explanation: "5 − 2 = 3. A diferença é 3.", action: { type: "highlight", index: 0, operation: "+3" }, tip: null },
      { instruction: "De 5 para 8: +3", explanation: "8 − 5 = 3. A diferença continua sendo 3.", action: { type: "highlight", index: 1, operation: "+3" }, tip: null },
      { instruction: "De 8 para 11: +3", explanation: "11 − 8 = 3. Padrão confirmado: a razão é 3.", action: { type: "highlight", index: 2, operation: "+3" }, tip: null },
      { instruction: "Então o próximo é 11 + 3 = 14!", explanation: "Aplicando a razão 3 ao último termo: 11 + 3 = 14.", action: { type: "reveal", value: 14 }, tip: "PA com razão 3 é um dos padrões mais comuns em concursos!" },
    ],
    answer: "14 (PA com razão r = 3)",
    summary: "Progressão Aritmética: cada termo é obtido somando uma constante (razão) ao anterior. Aqui r = 3, então: 2, 5, 8, 11, 14.",
  },

  // ==========================================
  // PROBLEM 15: Order 4 — Fila do banco
  // ==========================================
  {
    id: 15,
    title: "Fila do banco",
    type: "order",
    difficulty: "médio",
    icon: "🏦",
    description: "Quatro pessoas numa fila. Use as pistas para ordenar corretamente.",
    statement: `
      <p><strong>André</strong>, <strong>Beatriz</strong>, <strong>Cláudio</strong> e <strong>Débora</strong> estão numa fila de banco.</p>
      <p>Descubra a ordem deles (1º ao 4º):</p>
      <span class="clue">1. Débora é a última da fila.</span>
      <span class="clue">2. André não é o primeiro.</span>
      <span class="clue">3. Beatriz está logo antes de André.</span>
      <span class="clue">4. Beatriz está antes de Cláudio.</span>
    `,
    initialState: {
      positions: ["1º", "2º", "3º", "4º"],
      slots: [null, null, null, null],
      people: ["André", "Beatriz", "Cláudio", "Débora"],
      eliminated: { André: [], Beatriz: [], Cláudio: [], Débora: [] },
    },
    steps: [
      { instruction: "Montando a fila!", explanation: "Quatro posições, quatro pessoas. Vamos posicionar usando as pistas.", action: { type: "init" }, tip: "Comece pelas pistas mais diretas (posições fixas)." },
      { instruction: "Pista 1: Débora é a última", explanation: "Débora ocupa a 4ª posição.", action: { type: "place", person: "Débora", position: 3 }, tip: null },
      { instruction: "Pista 2: André não é o primeiro", explanation: "Eliminamos André da 1ª posição.", action: { type: "eliminate", person: "André", positions: [0] }, tip: null },
      { instruction: "Pista 3: Beatriz está logo antes de André", explanation: "Beatriz e André são consecutivos (Beatriz-André). Quais posições isso permite?", action: { type: "info", text: "Beatriz→André: pares possíveis são 1º-2º ou 2º-3º" }, tip: "Analise todas as posições onde o par pode caber." },
      { instruction: "André não pode ser 1º, então Beatriz não pode ser 1º com André em 2º... espera!", explanation: "Se André não é 1º: André=2º ou 3º. Se André=2º → Beatriz=1º. Se André=3º → Beatriz=2º.", action: { type: "info", text: "Testando André=3º, Beatriz=2º: Cláudio ficaria em 1º" }, tip: null },
      { instruction: "Pista 4: Beatriz antes de Cláudio", explanation: "Se Beatriz=2º e Cláudio=1º, isso viola a pista 4. Contradição!", action: { type: "info", text: "Beatriz=2º, Cláudio=1º → Beatriz NÃO está antes de Cláudio. ✗" }, tip: "Quando um cenário gera contradição, eliminamos!" },
      { instruction: "Logo: Beatriz=1º, André=2º", explanation: "A única opção válida é Beatriz na 1ª posição e André na 2ª.", action: { type: "place", person: "Beatriz", position: 0 }, tip: null },
      { instruction: "Colocando André em 2º", explanation: "Beatriz está logo antes de André.", action: { type: "place", person: "André", position: 1 }, tip: null },
      { instruction: "Cláudio fica em 3º!", explanation: "Posições 1º (Beatriz), 2º (André) e 4º (Débora) estão ocupadas. Cláudio vai para o 3º lugar.", action: { type: "place", person: "Cláudio", position: 2 }, tip: "Pista 4 confirmada: Beatriz (1º) está antes de Cláudio (3º). ✓" },
    ],
    answer: "1º Beatriz, 2º André, 3º Cláudio, 4º Débora",
    summary: "A chave foi testar o par Beatriz-André nas posições disponíveis e verificar qual não contradiz a pista 4. A tentativa André=3º gerou contradição, confirmando André=2º e Beatriz=1º.",
  },

  // ==========================================
  // PROBLEM 16: Table 4×4 — Departamentos
  // ==========================================
  {
    id: 16,
    title: "Funcionários e departamentos",
    type: "table",
    difficulty: "médio",
    icon: "🏢",
    description: "Quatro funcionários, quatro departamentos. Mais combinações, mais raciocínio!",
    statement: `
      <p><strong>Elisa</strong>, <strong>Fábio</strong>, <strong>Gabi</strong> e <strong>Hugo</strong> trabalham em departamentos diferentes: <strong>RH</strong>, <strong>TI</strong>, <strong>Jurídico</strong> e <strong>Financeiro</strong>.</p>
      <span class="clue">1. Elisa não trabalha em RH.</span>
      <span class="clue">2. Fábio não trabalha em TI nem em Financeiro.</span>
      <span class="clue">3. Gabi não trabalha em RH, Jurídico nem TI.</span>
      <span class="clue">4. Hugo trabalha em Jurídico.</span>
    `,
    initialState: {
      rows: ["Elisa", "Fábio", "Gabi", "Hugo"],
      cols: ["RH", "TI", "Jurídico", "Financeiro"],
      cells: [["?","?","?","?"],["?","?","?","?"],["?","?","?","?"],["?","?","?","?"]],
    },
    steps: [
      { instruction: "Tabela 4×4 — mais complexo!", explanation: "Com 4 pessoas e 4 departamentos, há mais combinações. Comece pelas pistas diretas.", action: { type: "init" }, tip: "Em tabelas maiores, pistas diretas (fulano = X) são ouro!" },
      { instruction: "Pista 4: Hugo trabalha em Jurídico!", explanation: "Informação direta. Hugo = Jurídico. Confirmamos imediatamente.", action: { type: "confirm", row: 3, col: 2 }, tip: "Pistas afirmativas diretas resolvem uma linha inteira!" },
      { instruction: "Pista 3: Gabi não está em RH", explanation: "Eliminando RH para Gabi.", action: { type: "eliminate", row: 2, col: 0 }, tip: null },
      { instruction: "Pista 3: Gabi não está em Jurídico", explanation: "Hugo já está em Jurídico. E a pista 3 confirma.", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Pista 3: Gabi não está em TI", explanation: "Três eliminações para Gabi! Só sobra uma opção.", action: { type: "eliminate", row: 2, col: 1 }, tip: "3 de 4 opções eliminadas → confirmação automática!" },
      { instruction: "Gabi só pode estar em Financeiro!", explanation: "Não é RH, TI, nem Jurídico. Gabi = Financeiro!", action: { type: "confirm", row: 2, col: 3 }, tip: null },
      { instruction: "Pista 2: Fábio não está em TI", explanation: "Eliminando TI para Fábio.", action: { type: "eliminate", row: 1, col: 1 }, tip: null },
      { instruction: "Pista 2: Fábio não está em Financeiro", explanation: "Gabi já tem Financeiro, e a pista 2 confirma que Fábio não pode.", action: { type: "eliminate", row: 1, col: 3 }, tip: null },
      { instruction: "Fábio também não pode estar em Jurídico", explanation: "Hugo tem Jurídico. Eliminamos para Fábio.", action: { type: "eliminate", row: 1, col: 2 }, tip: null },
      { instruction: "Fábio só pode estar em RH!", explanation: "Não é TI, Financeiro, nem Jurídico. Fábio = RH!", action: { type: "confirm", row: 1, col: 0 }, tip: null },
      { instruction: "Pista 1: Elisa não está em RH", explanation: "Fábio já tem RH. E a pista confirma.", action: { type: "eliminate", row: 0, col: 0 }, tip: null },
      { instruction: "Elisa não pode estar em Jurídico nem Financeiro", explanation: "Hugo tem Jurídico e Gabi tem Financeiro. Eliminamos ambos para Elisa.", action: { type: "eliminate", row: 0, col: 2 }, tip: null },
      { instruction: "Eliminando Financeiro para Elisa", explanation: "Gabi tem Financeiro.", action: { type: "eliminate", row: 0, col: 3 }, tip: null },
      { instruction: "Elisa só pode estar em TI!", explanation: "Não é RH (Fábio), nem Jurídico (Hugo), nem Financeiro (Gabi). Elisa = TI!", action: { type: "confirm", row: 0, col: 1 }, tip: "Problema resolvido! Pista 3 foi a mais poderosa: três eliminações de uma vez." },
    ],
    answer: "Elisa: TI, Fábio: RH, Gabi: Financeiro, Hugo: Jurídico",
    summary: "A estratégia vencedora foi: confirmar Hugo (pista direta) → três eliminações para Gabi (confirmação) → eliminar para Fábio → Elisa por exclusão final.",
  },

  // ==========================================
  // PROBLEM 17: Sequence — Diferença crescente
  // ==========================================
  {
    id: 17,
    title: "Diferença que cresce",
    type: "sequence",
    difficulty: "médio",
    icon: "📈",
    description: "A diferença entre termos consecutivos não é constante — ela também aumenta!",
    statement: `
      <p>Descubra o próximo número da sequência:</p>
      <p style="font-size:1.4rem;text-align:center;margin:1rem 0;"><strong>1, 2, 4, 7, 11, ?</strong></p>
      <span class="clue">Dica: calcule as diferenças entre cada par de termos consecutivos.</span>
    `,
    initialState: {
      numbers: [1, 2, 4, 7, 11, "?"],
      highlighted: [],
      revealed: false,
    },
    steps: [
      { instruction: "Vamos calcular as diferenças!", explanation: "Se a diferença não é constante, talvez ela própria forme um padrão.", action: { type: "init" }, tip: "Quando as diferenças não são iguais, veja se elas formam uma PA." },
      { instruction: "De 1 para 2: diferença = 1", explanation: "2 − 1 = 1", action: { type: "highlight", index: 0, operation: "+1" }, tip: null },
      { instruction: "De 2 para 4: diferença = 2", explanation: "4 − 2 = 2. A diferença aumentou!", action: { type: "highlight", index: 1, operation: "+2" }, tip: null },
      { instruction: "De 4 para 7: diferença = 3", explanation: "7 − 4 = 3. Padrão: as diferenças são 1, 2, 3...", action: { type: "highlight", index: 2, operation: "+3" }, tip: null },
      { instruction: "De 7 para 11: diferença = 4", explanation: "11 − 7 = 4. As diferenças formam a sequência 1, 2, 3, 4!", action: { type: "highlight", index: 3, operation: "+4" }, tip: null },
      { instruction: "A próxima diferença é 5!", explanation: "Diferenças: 1, 2, 3, 4, 5. Então: 11 + 5 = 16.", action: { type: "reveal", value: 16 }, tip: "Sequências de 2ª ordem são muito comuns no CESPE e FCC!" },
    ],
    answer: "16 (diferenças: +1, +2, +3, +4, +5)",
    summary: "Sequência de 2ª ordem: as diferenças entre termos consecutivos formam a PA 1, 2, 3, 4, 5. O próximo passo é +5, resultando em 16.",
  },

  // ==========================================
  // PROBLEM 18: Table 3×3 — Meios de transporte
  // ==========================================
  {
    id: 18,
    title: "Como cada um vai ao trabalho?",
    type: "table",
    difficulty: "fácil",
    icon: "🚗",
    description: "Três pessoas e três meios de transporte. Raciocínio direto.",
    statement: `
      <p><strong>Laura</strong>, <strong>Marcos</strong> e <strong>Nívia</strong> usam meios de transporte diferentes para ir ao trabalho: <strong>Carro</strong>, <strong>Ônibus</strong> ou <strong>Bicicleta</strong>.</p>
      <span class="clue">1. Laura não usa ônibus.</span>
      <span class="clue">2. Nívia não usa bicicleta nem ônibus.</span>
      <span class="clue">3. Marcos não usa carro.</span>
    `,
    initialState: {
      rows: ["Laura", "Marcos", "Nívia"],
      cols: ["Carro", "Ônibus", "Bicicleta"],
      cells: [["?","?","?"],["?","?","?"],["?","?","?"]],
    },
    steps: [
      { instruction: "Qual transporte cada um usa?", explanation: "Três pistas para resolver as três associações.", action: { type: "init" }, tip: "Procure a pista com mais eliminações — ela resolve mais rápido!" },
      { instruction: "Pista 2: Nívia não usa bicicleta", explanation: "Eliminando bicicleta para Nívia.", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Pista 2: Nívia não usa ônibus", explanation: "Eliminando ônibus para Nívia. Com isso, só sobra carro!", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Nívia usa Carro!", explanation: "Não é bicicleta nem ônibus. Nívia = Carro.", action: { type: "confirm", row: 2, col: 0 }, tip: null },
      { instruction: "Laura e Marcos não usam carro", explanation: "Nívia tem o carro. Eliminamos carro para os outros dois.", action: { type: "eliminate", row: 0, col: 0 }, tip: null },
      { instruction: "Marcos também não usa carro", explanation: "Confirmando eliminação.", action: { type: "eliminate", row: 1, col: 0 }, tip: null },
      { instruction: "Pista 1: Laura não usa ônibus", explanation: "Eliminando ônibus para Laura.", action: { type: "eliminate", row: 0, col: 1 }, tip: null },
      { instruction: "Laura usa Bicicleta!", explanation: "Não usa carro (Nívia tem) nem ônibus (pista 1). Laura = Bicicleta!", action: { type: "confirm", row: 0, col: 2 }, tip: null },
      { instruction: "Marcos não usa bicicleta", explanation: "Laura tem a bicicleta. Eliminamos para Marcos.", action: { type: "eliminate", row: 1, col: 2 }, tip: null },
      { instruction: "Marcos usa Ônibus!", explanation: "Não usa carro (Nívia) nem bicicleta (Laura). Marcos = Ônibus. Confirmado!", action: { type: "confirm", row: 1, col: 1 }, tip: "Pista 3 era redundante — a lógica chegou à resposta sem precisar dela!" },
    ],
    answer: "Laura: Bicicleta, Marcos: Ônibus, Nívia: Carro",
    summary: "A pista 2 foi o ponto de partida ideal: duas eliminações para Nívia levaram à confirmação imediata. O restante veio por eliminação natural.",
  },

  // ==========================================
  // PROBLEM 19: Order 5 — Prova de natação
  // ==========================================
  {
    id: 19,
    title: "Chegada na prova de natação",
    type: "order",
    difficulty: "médio",
    icon: "🏊",
    description: "Cinco atletas numa prova de natação. Descubra a ordem de chegada.",
    statement: `
      <p><strong>Ana</strong>, <strong>Beto</strong>, <strong>Cíntia</strong>, <strong>Duda</strong> e <strong>Enzo</strong> competem numa prova de natação.</p>
      <p>Descubra a ordem de chegada (1º ao 5º):</p>
      <span class="clue">1. Beto chegou em 1º lugar.</span>
      <span class="clue">2. Duda chegou em 5º lugar.</span>
      <span class="clue">3. Enzo não chegou nos três primeiros.</span>
      <span class="clue">4. Cíntia chegou imediatamente antes de Ana.</span>
    `,
    initialState: {
      positions: ["1º", "2º", "3º", "4º", "5º"],
      slots: [null, null, null, null, null],
      people: ["Ana", "Beto", "Cíntia", "Duda", "Enzo"],
      eliminated: { Ana: [], Beto: [], Cíntia: [], Duda: [], Enzo: [] },
    },
    steps: [
      { instruction: "Cinco atletas — cinco posições!", explanation: "Pistas diretas primeiro, depois as posicionais.", action: { type: "init" }, tip: "Em problemas de 5, pistas de posição fixa resolvem rápido." },
      { instruction: "Pista 1: Beto chegou em 1º", explanation: "Posicionamos Beto imediatamente.", action: { type: "place", person: "Beto", position: 0 }, tip: null },
      { instruction: "Pista 2: Duda chegou em 5º", explanation: "Posicionamos Duda no último lugar.", action: { type: "place", person: "Duda", position: 4 }, tip: null },
      { instruction: "Pista 3: Enzo não chegou nos três primeiros", explanation: "Enzo não é 1º (Beto), não é 2º, não é 3º. Logo Enzo está no 4º ou 5º.", action: { type: "eliminate", person: "Enzo", positions: [1, 2] }, tip: null },
      { instruction: "Enzo também não é 5º", explanation: "Duda já está em 5º. Então Enzo só pode ser 4º!", action: { type: "place", person: "Enzo", position: 3 }, tip: "Eliminação + posição já ocupada = confirmação!" },
      { instruction: "Restam Ana e Cíntia para 2º e 3º", explanation: "Pela pista 4, Cíntia chega imediatamente antes de Ana. Nos lugares 2 e 3, isso significa Cíntia=2º e Ana=3º.", action: { type: "info", text: "Cíntia→Ana: posições 2º e 3º (únicos consecutivos disponíveis)" }, tip: null },
      { instruction: "Cíntia chega em 2º!", explanation: "Cíntia está logo antes de Ana.", action: { type: "place", person: "Cíntia", position: 1 }, tip: null },
      { instruction: "Ana chega em 3º!", explanation: "Ana está logo após Cíntia. Problema resolvido!", action: { type: "place", person: "Ana", position: 2 }, tip: "Pistas de consecutividade funcionam melhor quando há poucas posições restantes." },
    ],
    answer: "1º Beto, 2º Cíntia, 3º Ana, 4º Enzo, 5º Duda",
    summary: "Pistas 1 e 2 fixaram Beto e Duda. A pista 3 eliminou Enzo dos três primeiros e, com Duda já em 5º, Enzo só cabia em 4º. Ana e Cíntia preencheram os últimos lugares respeitando a consecutividade.",
  },

  // ==========================================
  // PROBLEM 20: Table 4×4 — Idiomas
  // ==========================================
  {
    id: 20,
    title: "Quem fala qual idioma?",
    type: "table",
    difficulty: "médio",
    icon: "🌍",
    description: "Quatro servidores e quatro idiomas. Raciocínio em tabela 4×4.",
    statement: `
      <p><strong>Felipe</strong>, <strong>Gabi</strong>, <strong>Hana</strong> e <strong>Igor</strong> falam idiomas diferentes: <strong>Inglês</strong>, <strong>Espanhol</strong>, <strong>Francês</strong> e <strong>Alemão</strong>.</p>
      <span class="clue">1. Felipe não fala inglês nem espanhol.</span>
      <span class="clue">2. Gabi não fala francês nem alemão.</span>
      <span class="clue">3. Hana não fala inglês, espanhol nem francês.</span>
      <span class="clue">4. Igor não fala inglês nem francês.</span>
    `,
    initialState: {
      rows: ["Felipe", "Gabi", "Hana", "Igor"],
      cols: ["Inglês", "Espanhol", "Francês", "Alemão"],
      cells: [["?","?","?","?"],["?","?","?","?"],["?","?","?","?"],["?","?","?","?"]],
    },
    steps: [
      { instruction: "Tabela de idiomas — quatro línguas!", explanation: "Pista 3 elimina três opções para Hana. Comecemos por ela.", action: { type: "init" }, tip: "A pista com mais eliminações deve ser processada primeiro." },
      { instruction: "Pista 3: Hana não fala inglês", explanation: "Eliminando inglês para Hana.", action: { type: "eliminate", row: 2, col: 0 }, tip: null },
      { instruction: "Pista 3: Hana não fala espanhol", explanation: "Eliminando espanhol para Hana.", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Pista 3: Hana não fala francês", explanation: "Com três eliminações, só sobra alemão!", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Hana fala Alemão!", explanation: "Não é inglês, espanhol, nem francês. Hana = Alemão.", action: { type: "confirm", row: 2, col: 3 }, tip: null },
      { instruction: "Pista 4: Igor não fala inglês", explanation: "Eliminando inglês para Igor.", action: { type: "eliminate", row: 3, col: 0 }, tip: null },
      { instruction: "Pista 4: Igor não fala francês", explanation: "Eliminando francês para Igor.", action: { type: "eliminate", row: 3, col: 2 }, tip: null },
      { instruction: "Igor não fala alemão", explanation: "Hana fala alemão. Eliminamos para Igor.", action: { type: "eliminate", row: 3, col: 3 }, tip: null },
      { instruction: "Igor fala Espanhol!", explanation: "Não é inglês (pista 4), não é francês (pista 4), não é alemão (Hana). Igor = Espanhol!", action: { type: "confirm", row: 3, col: 1 }, tip: null },
      { instruction: "Pista 2: Gabi não fala francês", explanation: "Eliminando francês para Gabi.", action: { type: "eliminate", row: 1, col: 2 }, tip: null },
      { instruction: "Pista 2: Gabi não fala alemão", explanation: "Eliminando alemão para Gabi. Hana já tem alemão também.", action: { type: "eliminate", row: 1, col: 3 }, tip: null },
      { instruction: "Gabi não fala espanhol", explanation: "Igor fala espanhol. Eliminamos para Gabi.", action: { type: "eliminate", row: 1, col: 1 }, tip: null },
      { instruction: "Gabi fala Inglês!", explanation: "Não é espanhol (Igor), francês, nem alemão. Gabi = Inglês!", action: { type: "confirm", row: 1, col: 0 }, tip: null },
      { instruction: "Pista 1: Felipe não fala inglês nem espanhol", explanation: "Com Gabi=Inglês e Igor=Espanhol, eliminamos ambos para Felipe.", action: { type: "eliminate", row: 0, col: 0 }, tip: null },
      { instruction: "Eliminando espanhol para Felipe", explanation: "Igor tem espanhol.", action: { type: "eliminate", row: 0, col: 1 }, tip: null },
      { instruction: "Felipe não fala alemão", explanation: "Hana tem alemão. Só sobra francês!", action: { type: "eliminate", row: 0, col: 3 }, tip: null },
      { instruction: "Felipe fala Francês!", explanation: "Eliminação completa. Felipe = Francês. Problema resolvido!", action: { type: "confirm", row: 0, col: 2 }, tip: "Pista 3 (3 eliminações) foi o divisor de águas deste problema." },
    ],
    answer: "Felipe: Francês, Gabi: Inglês, Hana: Alemão, Igor: Espanhol",
    summary: "Pista 3 abriu o problema ao confirmar Hana=Alemão. As demais pistas foram aplicadas em sequência, cada confirmação gerando novas eliminações.",
  },

  // ==========================================
  // PROBLEM 21: Sequence — Números triangulares
  // ==========================================
  {
    id: 21,
    title: "Números triangulares",
    type: "sequence",
    difficulty: "médio",
    icon: "🔺",
    description: "Uma sequência clássica com diferenças crescentes. Muito cobrada em provas!",
    statement: `
      <p>Descubra o próximo número:</p>
      <p style="font-size:1.4rem;text-align:center;margin:1rem 0;"><strong>1, 3, 6, 10, ?</strong></p>
      <span class="clue">Dica: calcule a diferença entre cada par de termos consecutivos.</span>
    `,
    initialState: {
      numbers: [1, 3, 6, 10, "?"],
      highlighted: [],
      revealed: false,
    },
    steps: [
      { instruction: "Analise as diferenças entre os termos!", explanation: "Quando as diferenças não são constantes, verifique se elas formam um padrão.", action: { type: "init" }, tip: "Números triangulares aparecem em problemas de combinatória e sequências." },
      { instruction: "De 1 para 3: diferença = 2", explanation: "3 − 1 = 2", action: { type: "highlight", index: 0, operation: "+2" }, tip: null },
      { instruction: "De 3 para 6: diferença = 3", explanation: "6 − 3 = 3. A diferença aumentou de 2 para 3.", action: { type: "highlight", index: 1, operation: "+3" }, tip: null },
      { instruction: "De 6 para 10: diferença = 4", explanation: "10 − 6 = 4. As diferenças são 2, 3, 4 — sequência crescente!", action: { type: "highlight", index: 2, operation: "+4" }, tip: null },
      { instruction: "A próxima diferença é 5!", explanation: "A sequência de diferenças é 2, 3, 4, 5. Então: 10 + 5 = 15.", action: { type: "reveal", value: 15 }, tip: "T(n) = n×(n+1)÷2: T(5) = 5×6÷2 = 15. Fórmula útil para decorar!" },
    ],
    answer: "15 (número triangular T₅ = 5×6÷2 = 15)",
    summary: "Números triangulares: T(n) = n×(n+1)/2. As diferenças consecutivas são 2, 3, 4, 5... A próxima diferença é +5, resultando em 15.",
  },

  // ==========================================
  // PROBLEM 22: Table 3×3 — Cores de roupa
  // ==========================================
  {
    id: 22,
    title: "Qual cor cada um usa?",
    type: "table",
    difficulty: "fácil",
    icon: "👕",
    description: "Três pessoas com camisetas de cores diferentes. Lógica simples e direta.",
    statement: `
      <p><strong>João</strong>, <strong>Karla</strong> e <strong>Luís</strong> usam camisetas de cores diferentes: <strong>Vermelho</strong>, <strong>Azul</strong> e <strong>Verde</strong>.</p>
      <span class="clue">1. João não usa vermelho.</span>
      <span class="clue">2. Karla não usa azul.</span>
      <span class="clue">3. Luís não usa verde nem azul.</span>
    `,
    initialState: {
      rows: ["João", "Karla", "Luís"],
      cols: ["Vermelho", "Azul", "Verde"],
      cells: [["?","?","?"],["?","?","?"],["?","?","?"]],
    },
    steps: [
      { instruction: "Três cores, três pessoas!", explanation: "Pista 3 tem duas eliminações — ótimo ponto de partida.", action: { type: "init" }, tip: "Comece sempre pela pista com mais restrições." },
      { instruction: "Pista 3: Luís não usa verde", explanation: "Eliminando verde para Luís.", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Pista 3: Luís não usa azul", explanation: "Eliminando azul para Luís. Com duas eliminações, só sobra vermelho!", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Luís usa Vermelho!", explanation: "Não é verde nem azul. Luís = Vermelho.", action: { type: "confirm", row: 2, col: 0 }, tip: null },
      { instruction: "João e Karla não usam vermelho", explanation: "Luís tem o vermelho. Eliminamos para João e Karla.", action: { type: "eliminate", row: 0, col: 0 }, tip: null },
      { instruction: "Karla também não usa vermelho", explanation: "Eliminando vermelho para Karla.", action: { type: "eliminate", row: 1, col: 0 }, tip: null },
      { instruction: "Pista 2: Karla não usa azul", explanation: "Eliminando azul para Karla. Com vermelho e azul eliminados, só sobra verde!", action: { type: "eliminate", row: 1, col: 1 }, tip: null },
      { instruction: "Karla usa Verde!", explanation: "Não é vermelho (Luís) nem azul (pista 2). Karla = Verde.", action: { type: "confirm", row: 1, col: 2 }, tip: null },
      { instruction: "João não usa verde", explanation: "Karla tem verde. Eliminamos para João.", action: { type: "eliminate", row: 0, col: 2 }, tip: null },
      { instruction: "João usa Azul!", explanation: "Não usa vermelho (Luís), nem verde (Karla). João = Azul!", action: { type: "confirm", row: 0, col: 1 }, tip: "Pista 1 era redundante — a lógica chegou à resposta sem ela!" },
    ],
    answer: "João: Azul, Karla: Verde, Luís: Vermelho",
    summary: "Pista 3 foi o ponto de partida perfeito: duas eliminações para Luís → confirmação imediata. O efeito cascata resolveu as demais em sequência.",
  },

  // ==========================================
  // PROBLEM 23: Order 4 — Entrevistas de emprego
  // ==========================================
  {
    id: 23,
    title: "Ordem das entrevistas",
    type: "order",
    difficulty: "médio",
    icon: "💼",
    description: "Quatro candidatos em entrevistas sequenciais. Ordene-os pelo horário de atendimento.",
    statement: `
      <p><strong>Flávia</strong>, <strong>Guto</strong>, <strong>Hélio</strong> e <strong>Íris</strong> passam por entrevistas em horários diferentes (1º ao 4º).</p>
      <span class="clue">1. Íris é a última a ser entrevistada.</span>
      <span class="clue">2. Guto não é o primeiro.</span>
      <span class="clue">3. Flávia é entrevistada logo antes de Guto.</span>
      <span class="clue">4. Flávia é entrevistada antes de Hélio.</span>
    `,
    initialState: {
      positions: ["1º", "2º", "3º", "4º"],
      slots: [null, null, null, null],
      people: ["Flávia", "Guto", "Hélio", "Íris"],
      eliminated: { Flávia: [], Guto: [], Hélio: [], Íris: [] },
    },
    steps: [
      { instruction: "Quatro candidatos, quatro horários!", explanation: "Começamos pelo que é certo e testamos os demais.", action: { type: "init" }, tip: "Pistas de consecutividade exigem teste de hipóteses." },
      { instruction: "Pista 1: Íris é a última", explanation: "Íris ocupa a 4ª posição.", action: { type: "place", person: "Íris", position: 3 }, tip: null },
      { instruction: "Pista 2: Guto não é o primeiro", explanation: "Eliminamos Guto da posição 1.", action: { type: "eliminate", person: "Guto", positions: [0] }, tip: null },
      { instruction: "Pista 3: Flávia está logo antes de Guto", explanation: "Flávia e Guto são consecutivos. Como Guto≠1, os pares possíveis são Flávia=1/Guto=2 ou Flávia=2/Guto=3.", action: { type: "info", text: "Pares válidos: Flávia=1º→Guto=2º  ou  Flávia=2º→Guto=3º" }, tip: null },
      { instruction: "Testando Flávia=2º, Guto=3º", explanation: "Se Flávia=2, Hélio fica em 1º. Mas a pista 4 exige Flávia antes de Hélio. Hélio=1 e Flávia=2 viola isso!", action: { type: "info", text: "Flávia=2º, Hélio=1º → Flávia NÃO está antes de Hélio. Contradição! ✗" }, tip: "Quando um cenário gera contradição, ele é eliminado." },
      { instruction: "Logo: Flávia=1º, Guto=2º", explanation: "O único par válido. Flávia=1º garante que ela está antes de Hélio (pista 4).", action: { type: "place", person: "Flávia", position: 0 }, tip: null },
      { instruction: "Guto fica em 2º", explanation: "Logo após Flávia, conforme pista 3.", action: { type: "place", person: "Guto", position: 1 }, tip: null },
      { instruction: "Hélio fica em 3º!", explanation: "Posições 1º (Flávia), 2º (Guto) e 4º (Íris) estão ocupadas. Hélio vai para o 3º.", action: { type: "place", person: "Hélio", position: 2 }, tip: "Flávia (1º) está antes de Hélio (3º): pista 4 confirmada! ✓" },
    ],
    answer: "1º Flávia, 2º Guto, 3º Hélio, 4º Íris",
    summary: "A estratégia foi: fixar Íris (pista 1) e testar os pares de consecutividade da pista 3. O par Flávia=2/Guto=3 contradiz a pista 4, forçando Flávia=1 e Guto=2.",
  },

  // ==========================================
  // PROBLEM 24: Table 5×5 — Servidores e cargos
  // ==========================================
  {
    id: 24,
    title: "Servidores e seus cargos",
    type: "table",
    difficulty: "difícil",
    icon: "🏛️",
    description: "Cinco servidores públicos e cinco cargos. Raciocínio lógico de nível concurso!",
    statement: `
      <p><strong>Ana</strong>, <strong>Bruno</strong>, <strong>Carlos</strong>, <strong>Diana</strong> e <strong>Eduardo</strong> ocupam cargos diferentes: <strong>Fiscal</strong>, <strong>Auditor</strong>, <strong>Analista</strong>, <strong>Assistente</strong> e <strong>Técnico</strong>.</p>
      <span class="clue">1. Bruno é Fiscal.</span>
      <span class="clue">2. Carlos não é Auditor nem Analista.</span>
      <span class="clue">3. Diana não é Analista nem Técnica.</span>
      <span class="clue">4. Eduardo não é Auditor nem Analista.</span>
      <span class="clue">5. Carlos não é Assistente.</span>
    `,
    initialState: {
      rows: ["Ana", "Bruno", "Carlos", "Diana", "Eduardo"],
      cols: ["Fiscal", "Auditor", "Analista", "Assistente", "Técnico"],
      cells: [["?","?","?","?","?"],["?","?","?","?","?"],["?","?","?","?","?"],["?","?","?","?","?"],["?","?","?","?","?"]],
    },
    steps: [
      { instruction: "Tabela 5×5 — nível avançado!", explanation: "Com 5 cargos, a eliminação sistemática é essencial. Comece pela pista direta.", action: { type: "init" }, tip: "Em problemas difíceis, confirme o que é certo e use eliminação em cascata." },
      { instruction: "Pista 1: Bruno é Fiscal!", explanation: "Informação direta. Bruno = Fiscal. Confirmamos imediatamente.", action: { type: "confirm", row: 1, col: 0 }, tip: "Sempre comece pelas afirmações diretas — elas liberam posições para os demais." },
      { instruction: "Pista 2: Carlos não é Auditor", explanation: "Eliminando Auditor para Carlos.", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Pista 2: Carlos não é Analista", explanation: "Eliminando Analista para Carlos.", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Pista 5: Carlos não é Assistente", explanation: "Mais uma eliminação para Carlos. Fiscal já tem Bruno. Carlos só pode ser Técnico!", action: { type: "eliminate", row: 2, col: 3 }, tip: null },
      { instruction: "Carlos também não é Fiscal", explanation: "Bruno tem o cargo de Fiscal. Eliminamos para Carlos.", action: { type: "eliminate", row: 2, col: 0 }, tip: null },
      { instruction: "Carlos só pode ser Técnico!", explanation: "Não é Fiscal (Bruno), Auditor, Analista, nem Assistente. Carlos = Técnico!", action: { type: "confirm", row: 2, col: 4 }, tip: "Quatro eliminações em cascata → confirmação única." },
      { instruction: "Pista 4: Eduardo não é Auditor", explanation: "Eliminando Auditor para Eduardo.", action: { type: "eliminate", row: 4, col: 1 }, tip: null },
      { instruction: "Pista 4: Eduardo não é Analista", explanation: "Eliminando Analista para Eduardo.", action: { type: "eliminate", row: 4, col: 2 }, tip: null },
      { instruction: "Eduardo não é Fiscal nem Técnico", explanation: "Bruno tem Fiscal e Carlos tem Técnico. Eliminamos ambos para Eduardo.", action: { type: "eliminate", row: 4, col: 0 }, tip: null },
      { instruction: "Eliminando Técnico para Eduardo", explanation: "Carlos tem Técnico.", action: { type: "eliminate", row: 4, col: 4 }, tip: null },
      { instruction: "Eduardo só pode ser Assistente!", explanation: "Não é Fiscal, Auditor, Analista, nem Técnico. Eduardo = Assistente!", action: { type: "confirm", row: 4, col: 3 }, tip: null },
      { instruction: "Pista 3: Diana não é Analista", explanation: "Eliminando Analista para Diana.", action: { type: "eliminate", row: 3, col: 2 }, tip: null },
      { instruction: "Pista 3: Diana não é Técnica", explanation: "Carlos tem Técnico. E a pista 3 confirma.", action: { type: "eliminate", row: 3, col: 4 }, tip: null },
      { instruction: "Diana não é Fiscal nem Assistente", explanation: "Bruno tem Fiscal e Eduardo tem Assistente. Eliminamos para Diana.", action: { type: "eliminate", row: 3, col: 0 }, tip: null },
      { instruction: "Eliminando Assistente para Diana", explanation: "Eduardo tem Assistente.", action: { type: "eliminate", row: 3, col: 3 }, tip: null },
      { instruction: "Diana só pode ser Auditora!", explanation: "Não é Fiscal, Analista, Assistente, nem Técnica. Diana = Auditora!", action: { type: "confirm", row: 3, col: 1 }, tip: null },
      { instruction: "Ana recebe o único cargo restante!", explanation: "Fiscal=Bruno, Auditor=Diana, Técnico=Carlos, Assistente=Eduardo. Só sobra Analista para Ana!", action: { type: "confirm", row: 0, col: 2 }, tip: "Em tabelas 5×5, paciência e método vencem sempre!" },
    ],
    answer: "Ana: Analista, Bruno: Fiscal, Carlos: Técnico, Diana: Auditora, Eduardo: Assistente",
    summary: "Estratégia vencedora: pista 1 (Bruno=Fiscal) abriu tudo. Pistas 2+5 eliminaram 4 opções de Carlos → Técnico. Pista 4 levou Eduardo a Assistente. Pista 3 deixou Diana como única opção para Auditor. Ana ficou com Analista por exclusão.",
  },

  // ==========================================
  // PROBLEM 25: Sequence — Progressão Geométrica
  // ==========================================
  {
    id: 25,
    title: "Progressão geométrica de razão 3",
    type: "sequence",
    difficulty: "fácil",
    icon: "✖️",
    description: "Cada termo é três vezes o anterior. Uma PG clássica!",
    statement: `
      <p>Descubra o próximo número da sequência:</p>
      <p style="font-size:1.4rem;text-align:center;margin:1rem 0;"><strong>3, 9, 27, 81, ?</strong></p>
      <span class="clue">Dica: verifique quanto cada número é multiplicado para obter o próximo.</span>
    `,
    initialState: {
      numbers: [3, 9, 27, 81, "?"],
      highlighted: [],
      revealed: false,
    },
    steps: [
      { instruction: "Progressão Geométrica (PG)!", explanation: "Em vez de somar, na PG multiplicamos. Qual é a razão aqui?", action: { type: "init" }, tip: "Na PG, cada termo = termo anterior × razão." },
      { instruction: "3 × ? = 9 → razão = 3", explanation: "9 ÷ 3 = 3. A razão da PG é 3.", action: { type: "highlight", index: 0, operation: "×3" }, tip: null },
      { instruction: "9 × 3 = 27 ✓", explanation: "Confirmamos a razão: 9 × 3 = 27.", action: { type: "highlight", index: 1, operation: "×3" }, tip: null },
      { instruction: "27 × 3 = 81 ✓", explanation: "Confirmando: 27 × 3 = 81. Razão 3 confirmada!", action: { type: "highlight", index: 2, operation: "×3" }, tip: null },
      { instruction: "81 × 3 = 243!", explanation: "Aplicando a razão: 81 × 3 = 243.", action: { type: "reveal", value: 243 }, tip: "PG de razão 3: 3¹=3, 3²=9, 3³=27, 3⁴=81, 3⁵=243." },
    ],
    answer: "243 (PG com razão r = 3; equivale a 3⁵)",
    summary: "Progressão Geométrica com razão 3: cada termo é multiplicado por 3. Fórmula: aₙ = a₁ × rⁿ⁻¹. Aqui: a₅ = 3 × 3⁴ = 3 × 81 = 243.",
  },

  // ==========================================
  // PROBLEM 26: Table 4×4 — Viagens internacionais
  // ==========================================
  {
    id: 26,
    title: "Destinos de viagem",
    type: "table",
    difficulty: "médio",
    icon: "✈️",
    description: "Quatro viajantes, quatro destinos. Problema clássico de tabela 4×4.",
    statement: `
      <p><strong>Maria</strong>, <strong>Nelson</strong>, <strong>Olga</strong> e <strong>Pedro</strong> viajaram para destinos diferentes: <strong>Paris</strong>, <strong>Roma</strong>, <strong>Tóquio</strong> e <strong>Sydney</strong>.</p>
      <span class="clue">1. Maria não foi a Paris.</span>
      <span class="clue">2. Nelson foi a Paris.</span>
      <span class="clue">3. Olga não foi a Roma nem a Tóquio.</span>
      <span class="clue">4. Pedro não foi a Paris nem a Roma.</span>
      <span class="clue">5. Maria não foi a Sydney.</span>
    `,
    initialState: {
      rows: ["Maria", "Nelson", "Olga", "Pedro"],
      cols: ["Paris", "Roma", "Tóquio", "Sydney"],
      cells: [["?","?","?","?"],["?","?","?","?"],["?","?","?","?"],["?","?","?","?"]],
    },
    steps: [
      { instruction: "Quatro destinos, quatro viajantes!", explanation: "Pista 2 é direta. Vamos começar por ela.", action: { type: "init" }, tip: "Afirmações diretas resolvem uma linha ou coluna inteira." },
      { instruction: "Pista 2: Nelson foi a Paris!", explanation: "Confirmamos diretamente: Nelson = Paris.", action: { type: "confirm", row: 1, col: 0 }, tip: null },
      { instruction: "Pista 1: Maria não foi a Paris", explanation: "Nelson já tem Paris. Eliminamos para Maria.", action: { type: "eliminate", row: 0, col: 0 }, tip: null },
      { instruction: "Pista 4: Pedro não foi a Paris", explanation: "Nelson tem Paris. Eliminamos para Pedro.", action: { type: "eliminate", row: 3, col: 0 }, tip: null },
      { instruction: "Pista 4: Pedro não foi a Roma", explanation: "Eliminando Roma para Pedro.", action: { type: "eliminate", row: 3, col: 1 }, tip: null },
      { instruction: "Pista 3: Olga não foi a Roma", explanation: "Eliminando Roma para Olga.", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Pista 3: Olga não foi a Tóquio", explanation: "Eliminando Tóquio para Olga. Com Paris=Nelson, Roma e Tóquio eliminados, só sobra Sydney!", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Olga foi a Sydney!", explanation: "Não é Paris (Nelson), Roma, nem Tóquio. Olga = Sydney!", action: { type: "confirm", row: 2, col: 3 }, tip: null },
      { instruction: "Pedro não foi a Sydney", explanation: "Olga tem Sydney. Eliminamos para Pedro.", action: { type: "eliminate", row: 3, col: 3 }, tip: null },
      { instruction: "Pedro só pode ter ido a Tóquio!", explanation: "Não é Paris (Nelson), Roma (pista 4), nem Sydney (Olga). Pedro = Tóquio!", action: { type: "confirm", row: 3, col: 2 }, tip: null },
      { instruction: "Pista 5: Maria não foi a Sydney", explanation: "Olga tem Sydney. Eliminamos para Maria.", action: { type: "eliminate", row: 0, col: 3 }, tip: null },
      { instruction: "Maria não foi a Tóquio", explanation: "Pedro tem Tóquio. Eliminamos para Maria.", action: { type: "eliminate", row: 0, col: 2 }, tip: null },
      { instruction: "Maria só pode ter ido a Roma!", explanation: "Não é Paris (Nelson), Tóquio (Pedro), nem Sydney (Olga). Maria = Roma!", action: { type: "confirm", row: 0, col: 1 }, tip: "Problema concluído! Pistas 2 e 3 foram as mais produtivas." },
    ],
    answer: "Maria: Roma, Nelson: Paris, Olga: Sydney, Pedro: Tóquio",
    summary: "Pista 2 (Nelson=Paris) abriu o problema. Pista 3 (Olga: não Roma, não Tóquio) forçou Olga=Sydney. Com Pedro eliminado de Paris, Roma e Sydney → Pedro=Tóquio. Maria ficou com Roma.",
  },

  // ==========================================
  // PROBLEM 27: Order 5 — Corrida de bicicleta
  // ==========================================
  {
    id: 27,
    title: "Corrida de bicicleta",
    type: "order",
    difficulty: "difícil",
    icon: "🚴",
    description: "Cinco ciclistas numa prova. Eliminação por contradição é necessária!",
    statement: `
      <p><strong>Adão</strong>, <strong>Bela</strong>, <strong>Caio</strong>, <strong>Dara</strong> e <strong>Élio</strong> disputam uma corrida de bicicleta.</p>
      <p>Descubra a ordem de chegada:</p>
      <span class="clue">1. Dara chegou em 5º lugar.</span>
      <span class="clue">2. Caio não chegou em 1º nem em 5º.</span>
      <span class="clue">3. Élio chegou logo antes de Bela.</span>
      <span class="clue">4. Bela chegou antes de Adão.</span>
      <span class="clue">5. Caio não chegou em 4º lugar.</span>
    `,
    initialState: {
      positions: ["1º", "2º", "3º", "4º", "5º"],
      slots: [null, null, null, null, null],
      people: ["Adão", "Bela", "Caio", "Dara", "Élio"],
      eliminated: { Adão: [], Bela: [], Caio: [], Dara: [], Élio: [] },
    },
    steps: [
      { instruction: "Cinco ciclistas — nível difícil!", explanation: "Este problema exige testar hipóteses e eliminar contradições.", action: { type: "init" }, tip: "Em problemas difíceis, esgote as possibilidades de cada pista antes de avançar." },
      { instruction: "Pista 1: Dara chegou em 5º", explanation: "Posicionamos Dara imediatamente.", action: { type: "place", person: "Dara", position: 4 }, tip: null },
      { instruction: "Pista 2: Caio não é 1º nem 5º", explanation: "Eliminamos Caio das posições 1 e 5.", action: { type: "eliminate", person: "Caio", positions: [0, 4] }, tip: null },
      { instruction: "Pista 5: Caio não é 4º", explanation: "Mais uma restrição para Caio: não é 4º. Então Caio = 2º ou 3º.", action: { type: "eliminate", person: "Caio", positions: [3] }, tip: null },
      { instruction: "Pista 3: Élio chega logo antes de Bela", explanation: "Os pares possíveis para Élio→Bela são: (1,2), (2,3) ou (3,4). Testemos cada caso.", action: { type: "info", text: "Élio→Bela: pares (1º,2º), (2º,3º) ou (3º,4º)" }, tip: null },
      { instruction: "Testando Élio=2º, Bela=3º", explanation: "Se Élio=2 e Bela=3, restam Adão e Caio em 1º e 4º. Mas Caio≠1 e Caio≠4 → contradição!", action: { type: "info", text: "Élio=2º, Bela=3º → Caio em 1º ou 4º → Contradição! ✗" }, tip: "Elimine cenários impossíveis antes de confirmar." },
      { instruction: "Testando Élio=3º, Bela=4º", explanation: "Se Élio=3 e Bela=4, Adão vem após Bela (pista 4). Mas Bela=4 e Dara=5 → Adão>4 é impossível! Contradição!", action: { type: "info", text: "Élio=3º, Bela=4º → Adão após Bela, mas 5º=Dara → Contradição! ✗" }, tip: null },
      { instruction: "Logo: Élio=1º, Bela=2º!", explanation: "O único par válido restante é Élio=1º e Bela=2º.", action: { type: "place", person: "Élio", position: 0 }, tip: null },
      { instruction: "Bela chega em 2º", explanation: "Logo após Élio, conforme pista 3.", action: { type: "place", person: "Bela", position: 1 }, tip: null },
      { instruction: "Pista 4: Adão vem após Bela (2º)", explanation: "Adão pode ser 3º ou 4º. Caio só pode ser 2º ou 3º (restrições pistas 2 e 5), e 2º já é Bela. Logo Caio=3º!", action: { type: "info", text: "Caio só cabe em 3º (2º=Bela, 1º/4º/5º eliminados)" }, tip: null },
      { instruction: "Caio chega em 3º!", explanation: "Única posição disponível para Caio após todas as restrições.", action: { type: "place", person: "Caio", position: 2 }, tip: null },
      { instruction: "Adão chega em 4º!", explanation: "Posições 1º (Élio), 2º (Bela), 3º (Caio) e 5º (Dara) ocupadas. Adão = 4º.", action: { type: "place", person: "Adão", position: 3 }, tip: "Problema resolvido por eliminação de contradições!" },
    ],
    answer: "1º Élio, 2º Bela, 3º Caio, 4º Adão, 5º Dara",
    summary: "A chave foi testar os pares de Élio→Bela sistematicamente. Os pares (2,3) e (3,4) geraram contradições com as restrições de Caio e de Adão. Restou (1,2), e o resto se encaixou.",
  },

  // ==========================================
  // PROBLEM 28: Table 3×3 — Flores e cores
  // ==========================================
  {
    id: 28,
    title: "Flores e suas cores",
    type: "table",
    difficulty: "fácil",
    icon: "🌸",
    description: "Três flores, três cores. Um problema florido e direto!",
    statement: `
      <p>Três flores — <strong>Rosa</strong>, <strong>Margarida</strong> e <strong>Tulipa</strong> — têm cores diferentes: <strong>Vermelha</strong>, <strong>Branca</strong> ou <strong>Amarela</strong>.</p>
      <span class="clue">1. A Rosa não é branca.</span>
      <span class="clue">2. A Margarida não é vermelha nem amarela.</span>
      <span class="clue">3. A Tulipa não é vermelha.</span>
    `,
    initialState: {
      rows: ["Rosa", "Margarida", "Tulipa"],
      cols: ["Vermelha", "Branca", "Amarela"],
      cells: [["?","?","?"],["?","?","?"],["?","?","?"]],
    },
    steps: [
      { instruction: "Flores e cores — ponto de partida!", explanation: "Pista 2 tem duas eliminações. Ótimo começo!", action: { type: "init" }, tip: "Pistas com dois 'NÃO' resolvem uma linha em dois passos." },
      { instruction: "Pista 2: Margarida não é vermelha", explanation: "Eliminando vermelha para Margarida.", action: { type: "eliminate", row: 1, col: 0 }, tip: null },
      { instruction: "Pista 2: Margarida não é amarela", explanation: "Eliminando amarela para Margarida. Só sobra branca!", action: { type: "eliminate", row: 1, col: 2 }, tip: null },
      { instruction: "Margarida é Branca!", explanation: "Não é vermelha nem amarela. Margarida = Branca.", action: { type: "confirm", row: 1, col: 1 }, tip: null },
      { instruction: "Rosa e Tulipa não são brancas", explanation: "Margarida tem o branco. Eliminamos para as outras duas.", action: { type: "eliminate", row: 0, col: 1 }, tip: null },
      { instruction: "Tulipa também não é branca", explanation: "Eliminando branca para Tulipa.", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Pista 3: Tulipa não é vermelha", explanation: "Eliminando vermelha para Tulipa. Só sobra amarela!", action: { type: "eliminate", row: 2, col: 0 }, tip: null },
      { instruction: "Tulipa é Amarela!", explanation: "Não é branca (Margarida) nem vermelha (pista 3). Tulipa = Amarela!", action: { type: "confirm", row: 2, col: 2 }, tip: null },
      { instruction: "Rosa não pode ser amarela", explanation: "Tulipa tem amarela. Só sobra vermelha para Rosa!", action: { type: "eliminate", row: 0, col: 2 }, tip: null },
      { instruction: "Rosa é Vermelha!", explanation: "Não é branca (Margarida) nem amarela (Tulipa). Rosa = Vermelha! Clássico!", action: { type: "confirm", row: 0, col: 0 }, tip: "Pista 1 era redundante — a lógica chegou à resposta sem precisar dela." },
    ],
    answer: "Rosa: Vermelha, Margarida: Branca, Tulipa: Amarela",
    summary: "Pista 2 foi decisiva: duas eliminações para Margarida → confirmação imediata. Pista 3 eliminou mais uma opção para Tulipa, forçando o resultado. Rosa ficou com o único restante.",
  },

  // ==========================================
  // PROBLEM 29: Sequence — PA razão 7
  // ==========================================
  {
    id: 29,
    title: "Tabuada do 7 como sequência",
    type: "sequence",
    difficulty: "fácil",
    icon: "7️⃣",
    description: "Uma progressão aritmética com razão 7. Muito comum em provas!",
    statement: `
      <p>Descubra o próximo número:</p>
      <p style="font-size:1.4rem;text-align:center;margin:1rem 0;"><strong>7, 14, 21, 28, ?</strong></p>
      <span class="clue">Dica: calcule a diferença entre cada par de termos consecutivos.</span>
    `,
    initialState: {
      numbers: [7, 14, 21, 28, "?"],
      highlighted: [],
      revealed: false,
    },
    steps: [
      { instruction: "Analisando a PA!", explanation: "Parece familiar? Vamos confirmar o padrão.", action: { type: "init" }, tip: "Reconhecer a tabuada do 7 acelera a resolução!" },
      { instruction: "14 − 7 = 7: razão = 7", explanation: "A diferença entre o 1º e o 2º termo é 7.", action: { type: "highlight", index: 0, operation: "+7" }, tip: null },
      { instruction: "21 − 14 = 7 ✓", explanation: "Razão confirmada: +7.", action: { type: "highlight", index: 1, operation: "+7" }, tip: null },
      { instruction: "28 − 21 = 7 ✓", explanation: "PA com razão r = 7 confirmada.", action: { type: "highlight", index: 2, operation: "+7" }, tip: null },
      { instruction: "28 + 7 = 35!", explanation: "Aplicando a razão: 28 + 7 = 35.", action: { type: "reveal", value: 35 }, tip: "Esta é a PA dos múltiplos de 7. Reconhecê-la poupa tempo em prova!" },
    ],
    answer: "35 (PA com razão r = 7; múltiplos de 7)",
    summary: "Progressão Aritmética com razão 7: 7×1=7, 7×2=14, 7×3=21, 7×4=28, 7×5=35. Reconhecer a tabuada como PA é uma habilidade valiosa em concursos.",
  },

  // ==========================================
  // PROBLEM 30: Table 5×5 — Professores e disciplinas
  // ==========================================
  {
    id: 30,
    title: "Professores e suas disciplinas",
    type: "table",
    difficulty: "difícil",
    icon: "🎓",
    description: "Cinco professores, cinco disciplinas. O maior desafio de raciocínio lógico!",
    statement: `
      <p><strong>Vera</strong>, <strong>Wilson</strong>, <strong>Xana</strong>, <strong>Yago</strong> e <strong>Zara</strong> lecionam disciplinas diferentes: <strong>Matemática</strong>, <strong>Português</strong>, <strong>Ciências</strong>, <strong>História</strong> e <strong>Geografia</strong>.</p>
      <span class="clue">1. Vera não leciona Matemática nem Português.</span>
      <span class="clue">2. Wilson leciona Matemática.</span>
      <span class="clue">3. Xana não leciona Matemática, Ciências nem Geografia.</span>
      <span class="clue">4. Yago não leciona Matemática, Português nem Ciências.</span>
      <span class="clue">5. Zara não leciona Ciências, História nem Geografia.</span>
      <span class="clue">6. Vera não leciona História nem Geografia.</span>
    `,
    initialState: {
      rows: ["Vera", "Wilson", "Xana", "Yago", "Zara"],
      cols: ["Matemática", "Português", "Ciências", "História", "Geografia"],
      cells: [["?","?","?","?","?"],["?","?","?","?","?"],["?","?","?","?","?"],["?","?","?","?","?"],["?","?","?","?","?"]],
    },
    steps: [
      { instruction: "O grande desafio final: 5×5!", explanation: "Seis pistas para cinco professores. Método e paciência!", action: { type: "init" }, tip: "Em tabelas 5×5, combine pistas que atingem a mesma pessoa para forçar confirmações rápidas." },
      { instruction: "Pista 2: Wilson leciona Matemática!", explanation: "Informação direta. Wilson = Matemática.", action: { type: "confirm", row: 1, col: 0 }, tip: "Sempre resolva as pistas diretas primeiro." },
      { instruction: "Pista 1: Vera não leciona Matemática", explanation: "Wilson tem Matemática. Eliminamos para Vera.", action: { type: "eliminate", row: 0, col: 0 }, tip: null },
      { instruction: "Pista 1: Vera não leciona Português", explanation: "Eliminando Português para Vera.", action: { type: "eliminate", row: 0, col: 1 }, tip: null },
      { instruction: "Pista 6: Vera não leciona História", explanation: "Eliminando História para Vera.", action: { type: "eliminate", row: 0, col: 3 }, tip: null },
      { instruction: "Pista 6: Vera não leciona Geografia", explanation: "Eliminando Geografia para Vera. Quatro eliminações! Só sobra Ciências.", action: { type: "eliminate", row: 0, col: 4 }, tip: "Quatro eliminações de cinco opções = confirmação automática!" },
      { instruction: "Vera leciona Ciências!", explanation: "Não é Matemática (Wilson), Português, História, nem Geografia. Vera = Ciências!", action: { type: "confirm", row: 0, col: 2 }, tip: null },
      { instruction: "Pista 3: Xana não leciona Matemática", explanation: "Wilson tem Matemática. Eliminamos para Xana.", action: { type: "eliminate", row: 2, col: 0 }, tip: null },
      { instruction: "Pista 3: Xana não leciona Ciências", explanation: "Vera tem Ciências. Eliminamos para Xana.", action: { type: "eliminate", row: 2, col: 2 }, tip: null },
      { instruction: "Pista 3: Xana não leciona Geografia", explanation: "Três eliminações para Xana. Sobram apenas Português e História.", action: { type: "eliminate", row: 2, col: 4 }, tip: null },
      { instruction: "Pista 4: Yago não leciona Matemática", explanation: "Wilson tem Matemática. Eliminamos para Yago.", action: { type: "eliminate", row: 3, col: 0 }, tip: null },
      { instruction: "Pista 4: Yago não leciona Português", explanation: "Eliminando Português para Yago.", action: { type: "eliminate", row: 3, col: 1 }, tip: null },
      { instruction: "Pista 4: Yago não leciona Ciências", explanation: "Vera tem Ciências. Eliminamos para Yago. Sobram História e Geografia para Yago.", action: { type: "eliminate", row: 3, col: 2 }, tip: null },
      { instruction: "Pista 5: Zara não leciona Ciências", explanation: "Vera tem Ciências. Eliminamos para Zara.", action: { type: "eliminate", row: 4, col: 2 }, tip: null },
      { instruction: "Pista 5: Zara não leciona História", explanation: "Eliminando História para Zara.", action: { type: "eliminate", row: 4, col: 3 }, tip: null },
      { instruction: "Pista 5: Zara não leciona Geografia", explanation: "Três eliminações para Zara! Não é Matemática (Wilson) nem Ciências (Vera). Sobra Português!", action: { type: "eliminate", row: 4, col: 4 }, tip: null },
      { instruction: "Zara também não leciona Matemática", explanation: "Wilson tem Matemática.", action: { type: "eliminate", row: 4, col: 0 }, tip: null },
      { instruction: "Zara leciona Português!", explanation: "Não é Matemática, Ciências, História, nem Geografia. Zara = Português!", action: { type: "confirm", row: 4, col: 1 }, tip: null },
      { instruction: "Xana não leciona Português", explanation: "Zara tem Português. Eliminamos para Xana. Só sobra História!", action: { type: "eliminate", row: 2, col: 1 }, tip: null },
      { instruction: "Xana leciona História!", explanation: "Não é Matemática, Ciências, Geografia, nem Português. Xana = História!", action: { type: "confirm", row: 2, col: 3 }, tip: null },
      { instruction: "Yago não leciona História", explanation: "Xana tem História. Eliminamos para Yago. Só sobra Geografia!", action: { type: "eliminate", row: 3, col: 3 }, tip: null },
      { instruction: "Yago leciona Geografia!", explanation: "Não é Matemática, Português, Ciências, nem História. Yago = Geografia. Problema concluído!", action: { type: "confirm", row: 3, col: 4 }, tip: "Excelente! Você resolveu o problema mais difícil do conjunto!" },
    ],
    answer: "Vera: Ciências, Wilson: Matemática, Xana: História, Yago: Geografia, Zara: Português",
    summary: "Estratégia final: Wilson (pista direta) → Vera com 4 eliminações combinadas (pistas 1+6) → confirmação de Vera=Ciências → Zara com 3+1 eliminações → Xana e Yago por exclusão encadeada.",
  },
];

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = PROBLEMS;
}
