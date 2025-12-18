import { useState, useEffect } from "react";
import SlideIn from "../SlideIn";
import { FaTrash } from "react-icons/fa";

export default function ModalAluno({ onClose, onSave, onDelete, aluno, showAlert }) {
  const isEdit = Boolean(aluno?._id);

  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    objetivo: "",
    sexo: "",
    status: "",
  });

  const [objetivoCustom, setObjetivoCustom] = useState("");

  // 🔹 Preenche formulário ao editar
  useEffect(() => {
    if (isEdit && aluno) {
      setFormData({
        nome: aluno.nome || "",
        idade: aluno.idade || "",
        objetivo: ["hipertrofia", "definicao", "emagrecimento"].includes(
          aluno.objetivo
        )
          ? aluno.objetivo
          : "outro",
        sexo: aluno.sexo || "",
        status: aluno.status || "",
      });

      if (
        aluno.objetivo &&
        !["hipertrofia", "definicao", "emagrecimento"].includes(aluno.objetivo)
      ) {
        setObjetivoCustom(aluno.objetivo);
      }
    }
  }, [isEdit, aluno]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSave = async () => {
    const objetivoFinal =
      formData.objetivo === "outro"
        ? objetivoCustom.trim()
        : formData.objetivo;

    if (!formData.nome.trim()) {
      showAlert("O campo Nome é obrigatório", "error");
      return;
    }

    const personalId = localStorage.getItem("userId");

    const payload = {
      nome: formData.nome,
      idade: formData.idade || null,
      objetivo: objetivoFinal || "",
      sexo: formData.sexo || "",
      status: formData.status || "A",
      fk_personal: personalId,
    };

    try {
      const response = await fetch(
        isEdit
          ? `http://localhost:3000/alunos/${aluno._id}`
          : `http://localhost:3000/alunos`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      onSave(data);
      onClose();

      showAlert(
        isEdit
          ? "Aluno atualizado com sucesso"
          : "Aluno cadastrado com sucesso",
        "success"
      );
    } catch {
      showAlert("Erro ao salvar aluno", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <SlideIn from="bottom">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
        >
          {/* HEADER COM BOTÃO DE DELETAR PERMANENTE */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Editar aluno" : "Novo aluno"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEdit ? "Atualize as informações do aluno" : "Preencha os dados do novo aluno"}
              </p>
            </div>

            {isEdit && (
              <button
                type="button"
                onClick={() => onDelete(aluno)}
                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors group"
                title="Excluir permanentemente"
              >
                <FaTrash className="group-hover:scale-110 transition-transform" size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Excluir</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nome completo</label>
              <input
                name="nome"
                placeholder="Ex: João Silva"
                value={formData.nome}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Idade</label>
                <input
                  type="number"
                  name="idade"
                  placeholder="Idade"
                  value={formData.idade}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="N">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Objetivo</label>
              <select
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              >
                <option value="" disabled>Escolha o objetivo</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="definicao">Definição</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="outro">Outro (personalizado)</option>
              </select>
            </div>

            {formData.objetivo === "outro" && (
              <input
                placeholder="Qual o objetivo?"
                value={objetivoCustom}
                onChange={(e) => setObjetivoCustom(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 animate-slideIn"
              />
            )}

            {isEdit && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Status da Matrícula</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                >
                  <option value="A">Ativo</option>
                  <option value="S">Suspenso</option>
                  <option value="C">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}