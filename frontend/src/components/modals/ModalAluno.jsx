import { useState, useEffect } from "react";
import SlideIn from "../SlideIn";
import SelectPersonalizado from "../SelectPersonalizado"; 
import { FaTrash, FaWhatsapp } from "react-icons/fa";

// lista de DDIs simplificada: Sigla + Código
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
  const isEdit = Boolean(aluno?._id);

  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    objetivo: "",
    sexo: "N/A",
    status: "A",
    ddi: "+55",
    whatsapp: ""
  });

  const [objetivoCustom, setObjetivoCustom] = useState("");

  const opcoesObjetivo = [
    { value: "hipertrofia", label: "hipertrofia" },
    { value: "definicao", label: "definição" },
    { value: "emagrecimento", label: "emagrecimento" },
    { value: "outro", label: "outro personalizado" },
  ];

  const aplicarMascaraWhatsapp = (valor) => {
    if (!valor) return "";
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    return valor.substring(0, 15);
  };

  useEffect(() => {
    if (isEdit && aluno) {
      setFormData({
        nome: aluno.nome || "",
        idade: aluno.idade || "",
        objetivo: ["hipertrofia", "definicao", "emagrecimento"].includes(aluno.objetivo)
          ? aluno.objetivo
          : aluno.objetivo ? "outro" : "",
        sexo: aluno.sexo || "N/A",
        status: aluno.status || "A",
        ddi: aluno.ddi || "+55",
        whatsapp: aplicarMascaraWhatsapp(aluno.whatsapp) || ""
      });

      if (aluno.objetivo && !["hipertrofia", "definicao", "emagrecimento"].includes(aluno.objetivo)) {
        setObjetivoCustom(aluno.objetivo);
      }
    }
  }, [isEdit, aluno]);

  const handleSave = async () => {
    if (!formData.nome.trim()) return;

    const objetivoFinal = formData.objetivo === "outro" ? objetivoCustom.trim() : formData.objetivo;

    const payload = { 
      ...formData, 
      sexo: formData.sexo === "N/A" ? "" : formData.sexo,
      whatsapp: formData.whatsapp.replace(/\D/g, ""),
      objetivo: objetivoFinal, 
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
    }
  };

  const isNomeVazio = !formData.nome.trim();

  const getSexoColor = (sexo) => {
    if (formData.sexo !== sexo) return "text-gray-400";
    switch (sexo) {
      case 'M': return "text-blue-600";
      case 'F': return "text-pink-500";
      case 'N/A': return "text-gray-600";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <SlideIn from="bottom">
        <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md p-5 md:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
              {isEdit ? "editar" : "novo"} <span className="text-blue-600">aluno</span>
            </h2>
            {isEdit && (
              <button onClick={() => onDelete(aluno)} className="p-2.5 text-red-300 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-colors">
                <FaTrash size={16} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* nome */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">nome completo</label>
              <input
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="nome do aluno*"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat placeholder:font-light focus:ring-2 focus:ring-blue-600/20 outline-none"
              />
            </div>

            {/* whatsapp com ddi curto e fonte extra fina */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">whatsapp</label>
              <div className="flex gap-2">
                <div className="w-[85px] font-montserrat text-[11px] font-light text-gray-400">
                  <SelectPersonalizado 
                    options={opcoesDDI}
                    value={formData.ddi}
                    onChange={(val) => setFormData({...formData, ddi: val})}
                    placeholder="país"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: aplicarMascaraWhatsapp(e.target.value)})}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat placeholder:font-light focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                  <FaWhatsapp className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 opacity-40" size={14} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">idade</label>
                <input
                  min="1"
                  type="number"
                  value={formData.idade}
                  onChange={(e) => setFormData({...formData, idade: e.target.value})}
                  placeholder="ex: 25"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat placeholder:font-light focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">sexo</label>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  {['M', 'F', 'N/A'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, sexo: s})}
                      className={`flex-1 py-2.5 rounded-lg text-[10px] font-medium font-montserrat transition-all ${
                        formData.sexo === s 
                          ? `bg-white shadow-sm ${getSexoColor(s)}` 
                          : 'text-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1 font-montserrat text-[11px] font-light text-gray-400">
               <SelectPersonalizado 
                label="objetivo principal"
                options={opcoesObjetivo}
                value={formData.objetivo}
                onChange={(val) => setFormData({...formData, objetivo: val})}
                placeholder="selecione um objetivo"
              />
            </div>

            {formData.objetivo === "outro" && (
              <input
                placeholder="digite o objetivo personalizado..."
                value={objetivoCustom}
                onChange={(e) => setObjetivoCustom(e.target.value)}
                className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-xs font-light font-montserrat text-blue-600 outline-none animate-in fade-in slide-in-from-top-2"
              />
            )}

            {isEdit && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">status do aluno</label>
                <div className="grid grid-cols-3 gap-2 font-montserrat">
                  {[
                    {id: 'A', label: 'ativo', color: 'peer-checked:bg-green-500 peer-checked:text-white text-green-600 bg-green-50'},
                    {id: 'S', label: 'suspenso', color: 'peer-checked:bg-yellow-500 peer-checked:text-white text-yellow-600 bg-yellow-50'},
                    {id: 'C', label: 'cancelado', color: 'peer-checked:bg-red-500 peer-checked:text-white text-red-600 bg-red-50'},
                  ].map((st) => (
                    <label key={st.id} className="cursor-pointer">
                      <input type="radio" name="status" value={st.id} checked={formData.status === st.id} onChange={(e) => setFormData({...formData, status: e.target.value})} className="hidden peer" />
                      <div className={`text-[9px] font-medium uppercase py-3 rounded-xl text-center transition-all border border-transparent ${st.color}`}>
                        {st.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-2 mt-8">
            <button onClick={onClose} className="flex-1 order-2 md:order-1 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl">
              voltar
            </button>
            
            <button 
              disabled={isNomeVazio}
              onClick={handleSave} 
              className={`flex-[2] order-1 md:order-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${isNomeVazio 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                  : "bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-95 hover:bg-blue-700"
                }`}
            >
              {isEdit ? "salvar" : "cadastrar"}
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}