import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function SelectPersonalizado({ label, options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    // w-fit faz o componente ter apenas o tamanho do conteúdo
    <div className="relative space-y-1 w-fit min-w-[140px]" ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
          isOpen ? "ring-2 ring-blue-600/20 bg-white shadow-sm" : ""
        }`}
      >
        <span className={selectedOption ? "text-gray-900 uppercase" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown className={`text-gray-300 transition-transform ${isOpen ? "rotate-180" : ""}`} size={10} />
      </button>

      {isOpen && (
        <div className="absolute z-[70] mt-1 min-w-full w-max max-w-[250px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[11px] font-bold transition-colors border-b border-gray-50 last:border-none flex items-center justify-between gap-4 ${
                  value === option.value ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="uppercase whitespace-nowrap">{option.label}</span>
                {value === option.value && <div className="w-1 h-1 rounded-full bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}