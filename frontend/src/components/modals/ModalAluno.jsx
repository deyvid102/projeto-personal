import { useState } from "react";
import Alert from "../Alert";
import { useAlert } from "../hooks/useAlert";

export default function ModalAluno({ onClose, onSave, aluno }) {
  const [formData, setFormData] = useState({
  nome: aluno?.nome || "",
  idade: aluno?.idade || "",
  objetivo: aluno?.objetivo || "",
  sexo: aluno?.sexo || "",
});

  // objetivo personalizado
  const [objetivoCustom, setObjetivoCustom] = useState("");

  const { alert, showAlert } = useAlert();

  function handleChange(e) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  const handleSave = async () => {
  const objetivoFinal =
    formData.objetivo === "outro"
      ? objetivoCustom.trim()
      : formData.objetivo;

  if (!formData.nome || !formData.idade || !objetivoFinal || !formData.sexo) {
    showAlert("Preencha todos os campos obrigatórios", "error");
    return;
  }

  const personalId = localStorage.getItem("userId");

  const payload = {
    ...formData,
    objetivo: objetivoFinal,
    fk_personal: personalId,
  };

  const isEdit = Boolean(aluno?._id);

  const url = isEdit
    ? `http://localhost:3000/alunos/${aluno._id}`
    : `http://localhost:3000/alunos`;

  const method = isEdit ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isEdit ? payload : { ...payload, status: "A" }
      ),
    });

    if (!response.ok) throw new Error("Erro ao salvar aluno");

    const data = await response.json();

    onSave(data);

    showAlert(
      isEdit ? "Aluno atualizado com sucesso!" : "Aluno criado com sucesso!",
      "success"
    );

    setTimeout(onClose, 500);
  } catch (error) {
    console.error(error);
    showAlert("Erro ao salvar aluno", "error");
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* ALERT GLOBAL */}
      <Alert message={alert.message} type={alert.type} />

      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Novo aluno</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome do aluno"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            min="1"
            name="idade"
            placeholder="Idade"
            value={formData.idade}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            name="objetivo"
            className="w-full border rounded-lg px-3 py-2"
            value={formData.objetivo}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Objetivo</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="definicao">Definição</option>
            <option value="emagrecimento">Emagrecimento</option>
            <option value="outro">Outro</option>
          </select>

          {/* INPUT CONDICIONAL */}
          {formData.objetivo === "outro" && (
            <input
              type="text"
              placeholder="Descreva o objetivo"
              value={objetivoCustom}
              onChange={(e) => setObjetivoCustom(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          <select
            name="sexo"
            className="w-full border rounded-lg px-3 py-2"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="">Prefiro não dizer</option>
          </select>
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
    </div>
  );
}