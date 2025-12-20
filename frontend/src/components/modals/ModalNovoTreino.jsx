import { useState } from "react";

export default function ModalNovoTreino({
  projetoId,
  personalId,
  onClose,
  onCreated
}) {
  const [form, setForm] = useState({
    nome: "",
    objetivo: "",
    observacoes: ""
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCriar() {
    if (!form.nome.trim()) {
        alert("Informe o nome do treino");
        return; 
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/treinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          obejtivo:form.objetivo,
          observacoes: form.observacoes,
          fk_projeto: projetoId,
          fk_personal: personalId,
          status: "A"
        })
      });

      if (!res.ok) throw new Error("Erro ao criar treino");

      const treino = await res.json();

      onCreated(treino); // atualiza lista
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar treino");
    } finally {
      setLoading(false);
    }
  }

   return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Novo treino</h2>

        {/* Nome */}
        <input
        type="text"
          name="nome"
          placeholder="Nome do treino"
          value={form.nome}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />

        {/* Objetivo */}
        <input
          name="objetivo"
          placeholder="Objetivo (opcional)"
          value={form.objetivo}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />

        {/* Observações */}
        <textarea
          name="observacoes"
          placeholder="Observações (opcional)"
          value={form.observacoes}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4 resize-none"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={handleCriar}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {loading ? "Criando..." : "Criar treino"}
          </button>
        </div>
      </div>
    </div>
  );
}