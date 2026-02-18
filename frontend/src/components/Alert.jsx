import { useEffect, useState } from "react";
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaBolt 
} from "react-icons/fa";

export default function Alert({ message, type = "success" }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (message) {
      setMounted(true);
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!mounted) return null;

  const config = {
    success: {
      bg: "bg-black/90 border-emerald-500/50 text-white",
      icon: <FaCheckCircle className="text-emerald-400" />,
      bar: "bg-emerald-500",
      label: "sucesso"
    },
    error: {
      bg: "bg-black/90 border-red-500/50 text-white",
      icon: <FaExclamationCircle className="text-red-400" />,
      bar: "bg-red-500",
      label: "erro"
    },
    warning: {
      bg: "bg-black/90 border-amber-500/50 text-white",
      icon: <FaExclamationTriangle className="text-amber-400" />,
      bar: "bg-amber-500",
      label: "atenção"
    },
    info: {
      bg: "bg-black/90 border-blue-500/50 text-white",
      icon: <FaInfoCircle className="text-blue-400" />,
      bar: "bg-blue-500",
      label: "info"
    },
  };

  const current = config[type] || config.success;

  return (
    <div
      className={`fixed top-6 right-6 z-[10000] flex items-center gap-5 px-6 py-5 rounded-2xl border-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl min-w-[340px] max-w-[420px]
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${current.bg}`}
      style={{
        transform: visible ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.95)",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Ícone com brilho */}
      <div className="relative shrink-0">
        <div className={`absolute inset-0 blur-lg opacity-40 ${current.bar}`}></div>
        <div className="relative text-2xl">
          {current.icon}
        </div>
      </div>

      {/* Conteúdo Tipográfico */}
      <div className="flex flex-col flex-1 gap-0.5">
        <div className="flex items-center gap-2">
           <span className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-60`}>
            {current.label}_
           </span>
        </div>
        <p className="text-[11px] font-[1000] leading-none uppercase italic tracking-tight">
          {message}
        </p>
      </div>

      {/* Detalhe Estético de "Carga" lateral */}
      <div className="shrink-0 opacity-20">
        <FaBolt size={12} />
      </div>

      {/* Barra de Progresso High-Tech */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/5 overflow-hidden rounded-b-2xl">
        <div 
          className={`h-full transition-all duration-[2500ms] ease-linear ${current.bar} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
          style={{ width: visible ? "0%" : "100%" }}
        />
      </div>
    </div>
  );
}