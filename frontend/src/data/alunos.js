export const alunos = [
  {
    id: "1",
    nome: "João Silva",
    objetivo: "Hipertrofia",
    idade: 28,
    treinos: [
      {
        id: "t1",
        nome: "Treino A - Peito",
        observacoes: "Foco em carga progressiva",
        exercicios: [
          {
            id: "e1",
            nome: "Supino reto",
            series: 4,
            repeticoes: 10,
            carga: "80kg",
            descanso: "90s",
          },
          {
            id: "e2",
            nome: "Crucifixo",
            series: 3,
            repeticoes: 12,
            carga: "20kg",
            descanso: "60s",
          },
        ],
      },
      {
        id: "t2",
        nome: "Treino B - Costas",
        observacoes: "",
        exercicios: [],
      },
    ],
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    objetivo: "Emagrecimento",
    idade: 35,
    treinos: [],
  },
];
