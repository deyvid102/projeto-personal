import { useState } from "react";

export default function ModalAluno({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    objetivo: "",
    sexo: ""
  });

  const [alert, setAlert] = useState({ message: "", type: "" }); // tipo: "success" ou "error"

  function handleChange(e) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  }

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000); // some após 3s
  };

  const handleSave = async () => {
    // validação básica
    if (!formData.nome || !formData.idade || !formData.objetivo || !formData.sexo) {
      showAlert("Preencha todos os campos obrigatórios", "error");
      return;
    }

    const personalId = localStorage.getItem("userId");
    const alunoComPersonal = { ...formData, fk_personal: personalId };

    try {
      const response = await fetch("http://localhost:3000/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alunoComPersonal)
      });

      if (!response.ok) {
        throw new Error("Erro ao criar aluno");
      }

      const data = await response.json();
      console.log("Aluno criado:", data);

      if (onSave) onSave(data);

      showAlert("Aluno criado com sucesso!", "success");

      setTimeout(() => {
        onClose(); // fecha modal após 0,5s
      }, 500);

    } catch (error) {
      console.error(error);
      showAlert("Erro ao criar aluno", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">Novo aluno</h2>

        {/* ALERT */}
        {alert.message && (
          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded ${
              alert.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {alert.message}
          </div>
        )}

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
            className="form-select w-full border rounded-lg px-3 py-2"
            value={formData.objetivo}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Objetivo</option>
            <option value="1">Hipertrofia</option>
            <option value="2">Definição</option>
            <option value="3">Emagrecimento</option>
          </select>
          <select
            name="sexo"
            className="form-select w-full border rounded-lg px-3 py-2"
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
