import { useEffect, useState } from "react";

export default function Alert({ message, type = "success" }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (message) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else if (mounted) {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 500); // duração da animação

      return () => clearTimeout(timer);
    }
  }, [message, mounted]); // ✅ correção aqui

  if (!mounted) return null;

  const variants = {
    success: "bg-green-800 text-white",
    error: "bg-red-800 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-700 text-white",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg min-w-[260px]
        transition-all duration-500 ease-in-out
        ${variants[type] || variants.success}`}
      style={{
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
      }}
    >
      {message}
    </div>
  );
}
