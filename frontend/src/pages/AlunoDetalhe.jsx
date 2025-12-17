import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalNovoTreino from "../components/modals/ModalNovoTreino";

export default function AlunoDetalhe() {
  const { id: personalId, alunoId } = useParams();
  const navigate = useNavigate();

  const [aluno, setAluno] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalNovoTreino, setModalNovoTreino] = useState(false);

  function handleTreinoCriado(novoTreino) {
    setTreinos((prev) => [novoTreino, ...prev]);
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        // 🔹 BUSCA ALUNO
        const resAluno = await fetch(`http://localhost:3000/alunos/${alunoId}`);
        if (!resAluno.ok) throw new Error("Aluno não encontrado");
        console.log("status alunoRes:", resAluno.status);
        const alunoData = await resAluno.json();
        console.log("alunoData:", alunoData);

        // 🔹 BUSCA TREINOS
        const resTreinos = await fetch(`http://localhost:3000/treinos/aluno/${alunoId}`);
        const treinosData = await resTreinos.json();

        setAluno(alunoData);
        setTreinos(treinosData);
      } catch (err) {
        console.error(err);
        setAluno(null);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [alunoId]);

  if (loading) {return <p>Carregando...</p>;}
  if (!aluno) {return <p>Aluno não encontrado</p>;}

  return (
    <div>
      <button
        onClick={() => navigate(`/${personalId}/alunos`)}
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
        <button
          onClick={() => setModalNovoTreino(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          + Novo treino
        </button>
      </div>

      {treinos.length === 0 && (
        <p className="text-gray-500">
          Nenhum treino cadastrado.
        </p>
      )}

      <div className="grid gap-4">
        {treinos.map((treino) => (
          <div
            key={treino._id}
            onClick={() => navigate(`/${personalId}/alunos/${alunoId}/treinos/${treino._id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
          >
            <p className="font-semibold">{treino.nome}</p>
            <p className="text-sm text-gray-500">
              {treino.exercicios.length} exercícios
            </p>
          </div>
        ))}
      </div>
      {modalNovoTreino && (
        <ModalNovoTreino
          alunoId={alunoId}
          personalId={personalId}
          onClose={() => setModalNovoTreino(false)}
          onCreated={handleTreinoCriado}
        />
      )}
    </div>
  );
}
