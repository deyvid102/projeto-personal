import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { alunos as alunosMock } from "../data/alunos";
import ModalExercicio from "../components/modals/ModalExercicio";

export default function TreinoDetalhe() {
  const { id, treinoId } = useParams();
  const navigate = useNavigate();

  const aluno = alunosMock.find((a) => a.id === id);
  const treinoInicial = aluno?.treinos.find((t) => t.id === treinoId);

  const [treino, setTreino] = useState(treinoInicial);
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!aluno || !treino) {
    return <p>Treino não encontrado</p>;
  }

  function adicionarExercicio(dados) {
    setTreino({
      ...treino,
      exercicios: [
        ...treino.exercicios,
        {
          id: Date.now().toString(),
          ...dados,
        },
      ],
    });
    setMostrarModal(false);
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/alunos/${aluno.id}`)}
        className="text-sm text-indigo-600 mb-4"
      >
        ← Voltar para aluno
      </button>

      <h1 className="text-2xl font-bold mb-1">{treino.nome}</h1>
      <p className="text-gray-600 mb-6">
        {treino.observacoes || "Sem observações"}
      </p>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Exercícios</h2>
        <button onClick={() => setMostrarModal(true)} className="text-sm text-indigo-600">
          + Adicionar exercício
        </button>
      </div>

      {treino.exercicios.length === 0 && (
        <p className="text-gray-500">
          Nenhum exercício cadastrado.
        </p>
      )}

      <div className="grid gap-4">
        {treino.exercicios.map((ex) => (
          <div
            key={ex.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p className="font-semibold">{ex.nome}</p>
            <p className="text-sm text-gray-500">
              {ex.series}x{ex.repeticoes} • {ex.carga} • Descanso {ex.descanso}
            </p>
          </div>
        ))}
      </div>
      {mostrarModal && (
        <ModalExercicio
          onClose={() => setMostrarModal(false)}
          onSave={adicionarExercicio}
        />
      )}
    </div>
  );
}
