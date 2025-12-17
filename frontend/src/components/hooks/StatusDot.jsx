export default function StatusDot({ status }) {
  const statusMap = {
    A: {
      label: "Ativo",
      color: "bg-green-500",
      text: "text-white",
    },
    S: {
      label: "Suspenso",
      color: "bg-yellow-400",
      text: "text-gray-900",
    },
    C: {
      label: "Cancelado",
      color: "bg-red-500",
      text: "text-white",
    },
  };

  const current = statusMap[status] || {
    label: "Indefinido",
    color: "bg-gray-400",
    text: "text-white",
  };

  return (
    <div className="relative group">
      <div
        className={`
          flex items-center justify-center
          overflow-hidden
          rounded-full
          ${current.color}
          transition-all duration-300 ease-out

          w-3 h-3
          group-hover:w-auto
          group-hover:px-3
          group-hover:h-6
        `}
      >
        <span
          className={`
            text-xs font-semibold
            whitespace-nowrap
            opacity-0
            scale-90
            transition-all duration-200 delay-100
            ${current.text}

            group-hover:opacity-100
            group-hover:scale-100
          `}
        >
          {current.label}
        </span>
      </div>
    </div>
  );
}