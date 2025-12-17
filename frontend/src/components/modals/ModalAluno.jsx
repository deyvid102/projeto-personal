import { useState, useEffect } from "react";
import SlideIn from "../SlideIn";

export default function ModalAluno({ onClose, onSave, aluno, showAlert }) {
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
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    const objetivoFinal =
      formData.objetivo === "outro"
        ? objetivoCustom.trim()
        : formData.objetivo;

    if (
      !formData.nome ||
      !formData.idade ||
      !objetivoFinal ||
      !formData.sexo ||
      !formData.status
    ) {
      showAlert("Preencha todos os campos obrigatórios", "error");
      return;
    }

    const personalId = localStorage.getItem("userId");

    const payload = {
      nome: formData.nome,
      idade: formData.idade,
      objetivo: objetivoFinal,
      sexo: formData.sexo,
      status: formData.status, // 🔥 agora sempre válido
      fk_personal: personalId,
    };

    try {
      const response = await fetch(
        isEdit
          ? `http://10.0.0.121:3000/alunos/${aluno._id}`
          : `http://10.0.0.121:3000/alunos`,
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
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <SlideIn from="bottom">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4">
            {isEdit ? "Editar aluno" : "Novo aluno"}
          </h2>

          <div className="space-y-4">
            <input
              name="nome"
              placeholder="Nome do aluno*"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              type="number"
              min="1"
              name="idade"
              placeholder="Idade*"
              value={formData.idade}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

            <select
              name="objetivo"
              value={formData.objetivo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="" disabled>
                Objetivo*
              </option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="definicao">Definição</option>
              <option value="emagrecimento">Emagrecimento</option>
              <option value="outro">Outro</option>
            </select>

            {formData.objetivo === "outro" && (
              <input
                placeholder="Descreva o objetivo"
                value={objetivoCustom}
                onChange={(e) => setObjetivoCustom(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            )}

            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="" disabled>
                Sexo*
              </option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="N">Prefiro não dizer</option>
            </select>

            {/* 🔥 STATUS COM CANCELADO (BUG RESOLVIDO) */}
            {isEdit && (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="" disabled>
                  Status*
                </option>
                <option value="A">Ativo</option>
                <option value="S">Suspenso</option>
                <option value="C">Cancelado</option>
              </select>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
