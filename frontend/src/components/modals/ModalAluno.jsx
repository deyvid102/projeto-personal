import { useState } from "react";

export default function ModalAluno({ onClose }) {
  const [formData, setForm] = useState({
    nome: "",
    idade: "",
    objetivo: "",
    sexo: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSave = async () => {
    // validação básica
    if (!formData.nome || !formData.idade || !formData.objetivo) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/aluno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log("Resposta:", data);

      onClose(); // fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Novo aluno</h2>

        <div className="space-y-4">
          {/* Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Nome do aluno"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Idade */}
          <input
            type="number"
            min="1"
            name="idade"
            placeholder="Idade"
            value={formData.idade}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Objetivo */}
          <select
            name="objetivo"
            className="form-select w-full border rounded-lg px-3 py-2"
            value={formData.objetivo}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Objetivo
            </option>
            <option value="1">Hipertrofia</option>
            <option value="2">Definição</option>
            <option value="3">Emagrecimento</option>
          </select>

          {/* Sexo */}
          <select
            name="sexo"
            className="form-select w-full border rounded-lg px-3 py-2"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Sexo
            </option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
