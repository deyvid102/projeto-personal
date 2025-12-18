import { useEffect, useState } from "react";
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaTimes 
} from "react-icons/fa";

export default function Alert({ message, type = "success" }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (message) {
      setMounted(true);
      // Pequeno delay para garantir que a animação de entrada ocorra
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
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <FaCheckCircle className="text-emerald-500" />,
      bar: "bg-emerald-500"
    },
    error: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: <FaExclamationCircle className="text-red-500" />,
      bar: "bg-red-500"
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <FaExclamationTriangle className="text-amber-500" />,
      bar: "bg-amber-500"
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <FaInfoCircle className="text-blue-500" />,
      bar: "bg-blue-500"
    },
  };

  const current = config[type] || config.success;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 px-4 py-4 rounded-2xl border shadow-xl backdrop-blur-md min-w-[320px] max-w-[400px]
        transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
        ${current.bg}`}
      style={{
        transform: visible ? "translateX(0)" : "translateX(calc(100% + 24px))",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Ícone Indicador */}
      <div className="text-xl shrink-0">
        {current.icon}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 pr-4">
        <p className="text-sm font-semibold leading-tight">
          {message}
        </p>
      </div>

      {/* Barra de Progresso (Visual para o usuário saber que vai sumir) */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5 overflow-hidden rounded-b-2xl">
        <div 
          className={`h-full transition-all duration-[2000ms] linear ${current.bar}`}
          style={{ width: visible ? "0%" : "100%" }}
        />
      </div>
    </div>
  );
}