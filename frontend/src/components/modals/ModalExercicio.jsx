import { useState, useEffect } from "react";

export default function ModalExercicio({ personalId, onClose, onSave }) {
  const [form, setForm] = useState({
    exercicioId: null,
    nome: "",
    series: "",
    repeticoes: "",
    carga: "",
    descanso: "",
    observacoes: "",
  });

  const [grupo, setGrupo] = useState("")
  const [grupos, setGrupos] = useState([]);
  const [exercicios, setExercicios] = useState([])
  const [filtro, setFiltro] = useState([])

  // Carrega exercícios do banco
  useEffect(() => {
    async function carregarExercicios() {
      const res = await fetch(
        `http://localhost:3000/exercicios/${personalId}`
      );
      const data = await res.json();
      setExercicios(data);
      setFiltro(data);
    }
    carregarExercicios();
  }, [personalId]);

  useEffect(() => {
    const gruposUnicos = [...new Set(exercicios.map(e => e.grupoMuscular))];
    setGrupos(gruposUnicos);
  }, [exercicios]);

  // Filtra conforme grupo + nome
  useEffect(() => {
    let lista = exercicios;

    if (grupo) {
      lista = lista.filter(e => e.grupoMuscular === grupo);
    }

    if (form.nome) {
      lista = lista.filter(e =>
        e.nome.toLowerCase().includes(form.nome.toLowerCase())
      );
    }

    setFiltro(lista);
  }, [grupo, form.nome, exercicios]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setForm(f => ({ ...f, exercicioId: null }));
  }

  function selecionarExercicio(ex) {
    setForm({
      ...form,
      exercicioId: ex._id,
      nome: ex.nome
    });
    setGrupo("");
  }

  function handleSave() {
    if (!form.exercicioId) return;

    onSave({
      exercicioId: form.exercicioId,
      series: form.series,
      repeticoes: form.repeticoes,
      carga: form.carga,
      descanso: form.descanso,
      observacoes: form.observacoes
    });
  }

   return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4">Adicionar exercício</h2>

        {/* Grupo muscular */}
        <select
          value={grupo}
          onChange={e => setGrupo(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-2"
        >
          <option value="">Todos os grupos</option>
          {grupos.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Nome do exercício */}
        <input
          name="nome"
          placeholder="Digite o nome do exercício"
          className="w-full border rounded-lg px-3 py-2"
          value={form.nome}
          onChange={handleChange}
          autoComplete="off"
        />

        {/* Sugestões */}
        {form.nome && filtro.length > 0 && !form.exercicioId && (
          <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto">
            {filtro.map(ex => (
              <div
                key={ex._id}
                onClick={() => selecionarExercicio(ex)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <strong>{ex.nome}</strong>
                <span className="text-xs text-gray-500 ml-2">
                  {ex.grupoMuscular}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Dados do treino */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <input
            name="series"
            placeholder="Séries"
            className="border rounded-lg px-3 py-2"
            value={form.series}
            onChange={handleChange}
          />
          <input
            name="repeticoes"
            placeholder="Repetições"
            className="border rounded-lg px-3 py-2"
            value={form.repeticoes}
            onChange={handleChange}
          />
          <input
            name="carga"
            placeholder="Carga"
            className="border rounded-lg px-3 py-2"
            value={form.carga}
            onChange={handleChange}
          />
          <input
            name="descanso"
            placeholder="Descanso (seg)"
            className="border rounded-lg px-3 py-2"
            value={form.descanso}
            onChange={handleChange}
          />
          <textarea
            name="observacoes"
            placeholder="Observações"
            className="col-span-2 border rounded-lg px-3 py-2"
            rows={2}
            value={form.observacoes}
            onChange={handleChange}
          />
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.exercicioId}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}