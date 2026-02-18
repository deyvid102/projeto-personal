import { useState, useEffect } from "react";
import SlideIn from "../SlideIn";
import ModalConfirmacao from "./ModalConfirmacao";
import SelectPersonalizado from "../SelectPersonalizado"; 
import { 
  FaTrashAlt, 
  FaWhatsapp, 
  FaUser, 
  FaCheck, 
  FaTimes, 
  FaBirthdayCake, 
  FaBullseye 
} from "react-icons/fa";

const opcoesDDI = [
  { value: "+49", label: "DE +49" },
  { value: "+54", label: "AR +54" },
  { value: "+55", label: "BR +55" },
  { value: "+1", label: "CA +1" },
  { value: "+56", label: "CL +56" },
  { value: "+86", label: "CN +86" },
  { value: "+57", label: "CO +57" },
  { value: "+34", label: "ES +34" },
  { value: "+1", label: "US +1" },
  { value: "+33", label: "FR +33" },
  { value: "+44", label: "GB +44" },
  { value: "+39", label: "IT +39" },
  { value: "+81", label: "JP +81" },
  { value: "+52", label: "MX +52" },
  { value: "+351", label: "PT +351" },
  { value: "+598", label: "UY +598" },
].sort((a, b) => a.label.localeCompare(b.label));

export default function ModalAluno({ onClose, onSave, onDelete, aluno, showAlert }) {
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const isEdit = Boolean(aluno?._id);

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "", // Alterado de idade para dataNascimento
    objetivo: "",
    sexo: "N/A",
    status: "A",
    ddi: "+55",
    whatsapp: ""
  });

  const aplicarMascaraWhatsapp = (valor) => {
    if (!valor) return "";
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    return valor.substring(0, 15);
  };

  useEffect(() => {
    if (isEdit && aluno) {
      // Formata a data para YYYY-MM-DD para que o input type="date" reconheça
      const dataFormatada = aluno.dataNascimento 
        ? new Date(aluno.dataNascimento).toISOString().split('T')[0] 
        : "";

      setFormData({
        nome: aluno.nome || "",
        dataNascimento: dataFormatada,
        objetivo: aluno.objetivo || "",
        sexo: aluno.sexo || "N/A",
        status: aluno.status || "A",
        ddi: aluno.ddi || "+55",
        whatsapp: aplicarMascaraWhatsapp(aluno.whatsapp) || ""
      });
    }
  }, [isEdit, aluno]);

  const handleSave = async () => {
    if (!formData.nome.trim()) return;
    setLoading(true);

    const payload = { 
      ...formData, 
      sexo: formData.sexo === "N/A" ? "" : formData.sexo,
      whatsapp: formData.whatsapp.replace(/\D/g, ""),
      fk_personal: localStorage.getItem("userId") 
    };

    try {
      const response = await fetch(
        isEdit ? `http://localhost:3000/alunos/${aluno._id}` : `http://localhost:3000/alunos`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error();
      onSave(await response.json());
      onClose();
      showAlert(isEdit ? "aluno atualizado" : "aluno cadastrado", "success");
    } catch {
      showAlert("erro ao salvar", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(aluno);
      setMostrarConfirmacao(false);
      onClose();
    } catch {
      showAlert("erro ao excluir aluno", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
        <SlideIn from="bottom">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl md:text-2xl font-[1000] text-gray-900 uppercase italic tracking-tighter">
                {isEdit ? "editar" : "novo"} <span className="text-blue-600">aluno_</span>
              </h2>
              <div className="flex items-center gap-4">
                {isEdit && (
                  <button onClick={() => setMostrarConfirmacao(true)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                    <FaTrashAlt size={16} />
                  </button>
                )}
                <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] md:max-h-full pr-1">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaUser size={10} /> nome completo
                </label>
                <input
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="ex: joão silva"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaWhatsapp size={10} /> whatsapp
                </label>
                <div className="flex items-stretch gap-2">
                  <div className="w-[110px] flex">
                    <SelectPersonalizado 
                      options={opcoesDDI}
                      value={formData.ddi}
                      onChange={(val) => setFormData({...formData, ddi: val})}
                    />
                  </div>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: aplicarMascaraWhatsapp(e.target.value)})}
                    placeholder="(00) 00000-0000"
                    className="flex-1 bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    <FaBirthdayCake size={10} /> nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center block">sexo</label>
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl border-2 border-transparent">
                    {['M', 'F', 'N/A'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, sexo: s})}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${
                          formData.sexo === s 
                            ? 'bg-white shadow-sm text-blue-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaBullseye size={10} /> objetivo principal
                </label>
                <input
                  value={formData.objetivo}
                  onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                  placeholder="ex: hipertrofia, emagrecimento..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all"
                />
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">status atual</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {id: 'A', label: 'ativo', color: 'peer-checked:bg-green-500 bg-green-50 text-green-600'},
                      {id: 'S', label: 'suspenso', color: 'peer-checked:bg-yellow-500 bg-yellow-50 text-yellow-600'},
                      {id: 'C', label: 'cancelado', color: 'peer-checked:bg-red-500 bg-red-50 text-red-600'},
                    ].map((st) => (
                      <label key={st.id} className="cursor-pointer">
                        <input type="radio" name="status" value={st.id} checked={formData.status === st.id} onChange={(e) => setFormData({...formData, status: e.target.value})} className="hidden peer" />
                        <div className={`text-[9px] font-[1000] uppercase py-3.5 rounded-xl text-center transition-all peer-checked:text-white ${st.color}`}>
                          {st.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10">
              <button 
                disabled={!formData.nome.trim() || loading}
                onClick={handleSave} 
                className={`w-full py-5 rounded-2xl text-[11px] font-[1000] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${(!formData.nome.trim() || loading) ? "bg-gray-100 text-gray-300" : "bg-black text-white hover:bg-blue-600 shadow-xl"}`}
              >
                {loading ? <span className="animate-pulse">processando...</span> : <><FaCheck size={12} /> {isEdit ? "atualizar" : "salvar"} aluno</>}
              </button>
            </div>
          </div>
        </SlideIn>
      </div>

      {mostrarConfirmacao && (
        <ModalConfirmacao 
          isOpen={mostrarConfirmacao} 
          onConfirm={handleDelete} 
          isCritical={true} 
          title="Excluir Aluno" 
          message={
            <>
              tem certeza que deseja excluir <span className="text-white font-black underline">{formData.nome}</span>?
              <br /><br />
              <span className="text-red-400 font-bold">atenção:</span> todos os projetos e treinos deste aluno também serão <span className="uppercase underline">apagados permanentemente</span>.
            </>
          } 
          onClose={() => setMostrarConfirmacao(false)} 
        />
      )}
    </>
  );
}