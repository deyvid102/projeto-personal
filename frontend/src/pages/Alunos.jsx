import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalAluno from "../components/modals/ModalAluno";
import StatusDot from "../components/StatusDot";
import Alert from "../components/Alert";
import { useAlert } from "../components/hooks/useAlert";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);

  const { alert, showAlert } = useAlert(2000);
  const { id: personalId } = useParams();
  const navigate = useNavigate();

  /* =========================
     BUSCAR ALUNOS
  ========================== */
  useEffect(() => {
    async function buscarAlunos() {
      try {
        const response = await fetch(
          `http://10.0.0.121:3000/alunos?fk_personal=${personalId}`
        );

        if (!response.ok) throw new Error();

        const data = await response.json();
        setAlunos(data);
      } catch {
        showAlert("Erro ao carregar alunos", "error");
      } finally {
        setLoading(false);
      }
    }

    buscarAlunos();
  }, [personalId, showAlert]);

  /* =========================
     LOADING
  ========================== */
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  /* =========================
     CANCELAR ALUNO
  ========================== */
  async function cancelarAluno(aluno) {
    const confirmar = window.confirm(
      `Deseja realmente cancelar o aluno ${aluno.nome}?`
    );
    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://10.0.0.121:3000/alunos/${aluno._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "C" }),
        }
      );

      if (!response.ok) throw new Error();

      const alunoAtualizado = await response.json();

      setAlunos((prev) =>
        prev.map((a) =>
          a._id === alunoAtualizado._id ? alunoAtualizado : a
        )
      );

      showAlert("Aluno cancelado", "warning");
    } catch {
      showAlert("Erro ao cancelar aluno", "error");
    }
  }

  return (
    <div>
      <Alert message={alert.message} type={alert.type} />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alunos</h1>

        {alunos.length > 0 && (
          <button
            onClick={() => {
              setAlunoEditando(null);
              setMostrarModal(true);
            }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            + Novo aluno
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {alunos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-gray-500 text-lg">
            Adicione seu primeiro aluno
          </p>

          <button
            onClick={() => {
              setAlunoEditando(null);
              setMostrarModal(true);
            }}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            + Novo aluno
          </button>
        </div>
      )}

      {/* LISTA */}
      <div className="grid gap-4">
        {alunos.map((aluno) => (
          <div
            key={aluno._id}
            onClick={() =>
              navigate(`/${personalId}/alunos/${aluno._id}`)
            }
            className="
              relative bg-white p-4 rounded-xl shadow
              cursor-pointer hover:bg-gray-50 transition
              animate-slideIn
            "
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

            {/* AÇÕES */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAlunoEditando(aluno);
                  setMostrarModal(true);
                }}
                className="p-2 rounded-full bg-gray-300 hover:bg-yellow-400 hover:text-white transition"
              >
                <FaEdit />
              </button>

              {aluno.status !== "C" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelarAluno(aluno);
                  }}
                  className="p-2 rounded-full bg-gray-300 hover:bg-red-500 hover:text-white transition"
                >
                  <FaTrash />
                </button>
              )}
            </div>

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
          showAlert={showAlert}
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
