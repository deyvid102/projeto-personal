import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ModalExercicio from "../components/modals/ModalExercicio";

export default function TreinoDetalhe() {
  const { id: personalId, alunoId, treinoId } = useParams();
  const navigate = useNavigate();

  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function carregarTreino() {
      try {
        const res = await fetch(
          `http://localhost:3000/treinos/${treinoId}`
        );

        if (!res.ok) throw new Error("Treino não encontrado");

        const data = await res.json();
        setTreino({
          ...data, exercicios: data.exercicios || []
        });
      } catch (err) {
        console.error(err);
        setTreino(null);
      } finally {
        setLoading(false);
      }
    }

    carregarTreino();
  }, [treinoId]);

  if (loading) return <p>Carregando treino...</p>;
  if (!treino) return <p>Treino não encontrado</p>;

  return (
    <div>
      <button
        onClick={() => navigate(`/${personalId}/alunos/${alunoId}`)}
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
        <button
          onClick={() => setMostrarModal(true)}
          className="text-sm text-indigo-600"
        >
          + Adicionar exercício
        </button>
      </div>

      {treino.exercicios.length === 0 && (
        <p className="text-gray-500">
          Nenhum exercício cadastrado.
        </p>
      )}

      <div className="grid gap-4">
        {treino.exercicios.map((ex, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p className="font-semibold">{ex.fk_exercicio?.nome || "Exercício"}</p>
            <p className="text-sm text-gray-500">
              {ex.series}x{ex.repeticoes}
              {ex.carga && ` • ${ex.carga}kg`}
              {ex.descanso && ` • Descanso ${ex.descanso}s`}
            </p>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <ModalExercicio
          treinoId={treino._id}
          onClose={() => setMostrarModal(false)}
          onSave={(novoExercicio) =>
            setTreino((prev) => ({
              ...prev,
              exercicios: [...prev.exercicios, novoExercicio],
            }))
          }
        />
      )}
    </div>
  );
}