import { useState, useEffect } from "react";
import SlideIn from "../SlideIn";
import ModalConfirmacao from "./ModalConfirmacao";
import { 
  FaDumbbell, FaStickyNote, 
  FaCalendarDay, FaCheck, FaTimes, FaTrashAlt 
} from "react-icons/fa";

export default function ModalTreino({ projetoId, personalId, treino = null, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  
  const diasDaSemana = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

  const [form, setForm] = useState({
    nome: "",
    observacoes: "",
    dia_semana: [] 
  });

  useEffect(() => {
    if (treino) {
      setForm({
        nome: treino.nome || "",
        observacoes: treino.observacoes || "",
        dia_semana: Array.isArray(treino.dia_semana) ? treino.dia_semana : [treino.dia_semana]
      });
    }
  }, [treino]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (erro) setErro(""); 
  }

  const toggleDia = (dia) => {
    setErro("");
    setForm(prev => {
      const selecionados = prev.dia_semana.includes(dia)
        ? prev.dia_semana.filter(d => d !== dia)
        : [...prev.dia_semana, dia];
      return { ...prev, dia_semana: selecionados };
    });
  };

  async function handleSalvar() {
    if (!form.nome.trim()) return setErro("o nome do treino é obrigatório");
    if (form.dia_semana.length === 0) return setErro("selecione pelo menos um dia");
    
    const isEdicao = !!treino;
    const url = isEdicao 
      ? `http://localhost:3000/treinos/${treino._id}` 
      : "http://localhost:3000/treinos";
    
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: isEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fk_projeto: projetoId,
          fk_personal: personalId
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "erro ao salvar treino");
      }

      const data = await res.json();
      onCreated(data); 
      onClose();
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar() {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/treinos/${treino._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onCreated(); 
      onClose();
    } catch (err) {
      setErro("erro ao excluir treino");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
        <SlideIn from="bottom">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl md:text-2xl font-[1000] text-gray-900 uppercase italic tracking-tighter">
                {treino ? "editar" : "novo"} <span className="text-blue-600">treino_</span>
              </h2>
              <div className="flex items-center gap-4">
                {treino && (
                  <button onClick={() => setMostrarConfirmacao(true)} className="text-gray-300 hover:text-red-500 p-2">
                    <FaTrashAlt size={16} />
                  </button>
                )}
                <button onClick={onClose} className="text-gray-400 hover:text-black"><FaTimes size={20} /></button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaDumbbell size={10} /> nome do treino
                </label>
                <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Pull Day" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all" />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaCalendarDay size={10} /> dias da semana
                </label>
                <div className="flex flex-wrap md:flex-nowrap gap-1.5 justify-between bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
                  {diasDaSemana.map(dia => (
                    <button key={dia} type="button" onClick={() => toggleDia(dia)}
                      className={`flex-1 min-w-[42px] py-2 px-1 rounded-xl text-[9px] font-[1000] transition-all border-2 ${form.dia_semana.includes(dia) ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border-transparent text-gray-400 hover:border-gray-200"}`}>
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaStickyNote size={10} /> observações
                </label>
                <textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Detalhes..." rows={3} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-3xl px-5 py-4 text-xs font-bold outline-none transition-all resize-none" />
              </div>

              {erro && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse pt-2">{erro}</p>}
            </div>

            <div className="mt-10">
              <button disabled={loading} onClick={handleSalvar} className={`w-full py-5 rounded-2xl text-[11px] font-[1000] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${loading ? "bg-gray-100 text-gray-300" : "bg-black text-white hover:bg-blue-600"}`}>
                {loading ? <span className="animate-pulse">processando...</span> : <><FaCheck size={12} /> {treino ? "atualizar" : "salvar"} treino</>}
              </button>
            </div>
          </div>
        </SlideIn>
      </div>

      {mostrarConfirmacao && (
        <ModalConfirmacao isOpen={mostrarConfirmacao} onConfirm={handleDeletar} isCritical={true} title="Excluir Treino" 
          message={<>tem certeza que deseja excluir o treino <span className="text-white font-black underline">{form.nome}</span>?</>}
          onClose={() => setMostrarConfirmacao(false)} />
      )}
    </>
  );
}