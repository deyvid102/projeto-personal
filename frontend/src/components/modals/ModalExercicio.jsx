import { useState, useEffect } from "react";
import { FaDumbbell, FaClock, FaWeightHanging, FaListOl, FaSearch, FaPlus } from "react-icons/fa";
import SlideIn from "../SlideIn";
import SelectPersonalizado from "../SelectPersonalizado";

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

  const [grupo, setGrupo] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [filtro, setFiltro] = useState([]);

  // busca os exercícios da biblioteca do personal
  useEffect(() => {
    async function carregarExercicios() {
      try {
        const res = await fetch(`http://localhost:3000/exercicios?fk_personal=${personalId}`);
        const data = await res.json();
        setExercicios(data);
        setFiltro(data);
      } catch (err) {
        console.error("erro ao carregar exercícios", err);
      }
    }
    carregarExercicios();
  }, [personalId]);

  // processa os grupos musculares (apenas categorias reais, sem o "todos")
  useEffect(() => {
    const gruposUnicos = [...new Set(exercicios.map((e) => e.grupoMuscular))]
      .filter(Boolean)
      .map(g => ({ value: g, label: g.toUpperCase() }));
    
    setGrupos(gruposUnicos);
  }, [exercicios]);

  // lógica de filtragem para a busca
  useEffect(() => {
    let lista = exercicios;
    if (grupo) lista = lista.filter((e) => e.grupoMuscular === grupo);
    if (form.nome && !form.exercicioId) {
      lista = lista.filter((e) =>
        e.nome.toLowerCase().includes(form.nome.toLowerCase())
      );
    }
    setFiltro(lista);
  }, [grupo, form.nome, exercicios, form.exercicioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "nome") setForm((f) => ({ ...f, exercicioId: null }));
  };

  const selecionarExercicio = (ex) => {
    setForm({
      ...form,
      exercicioId: ex._id,
      nome: ex.nome,
    });
    // opcional: limpa o filtro de grupo ao selecionar um exercício específico
    setGrupo("");
  };

  const handleSave = () => {
    if (!form.exercicioId) return;
    onSave({ ...form });
    onClose();
  };

  const isInvalido = !form.exercicioId;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" 
      onClick={onClose}
    >
      <SlideIn from="bottom">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[95vh]"
        >
          
          {/* cabeçalho */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                novo <span className="text-blue-600">exercício</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-1">
                selecione um movimento da biblioteca
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* busca e filtro de grupo */}
            <div className="space-y-2 relative">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-[2]">
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="BUSCAR EXERCÍCIO..."
                    autoComplete="off"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3.5 pl-10 text-xs font-bold uppercase placeholder:text-gray-300 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                </div>
                
                <div className="flex-1 font-montserrat text-[11px] font-light">
                  <SelectPersonalizado 
                    options={grupos}
                    value={grupo}
                    onChange={(val) => setGrupo(val)}
                    placeholder={grupo === "" ? "GRUPO" : "GRUPO SELECIONADO"}
                  />
                </div>
              </div>

              {/* lista de sugestões (dropdown flutuante) */}
              {form.nome && filtro.length > 0 && !form.exercicioId && (
                <div className="absolute z-50 w-full bg-white border border-gray-100 rounded-2xl mt-1 shadow-2xl max-h-52 overflow-y-auto p-2 border-t-4 border-t-blue-600">
                  {filtro.map((ex) => (
                    <div
                      key={ex._id}
                      onClick={() => selecionarExercicio(ex)}
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-blue-50 rounded-xl transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-gray-800 uppercase tracking-tighter group-hover:text-blue-600">
                          {ex.nome}
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                          {ex.grupoMuscular}
                        </span>
                      </div>
                      <FaPlus size={10} className="text-gray-200 group-hover:text-blue-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* grid de parâmetros técnicos */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'séries', name: 'series', icon: FaListOl, placeholder: '0' },
                { label: 'repetições', name: 'repeticoes', icon: FaDumbbell, placeholder: '10-12' },
                { label: 'carga', name: 'carga', icon: FaWeightHanging, placeholder: 'ex: 20kg' },
                { label: 'descanso', name: 'descanso', icon: FaClock, placeholder: '60s' },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600/30" size={12} />
                    <input
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-600/20 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* campo de observações */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">observações</label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                placeholder="notas adicionais, técnica ou método (ex: drop-set)..."
                className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600/20 min-h-[90px] resize-none"
              />
            </div>
          </div>

          {/* footer de ações */}
          <div className="flex flex-col md:flex-row gap-2 mt-8">
            <button 
              onClick={onClose} 
              className="flex-1 order-2 md:order-1 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
            >
              descartar
            </button>
            
            <button 
              disabled={isInvalido}
              onClick={handleSave} 
              className={`flex-[2] order-1 md:order-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${isInvalido 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                  : "bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-95 hover:bg-blue-700"
                }`}
            >
              confirmar exercício
            </button>
          </div>

        </div>
      </SlideIn>
    </div>
  );
}