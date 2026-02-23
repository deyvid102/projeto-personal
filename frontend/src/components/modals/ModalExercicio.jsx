import { useState, useEffect } from "react";
import { FaTrashAlt, FaTimes, FaCheck, FaDumbbell, FaLayerGroup, FaTools, FaAlignLeft, FaCamera, FaImage, FaVideo, FaCloudUploadAlt } from "react-icons/fa";
import SlideIn from "../SlideIn";
import SelectPersonalizado from "../SelectPersonalizado";
import Alert from "../Alert"; 
import ModalConfirmacao from "./ModalConfirmacao";
import { useAlert } from "../hooks/useAlert"; 

export default function ModalExercicio({ 
  onClose, 
  onSave, 
  onDelete, 
  exercicioParaEditar, 
  nomeSugerido = "",
  bibliotecaExistente = [] 
}) {
  const storedUserId = localStorage.getItem("userId");
  const { alert, showAlert } = useAlert(2500);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isSalvando, setIsSalvando] = useState(false);
  const [equipamentoOutros, setEquipamentoOutros] = useState("");

  const opcoesGrupos = [
    { value: "peito", label: "peito" },
    { value: "costas", label: "costas" },
    { value: "pernas", label: "pernas" },
    { value: "ombros", label: "ombros" },
    { value: "braços", label: "braços" },
    { value: "abdômen", label: "abdômen" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const opcoesEquipamentos = [
    { value: "halteres", label: "halteres" },
    { value: "barra", label: "barra" },
    { value: "polia", label: "polia / cabo" },
    { value: "maquina", label: "máquina" },
    { value: "kettlebell", label: "kettlebell" },
    { value: "peso_corporal", label: "peso corporal" },
    { value: "elastico", label: "elástico" },
    { value: "outros", label: "outros (especificar)" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [form, setForm] = useState({
    nome: "",
    grupoMuscular: "",
    equipamento: "",
    descricao: "",
    fk_personal: storedUserId,
    publico: false,
    media: null,
  });

  useEffect(() => {
    if (exercicioParaEditar) {
      // Verifica se o equipamento atual está na lista padrão
      const ePadrao = opcoesEquipamentos.some(opt => opt.value === exercicioParaEditar.equipamento);
      
      setForm({
        nome: exercicioParaEditar.nome || "",
        grupoMuscular: exercicioParaEditar.grupoMuscular || "",
        equipamento: ePadrao ? (exercicioParaEditar.equipamento || "") : "outros",
        descricao: exercicioParaEditar.descricao || "",
        fk_personal: storedUserId,
        publico: false,
      });

      if (!ePadrao && exercicioParaEditar.equipamento) {
        setEquipamentoOutros(exercicioParaEditar.equipamento);
      }
    } else {
      setForm({
        nome: nomeSugerido || "",
        grupoMuscular: "",
        equipamento: "",
        descricao: "",
        fk_personal: storedUserId,
        publico: false,
      });
      setEquipamentoOutros("");
    }
  }, [exercicioParaEditar, storedUserId, nomeSugerido]);

const handleSave = async () => {
  const nomeNormalizado = String(form.nome || "").trim();
  if (!nomeNormalizado || !form.grupoMuscular) {
    showAlert("Preencha nome e grupo muscular", "warning");
    return;
  }

  const equipamentoFinal = form.equipamento === "outros" ? equipamentoOutros : form.equipamento;

  try {
    setIsSalvando(true);
    const formData = new FormData();

    formData.append("nome", nomeNormalizado);
    formData.append("grupoMuscular", form.grupoMuscular);
    formData.append("equipamento", equipamentoFinal || "");
    formData.append("descricao", form.descricao || "");
    
    // IMPORTANTE: Só envia o ID se ele realmente existir e for válido
    if (form.fk_personal && form.fk_personal !== "null") {
      formData.append("fk_personal", form.fk_personal);
    }
    
    formData.append("publico", "false"); 

    if (form.media) {
      formData.append("file", form.media); 
    }

    const isEdicao = !!exercicioParaEditar;
    const url = isEdicao 
      ? `http://localhost:3000/exercicios/${exercicioParaEditar._id || exercicioParaEditar.id}`
      : `http://localhost:3000/exercicios`;

    const res = await fetch(url, {
      method: isEdicao ? "PUT" : "POST",
      body: formData, // Sem Headers!
    });

    const data = await res.json();

    if (!res.ok) {
      // Agora o erro que o Mongoose der vai aparecer aqui
      throw new Error(data.error || "Erro ao salvar exercício");
    }

    await onSave(data);
  } catch (err) {
    console.error("Erro no post:", err);
    showAlert(err.message, "error");
  } finally {
    setIsSalvando(false);
  }
};

  // const handleSave = async () => {
  //   const nomeNormalizado = String(form.nome || "").trim();

  //   if (!nomeNormalizado) {
  //     showAlert("insira o nome do exercício", "warning");
  //     return;
  //   }

  //   const jaExiste = bibliotecaExistente.some(ex => 
  //     ex.nome.toLowerCase() === nomeNormalizado.toLowerCase() && 
  //     ex._id !== (exercicioParaEditar?._id || exercicioParaEditar?.id)
  //   );

  //   if (jaExiste) {
  //     showAlert("esse exercício já existe na sua biblioteca", "warning");
  //     return;
  //   }

  //   if (!form.grupoMuscular) {
  //     showAlert("selecione o grupo muscular", "warning");
  //     return;
  //   }

  //   // Define o valor final do equipamento (se for outros, usa o texto digitado)
  //   const equipamentoFinal = form.equipamento === "outros" ? equipamentoOutros : form.equipamento;
    
  //   try {
  //     setIsSalvando(true);
  //     const isEdicao = !!exercicioParaEditar;
  //     const url = isEdicao 
  //       ? `http://localhost:3000/exercicios/${exercicioParaEditar._id || exercicioParaEditar.id}`
  //       : `http://localhost:3000/exercicios`;

  //     const res = await fetch(url, {
  //       method: isEdicao ? "PUT" : "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ 
  //         ...form, 
  //         nome: nomeNormalizado,
  //         equipamento: equipamentoFinal 
  //       }),
  //     });

  //     if (!res.ok) throw new Error("erro ao comunicar com servidor");

  //     const exercicioSalvo = await res.json();
  //     await onSave(exercicioSalvo); 
  //   } catch (err) {
  //     showAlert("erro ao salvar exercício", "error");
  //   } finally {
  //     setIsSalvando(false);
  //   }
  // };

  const handleConfirmDelete = () => {
    const idParaDeletar = exercicioParaEditar?._id || exercicioParaEditar?.id;
    if (idParaDeletar && typeof onDelete === "function") {
      onDelete(idParaDeletar);
    }
    setShowConfirmDelete(false);
  };

  const isInvalido = !String(form.nome || "").trim() || !form.grupoMuscular || isSalvando;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[80] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
        <Alert message={alert.message} type={alert.type} />

        <SlideIn from="bottom">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-8 md:p-10 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-7 right-7 flex items-center gap-4">
              {exercicioParaEditar && (
                <button 
                  type="button" 
                  onClick={() => setShowConfirmDelete(true)} 
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <FaTrashAlt size={16} />
                </button>
              )}
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-black transition-colors p-1">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-8 pr-20">
              <h2 className="text-xl md:text-2xl font-[1000] text-gray-900 uppercase italic tracking-tighter leading-none">
                {exercicioParaEditar ? "editar" : "novo"} <span className="text-blue-600">exercício</span>
              </h2>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 ml-1">biblioteca privada</p>
            </div>

            <div className="space-y-5">
              {/* Nome */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaDumbbell size={10} /> nome do exercício
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="ex: supino reto"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all uppercase"
                />
              </div>

              {/* Grupo Muscular */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaLayerGroup size={10} /> grupo muscular
                </label>
                <SelectPersonalizado 
                  options={opcoesGrupos}
                  value={form.grupoMuscular}
                  onChange={(val) => setForm(prev => ({ ...prev, grupoMuscular: val }))}
                  placeholder="selecione o grupo..."
                />
              </div>

              {/* Equipamento */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaTools size={10} /> equipamento
                </label>
                <SelectPersonalizado 
                  options={opcoesEquipamentos}
                  value={form.equipamento}
                  onChange={(val) => setForm(prev => ({ ...prev, equipamento: val }))}
                  placeholder="selecione o equipamento..."
                />
                
                {form.equipamento === "outros" && (
                  <input
                    type="text"
                    value={equipamentoOutros}
                    onChange={(e) => setEquipamentoOutros(e.target.value)}
                    placeholder="digite o equipamento..."
                    className="w-full mt-2 bg-blue-50/50 border-2 border-blue-100 rounded-2xl px-5 py-3 text-xs font-bold outline-none transition-all uppercase"
                  />
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <FaAlignLeft size={10} /> descrição / notas
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="instruções técnicas ou observações..."
                  rows={3}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Mídia (Foto ou Vídeo) */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <FaCamera size={10} /> Mídia (Foto ou Vídeo)
              </label>
              
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  id="media-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setForm(prev => ({ ...prev, media: file }));
                    }
                  }}
                />
                <label 
                  htmlFor="media-upload"
                  className={`w-full border-2 border-dashed flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all ${
                    form.media 
                      ? "border-blue-600/30 bg-blue-50/30" 
                      : "border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200"
                  }`}
                >
                  {form.media ? (
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white p-2 rounded-lg">
                        {form.media.type.startsWith('video') ? <FaVideo size={14} /> : <FaImage size={14} />}
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-gray-900 truncate max-w-[200px]">
                          {form.media.name}
                        </p>
                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">
                          Arquivo selecionado
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setForm(prev => ({ ...prev, media: null }));
                        }}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="text-gray-300 mb-2" size={24} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Clique para enviar ou galeria
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="button"
                disabled={isInvalido}
                onClick={handleSave} 
                className={`w-full py-5 rounded-2xl text-[11px] font-[1000] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isInvalido ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-blue-600 shadow-xl"
                }`}
              >
                {isSalvando ? (
                  <span className="animate-pulse">processando...</span>
                ) : (
                  <><FaCheck size={12} /> {exercicioParaEditar ? "atualizar" : "salvar"} exercício</>
                )}
              </button>
            </div>
          </div>
        </SlideIn>
      </div>

      {showConfirmDelete && (
        <div className="relative z-[100]"> 
           <ModalConfirmacao 
            isOpen={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
            onConfirm={handleConfirmDelete}
            title="excluir exercício"
            message={<>tem certeza que deseja excluir <span className="text-white font-black underline">{form.nome}</span>?</>}
            isCritical={true}
          />
        </div>
      )}
    </>
  );
}