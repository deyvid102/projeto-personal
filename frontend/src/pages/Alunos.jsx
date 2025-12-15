import { useEffect, useState } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import ModalAluno from "../components/modals/ModalAluno";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { id: personalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarAlunos() {
      try {
        const response = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
        if (!response.ok) throw new Error("Erro ao buscar alunos");
        const data = await response.json();
        setAlunos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    buscarAlunos();
  }, [personalId]);

  if (loading) return <p>Carregando alunos...</p>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Alunos</h1>

        {/* Botão maior só aparece se o botão menor não estiver visível */}
        {!(alunos.length === 0 && !mostrarModal) && (
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Novo aluno
          </button>
        )}
      </div>

      {/* LISTA DE ALUNOS */}
      <div className="grid gap-4">
        {alunos.length === 0 && !mostrarModal && (
          <div className="text-center text-gray-500">
            <p>Nenhum aluno cadastrado ainda.</p>
            <button
              onClick={() => setMostrarModal(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Cadastrar primeiro aluno
            </button>
          </div>
        )}

        {alunos.map((aluno) => (
          <div
            key={aluno._id}
            onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
          >
            <p className="font-semibold">{aluno.nome}</p>
            <p className="text-sm text-gray-500">
              Objetivo:
              {aluno.objetivo === "1" && " Hipertrofia"}
              {aluno.objetivo === "2" && " Definição"}
              {aluno.objetivo === "3" && " Emagrecimento"}
            </p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <ModalAluno
          onClose={() => setMostrarModal(false)}
          onSave={(novoAluno) =>
            setAlunos((prev) => [...prev, { ...novoAluno, fk_personal: personalId }])
          }
        />
      )}
    </div>
  );
}
