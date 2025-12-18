import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalAluno from "../components/modals/ModalAluno";
import ModalConfirmacao from "../components/modals/ModalConfirmacao"; 
import StatusDot from "../components/StatusDot";
import Alert from "../components/Alert";
import Pagination from "../components/Pagination";

// Importações ajustadas para a tua estrutura de diretórios
import { usePagination } from "../components/hooks/usePagination";
import { useAlert } from "../components/hooks/useAlert"; 

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [alunoParaCancelar, setAlunoParaCancelar] = useState(null);
  const [alunoParaDeletarPermanente, setAlunoParaDeletarPermanente] = useState(null);

  const { alert, showAlert } = useAlert(2000);
  const { id: personalId } = useParams();
  const navigate = useNavigate();

  // 🔹 CONFIGURAÇÃO: Alterado para 8 registos por página
  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(alunos, 8);

  // 🔹 Ordenação: Ativos (A) > Suspensos (S) > Cancelados (C) + Ordem Alfabética
  const ordenarAlunos = (lista) => {
    return [...lista].sort((a, b) => {
      const pesoStatus = { A: 1, S: 2, C: 3 };
      const statusA = pesoStatus[a.status] || 4;
      const statusB = pesoStatus[b.status] || 4;
      if (statusA !== statusB) return statusA - statusB;
      return a.nome.localeCompare(b.nome);
    });
  };

  useEffect(() => {
    async function buscarAlunos() {
      try {
        const response = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setAlunos(ordenarAlunos(data));
      } catch {
        showAlert("Erro ao carregar alunos", "error");
      } finally {
        setLoading(false);
      }
    }
    buscarAlunos();
  }, [personalId, showAlert]);

  async function confirmarCancelamento() {
    if (!alunoParaCancelar) return;
    try {
      const response = await fetch(`http://localhost:3000/alunos/${alunoParaCancelar._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "C" }),
      });
      if (!response.ok) throw new Error();
      const alunoAtualizado = await response.json();
      setAlunos((prev) => ordenarAlunos(prev.map((a) => (a._id === alunoAtualizado._id ? alunoAtualizado : a))));
      showAlert("Matrícula cancelada", "warning");
    } catch {
      showAlert("Erro ao cancelar", "error");
    } finally {
      setAlunoParaCancelar(null);
    }
  }

  async function deletarAlunoPermanente() {
    if (!alunoParaDeletarPermanente) return;
    try {
      const response = await fetch(`http://localhost:3000/alunos/${alunoParaDeletarPermanente._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      setAlunos((prev) => prev.filter((a) => a._id !== alunoParaDeletarPermanente._id));
      showAlert("Aluno removido com sucesso", "success");
    } catch {
      showAlert("Erro ao eliminar dados", "error");
    } finally {
      setAlunoParaDeletarPermanente(null);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[100]">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <Alert message={alert.message} type={alert.type} />

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Alunos</h1>
          <p className="text-gray-400 text-sm font-medium">Lista de atletas e performance</p>
        </div>
        
        {alunos.length > 0 && (
          <button
            onClick={() => { setAlunoEditando(null); setMostrarModal(true); }}
            className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaPlus size={14} />
            <span className="hidden sm:inline">NOVO ALUNO</span>
          </button>
        )}
      </div>

      {/* CONTEÚDO */}
      {alunos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold mb-4 uppercase tracking-widest">Nenhum aluno encontrado</p>
          <button
            onClick={() => { setAlunoEditando(null); setMostrarModal(true); }}
            className="bg-black text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform"
          >
            CADASTRAR PRIMEIRO ATLETA
          </button>
        </div>
      ) : (
        <>
          {/* GRID DE ALUNOS - EXIBINDO OS 8 REGISTOS DA PÁGINA ATUAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentData.map((aluno) => (
              <div
                key={aluno._id}
                onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
                className={`relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between min-h-[140px] cursor-pointer group
                  ${aluno.status === 'C' 
                    ? 'bg-gray-50 border-gray-100 opacity-60' 
                    : 'bg-white border-gray-100 hover:border-black hover:shadow-2xl hover:-translate-y-1'}
                `}
              >
                <div className="pr-16">
                  <h3 className={`font-black text-xl truncate tracking-tight ${aluno.status === 'C' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {aluno.nome}{aluno.idade ? `, ${aluno.idade}` : ""}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Foco:</span>
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                      {aluno.objetivo || "Geral"}
                    </span>
                  </div>
                </div>

                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setAlunoEditando(aluno); setMostrarModal(true); }}
                    className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all"
                  >
                    <FaEdit size={14} />
                  </button>
                  {aluno.status !== "C" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setAlunoParaCancelar(aluno); }}
                      className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-600 transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: {aluno._id.slice(-5)}</span>
                  <StatusDot status={aluno.status} />
                </div>
              </div>
            ))}
          </div>

          {/* COMPONENTE DE PAGINAÇÃO */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalItems}
          />
        </>
      )}

      {/* MODAIS */}
      {mostrarModal && (
        <ModalAluno
          aluno={alunoEditando}
          showAlert={showAlert}
          onClose={() => { setMostrarModal(false); setAlunoEditando(null); }}
          onDelete={(aluno) => setAlunoParaDeletarPermanente(aluno)}
          onSave={(alunoSalvo) => {
            setAlunos((prev) => {
              const novaLista = alunoEditando ? prev.map((a) => (a._id === alunoSalvo._id ? alunoSalvo : a)) : [...prev, alunoSalvo];
              return ordenarAlunos(novaLista);
            });
            setMostrarModal(false);
          }}
        />
      )}

      <ModalConfirmacao
        isOpen={Boolean(alunoParaCancelar)}
        onClose={() => setAlunoParaCancelar(null)}
        onConfirm={confirmarCancelamento}
        title="CANCELAR ALUNO?"
        message={`A matrícula de ${alunoParaCancelar?.nome} será marcada como inativa.`}
      />

      <ModalConfirmacao
        isOpen={Boolean(alunoParaDeletarPermanente)}
        onClose={() => setAlunoParaDeletarPermanente(null)}
        onConfirm={deletarAlunoPermanente}
        isCritical={true}
        title="ELIMINAR DEFINITIVO?"
        message={`Tem a certeza que deseja apagar todos os dados de ${alunoParaDeletarPermanente?.nome}? Esta ação é irreversível.`}
      />
    </div>
  );
}