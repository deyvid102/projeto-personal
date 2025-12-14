import { useParams, useNavigate } from "react-router-dom";
import { alunos } from "../data/alunos";

export default function AlunoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    return <p>Aluno não encontrado</p>;
  }

  return (
    <div>
      <button
        onClick={() => navigate("/alunos")}
        className="text-sm text-indigo-600 mb-4"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold">{aluno.nome}</h1>
      <p className="text-gray-600 mb-6">
        {aluno.idade} anos • Objetivo: {aluno.objetivo}
      </p>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Treinos</h2>
        <button className="text-sm text-indigo-600">
          + Novo treino
        </button>
      </div>

      {aluno.treinos.length === 0 && (
        <p className="text-gray-500">
          Nenhum treino cadastrado.
        </p>
      )}

      <div className="grid gap-4">
        {aluno.treinos.map((treino) => (
          <div
            key={treino.id}
            onClick={() =>
              navigate(`/alunos/${aluno.id}/treinos/${treino.id}`)
            }
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
          >
            <p className="font-semibold">{treino.nome}</p>
            <p className="text-sm text-gray-500">
              {treino.exercicios.length} exercícios
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
