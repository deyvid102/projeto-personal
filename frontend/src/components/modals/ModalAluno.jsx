import { useState, useEffect } from "react";
import SlideIn from "../SlideIn";
import SelectPersonalizado from "../SelectPersonalizado"; 
import { FaTrash } from "react-icons/fa";

export default function ModalAluno({ onClose, onSave, onDelete, aluno, showAlert }) {
  const isEdit = Boolean(aluno?._id);

  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    objetivo: "",
    sexo: "N/A",
    status: "A",
  });

  const [objetivoCustom, setObjetivoCustom] = useState("");

  const opcoesObjetivo = [
    { value: "hipertrofia", label: "hipertrofia" },
    { value: "definicao", label: "definição" },
    { value: "emagrecimento", label: "emagrecimento" },
    { value: "outro", label: "outro personalizado" },
  ];

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
      });

      if (aluno.objetivo && !["hipertrofia", "definicao", "emagrecimento"].includes(aluno.objetivo)) {
        setObjetivoCustom(aluno.objetivo);
      }
    }
  }, [isEdit, aluno]);

  const handleSave = async () => {
    const objetivoFinal = formData.objetivo === "outro" ? objetivoCustom.trim() : formData.objetivo;

    if (!formData.nome.trim()) {
      showAlert("o campo nome é obrigatório", "error");
      return;
    }

    const payload = { 
      ...formData, 
      sexo: formData.sexo === "N/A" ? "" : formData.sexo,
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

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <SlideIn from="bottom">
        {/* max-w-md (era max-w-lg) e paddings reduzidos de p-8 para p-6 */}
        <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md p-5 md:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
          
          {/* margem inferior reduzida de mb-8 para mb-6 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
              {isEdit ? "editar" : "novo"} <span className="text-blue-600">aluno</span>
            </h2>
            {isEdit && (
              <button onClick={() => onDelete(aluno)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
                <FaTrash size={16} />
              </button>
            )}
          </div>

          {/* space-y-6 reduzido para space-y-5 */}
          <div className="space-y-4">
            {/* Nome */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">nome completo</label>
              <input
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="nome do aluno"
                // py-4 reduzido para py-3.5
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-600/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Idade */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">idade</label>
                <input
                  type="number"
                  value={formData.idade}
                  onChange={(e) => setFormData({...formData, idade: e.target.value})}
                  placeholder="ex: 25"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
              </div>

              {/* Sexo */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">sexo</label>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  {['M', 'F', 'N/A'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, sexo: s})}
                      // py-3 reduzido para py-2.5
                      className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${formData.sexo === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Select Estilizado */}
            <div className="space-y-1">
               <SelectPersonalizado 
                label="objetivo principal"
                options={opcoesObjetivo}
                value={formData.objetivo}
                onChange={(val) => setFormData({...formData, objetivo: val})}
                placeholder="Selecione um objetivo"
              />
            </div>

            {formData.objetivo === "outro" && (
              <input
                placeholder="digite o objetivo personalizado..."
                value={objetivoCustom}
                onChange={(e) => setObjetivoCustom(e.target.value)}
                className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm font-bold text-blue-600 outline-none animate-in fade-in slide-in-from-top-2"
              />
            )}

            {/* Status */}
            {isEdit && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">status do aluno</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {id: 'A', label: 'ativo', color: 'peer-checked:bg-green-500 peer-checked:text-white text-green-600 bg-green-50'},
                    {id: 'S', label: 'suspenso', color: 'peer-checked:bg-yellow-500 peer-checked:text-white text-yellow-600 bg-yellow-50'},
                    {id: 'C', label: 'cancelado', color: 'peer-checked:bg-red-500 peer-checked:text-white text-red-600 bg-red-50'},
                  ].map((st) => (
                    <label key={st.id} className="cursor-pointer">
                      <input type="radio" name="status" value={st.id} checked={formData.status === st.id} onChange={(e) => setFormData({...formData, status: e.target.value})} className="hidden peer" />
                      {/* py-3.5 reduzido para py-3 */}
                      <div className={`text-[9px] font-black uppercase py-3 rounded-xl text-center transition-all border border-transparent ${st.color}`}>
                        {st.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botões: mt-10 reduzido para mt-8 e py-4 para py-3.5 */}
          <div className="flex flex-col md:flex-row gap-2 mt-8">
            <button onClick={onClose} className="flex-1 order-2 md:order-1 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl">
              voltar
            </button>
            <button onClick={handleSave} className="flex-[2] order-1 md:order-2 bg-blue-600 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all">
              {isEdit ? "salvar" : "cadastrar"}
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}