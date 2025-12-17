import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalAluno from "../components/modals/ModalAluno";
import StatusDot from "../components/hooks/StatusDot";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);

  const { id: personalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarAlunos() {
      try {
        const response = await fetch(
          `http://localhost:3000/alunos?fk_personal=${personalId}`
        );
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

  async function handleCancelarAluno(e, aluno) {
    e.stopPropagation();

    const confirmar = window.confirm(
      `Deseja realmente cancelar o aluno ${aluno.nome}?`
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:3000/alunos/${aluno._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "C" }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cancelar aluno");
      }

      const alunoAtualizado = await response.json();

      setAlunos((prev) =>
        prev.map((a) =>
          a._id === alunoAtualizado._id ? alunoAtualizado : a
        )
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao cancelar aluno");
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alunos</h1>

        <button
          onClick={() => {
            setAlunoEditando(null);
            setMostrarModal(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          + Novo aluno
        </button>
      </div>

      {/* LISTA */}
      <div className="grid gap-4">
        {alunos.length === 0 && (
          <div className="text-center text-gray-500">
            <p>Nenhum aluno cadastrado ainda.</p>
          </div>
        )}

        {alunos.map((aluno) => (
          <div
            key={aluno._id}
            onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
            className="relative bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50 flex flex-col"
          >
            <p className="font-semibold">
              {aluno.nome}, {aluno.idade}.
            </p>

            <p className="text-sm text-gray-500">
              Objetivo:{" "}
              {{
                hipertrofia: "Hipertrofia",
                definicao: "Definição",
                emagrecimento: "Emagrecimento",
              }[aluno.objetivo] || aluno.objetivo}
            </p>

            {/* AÇÕES (TOPO DIREITO) */}
            <div className="absolute top-3 right-3 flex gap-2">
              {/* EDITAR */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAlunoEditando(aluno);
                  setMostrarModal(true);
                }}
                className="
                  p-2 rounded-full
                  bg-gray-300 text-black
                  hover:bg-yellow-400
                "
                title="Editar aluno"
              >
                <FaEdit />
              </button>

              {/* CANCELAR (DELETE LÓGICO) */}
              <button
                onClick={(e) => handleCancelarAluno(e, aluno)}
                className="
                  p-2 rounded-full
                  bg-gray-300 text-black
                  hover:bg-red-500 hover:text-white
                "
                title="Cancelar aluno"
              >
                <FaTrash />
              </button>
            </div>

            {/* STATUS (CANTO INFERIOR DIREITO) */}
            <div className="absolute bottom-3 right-3">
              <StatusDot status={aluno.status} />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <ModalAluno
          aluno={alunoEditando}
          onClose={() => {
            setMostrarModal(false);
            setAlunoEditando(null);
          }}
          onSave={(alunoSalvo) => {
            setAlunos((prev) =>
              alunoEditando
                ? prev.map((a) =>
                    a._id === alunoSalvo._id ? alunoSalvo : a
                  )
                : [...prev, alunoSalvo]
            );
          }}
        />
      )}
    </div>
  );
}