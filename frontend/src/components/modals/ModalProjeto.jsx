import { useState, useEffect } from "react";
import SlideIn from "../SlideIn";
import ModalConfirmacao from "./ModalConfirmacao";
import SelectPersonalizado from "../SelectPersonalizado"; 
import { 
  FaCalendarAlt, 
  FaBullseye, 
  FaEdit, 
  FaCheck, 
  FaTrashAlt, 
  FaTimes 
} from "react-icons/fa";

export default function ModalNovoProjeto({ onClose, onCreated, alunoId, personalId, projeto }) {
  const [loading, setLoading] = useState(false);
  const [erroData, setErroData] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    objetivo: "",
    descricao: "",
    status: "R", 
    data_inicio: new Date().toISOString().split("T")[0],
    data_fim: ""
  });

  const statusOptions = [
    { value: 'R', label: 'Rascunho' },
    { value: 'AG', label: 'Agendado' },
    { value: 'A', label: 'Ativo' },
    { value: 'F', label: 'Finalizado' },
    { value: 'C', label: 'Cancelado' }
  ];

  useEffect(() => {
    if (projeto) {
      setFormData({
        nome: projeto.nome || "",
        objetivo: projeto.objetivo || "",
        descricao: projeto.descricao || "",
        status: projeto.status || "R",
        data_inicio: projeto.data_inicio ? projeto.data_inicio.split("T")[0] : "",
        data_fim: projeto.data_fim ? projeto.data_fim.split("T")[0] : ""
      });
    }
  }, [projeto]);

  const isFormularioInvalido = !formData.nome.trim() || !formData.objetivo.trim() || !formData.data_fim || loading;

  const handleSave = async () => {
    if (isFormularioInvalido) return;

    const inicio = new Date(formData.data_inicio);
    const fim = new Date(formData.data_fim);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset());
    fim.setMinutes(fim.getMinutes() + fim.getTimezoneOffset());

    if (fim < inicio) {
      setErroData("a data final deve ser posterior à inicial");
      return;
    }

    setLoading(true);
    setErroData("");

    const payload = { ...formData, fk_aluno: alunoId, fk_personal: personalId };
    const url = projeto ? `http://localhost:3000/projetos/${projeto._id}` : "http://localhost:3000/projetos";
    
    try {
      const res = await fetch(url, {
        method: projeto ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();
      onCreated(await res.json());
      onClose();
    } catch {
      setErroData("erro ao processar projeto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/projetos/${projeto._id}`, { method: "DELETE" });
      onCreated();
      onClose();
    } catch {
      setErroData("erro ao excluir projeto");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
        <SlideIn from="bottom">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl relative">
            
            {/* cabeçalho com X e lixeira */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl md:text-2xl font-[1000] text-gray-900 uppercase italic tracking-tighter leading-none">
                {projeto ? "editar" : "novo"} <span className="text-blue-600">projeto_</span>
              </h2>
              <div className="flex items-center gap-4">
                {projeto && (
                  <button onClick={() => setMostrarConfirmacao(true)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                    <FaTrashAlt size={16} />
                  </button>
                )}
                <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaEdit size={10} /> nome do projeto
                </label>
                <input 
                  value={formData.nome} 
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })} 
                  placeholder="Ex: Consultoria Mensal"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaBullseye size={10} /> objetivo principal
                </label>
                <input 
                  value={formData.objetivo} 
                  onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })} 
                  placeholder="Ex: Perda de gordura"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    <FaCalendarAlt size={10} /> início
                  </label>
                  <input 
                    type="date" 
                    value={formData.data_inicio} 
                    onChange={(e) => { setErroData(""); setFormData({ ...formData, data_inicio: e.target.value }); }} 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-4 text-xs font-bold outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    <FaCalendarAlt size={10} /> previsão fim
                  </label>
                  <input 
                    type="date" 
                    value={formData.data_fim} 
                    onChange={(e) => { setErroData(""); setFormData({ ...formData, data_fim: e.target.value }); }} 
                    className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-4 text-xs font-bold outline-none transition-all ${erroData ? "border-red-100 text-red-600" : "border-transparent"}`} 
                  />
                </div>
              </div>

              {projeto && (
                <div className="pt-2">
                  <SelectPersonalizado 
                    label="status atual"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                  />
                </div>
              )}

              {erroData && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse pt-2">{erroData}</p>}
            </div>

            {/* Botão de ação padrão ModalTreino */}
            <div className="mt-10">
              <button 
                disabled={isFormularioInvalido} 
                onClick={handleSave} 
                className={`w-full py-5 rounded-2xl text-[11px] font-[1000] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isFormularioInvalido ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-blue-600 shadow-xl"}`}
              >
                {loading ? <span className="animate-pulse">processando...</span> : <><FaCheck size={12} /> {projeto ? "atualizar" : "salvar"} projeto</>}
              </button>
            </div>
          </div>
        </SlideIn>
      </div>

      {mostrarConfirmacao && (
        <ModalConfirmacao isOpen={mostrarConfirmacao} onConfirm={handleDelete} isCritical={true} title="Excluir Projeto" message={
            <>tem certeza que deseja excluir o projeto <span className="text-white font-black underline">{projeto?.nome}</span>?</>
        } onClose={() => setMostrarConfirmacao(false)} />
      )}
    </>
  );
}