import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alunos as alunosMock } from "../data/alunos";
import ModalAluno from "../components/modals/ModalAluno";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  

  function adicionarAluno(novoAluno) {
    setAlunos([
      ...alunos,
      {
        id: Date.now().toString(),
        ...novoAluno,
        treinos: [],
      },
    ]);
    setMostrarModal(false);
  }

    useEffect(() => {
    async function buscarAlunos() {
      try {
        const response = await fetch("http://localhost:3000/aluno");

        if (!response.ok) {
          throw new Error("Erro ao buscar alunos");
        }

        const data = await response.json();
        setAlunos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    buscarAlunos();
  }, []);


  return (
    
    <div>

{/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Alunos</h1>

        <button
          onClick={() => setMostrarModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Novo aluno
        </button>
      </div>


{/* BODY */}
      <div className="grid gap-4">
        {alunos.map((aluno) => (
          <div
            key={aluno._id}
            onClick={() => navigate(`/alunos/${aluno._id}`)}
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
       {mostrarModal && (
        <ModalAluno
          onClose={() => setMostrarModal(false)}
          onSave={adicionarAluno}
        />
      )}
    </div>
  );
}
