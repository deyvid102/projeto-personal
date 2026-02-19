import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch, FaBell, FaSignOutAlt,
  FaUserCog, FaDumbbell, FaUserGraduate
} from "react-icons/fa";
import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ onLogout }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [nomeExibicao, setNomeExibicao] = useState("carregando...");
  const [idPersonal, setIdPersonal] = useState(null);

  const menuRef = useRef(null);
  const buscaRef = useRef(null);

  const { dark, toggleTheme } = useTheme();

  // Função de busca SEGURA: Filtra por fk_personal
  const atualizarDadosBusca = async (personalId) => {
    if (!personalId) return;
    
    try {
      const [resAlunos, resExercicios] = await Promise.all([
        fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`),
        fetch(`http://localhost:3000/exercicios`)
      ]);
      
      const dataAlunos = await resAlunos.json();
      const dataExercicios = await resExercicios.json();
      
      setAlunos(Array.isArray(dataAlunos) ? dataAlunos : []);
      setExercicios(Array.isArray(dataExercicios) ? dataExercicios : []);
    } catch (err) {
      console.error("erro ao atualizar dados de busca:", err);
    }
  };

  useEffect(() => {
    const idLogado = localStorage.getItem("userId");
    if (idLogado) {
      setIdPersonal(idLogado);
      
      fetch(`http://localhost:3000/personais/${idLogado}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.nome) {
            const partes = data.nome.trim().split(/\s+/);
            setNomeExibicao(partes.length > 1 ? `${partes[0]} ${partes[1]}` : partes[0]);
          }
        })
        .catch(() => setNomeExibicao("personal trainer"));

      atualizarDadosBusca(idLogado);
    }
  }, []);

  useEffect(() => {
    if (busca.trim() === "") {
      setResultados([]);
      return;
    }
    const termo = busca.toLowerCase();
    const alunosFiltrados = alunos
      .filter((aluno) => aluno.nome?.toLowerCase().includes(termo))
      .map((aluno) => ({ ...aluno, tipo: "aluno" }));
    
    const exerciciosFiltrados = exercicios
      .filter((ex) => ex.nome?.toLowerCase().includes(termo))
      .map((ex) => ({ ...ex, tipo: "exercicio" }));

    setResultados([...alunosFiltrados, ...exerciciosFiltrados]);
  }, [busca, alunos, exercicios]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuAberto(false);
      if (buscaRef.current && !buscaRef.current.contains(event.target)) setMostrarResultados(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 md:left-20 left-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 z-40 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">

      {/* Barra de Pesquisa Ampliada */}
      <div className="flex-1 max-w-[200px] xs:max-w-md lg:max-w-xl relative mx-2 md:mx-0" ref={buscaRef}>
        <div className="relative group">
          <FaSearch size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            value={busca}
            onFocus={() => {
              setMostrarResultados(true);
              atualizarDadosBusca(idPersonal);
            }}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-gray-100/60 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 border-none py-2.5 md:py-3 pl-11 pr-4 rounded-xl text-[11px] md:text-xs font-light focus:bg-white dark:focus:bg-slate-750 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all duration-300 shadow-sm"
          />
        </div>

        {mostrarResultados && busca.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
            <div className="max-h-[350px] overflow-y-auto p-2">
              {resultados.length > 0 ? (
                resultados.map((item) => (
                  <Link
                    key={`${item.tipo}-${item._id}`}
                    to={item.tipo === "aluno" ? `/${idPersonal}/alunos/${item._id}` : `/${idPersonal}/exercicios/${item._id}`}
                    onClick={() => { setBusca(""); setMostrarResultados(false); }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors group"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      item.tipo === "aluno" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "bg-orange-50 text-orange-600 dark:bg-orange-900/20"
                    }`}>
                      {item.tipo === "aluno" ? <FaUserGraduate size={14}/> : <FaDumbbell size={14}/>}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-gray-900 dark:text-slate-100 uppercase truncate tracking-tighter">{item.nome}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.15em]">
                        {item.tipo === "aluno" ? "seu aluno" : "exercício"}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">nada encontrado</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-2">
        <button className="relative text-gray-400 hover:text-blue-600 transition-colors hidden xs:block">
          <FaBell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
        </button>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuAberto(!menuAberto)} className="flex items-center gap-2 md:gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black text-gray-900 dark:text-slate-100 uppercase leading-none mb-1">{nomeExibicao}</p>
              <p className="text-[8px] text-blue-600 font-black uppercase tracking-widest leading-none">pro member</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-900 dark:bg-blue-700 flex items-center justify-center text-white text-[10px] font-black shadow-lg transition-colors group-hover:bg-blue-600">
              {nomeExibicao.charAt(0).toUpperCase()}
            </div>
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95">
              <Link to="/profile" onClick={() => setMenuAberto(false)} className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-black text-gray-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all uppercase tracking-tighter">
                <FaUserCog size={14} /> configurações
              </Link>
              <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black text-gray-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all uppercase tracking-tighter">
                {dark ? <HiSun size={15} /> : <HiMoon size={15} />} {dark ? "modo claro" : "modo escuro"}
              </button>
              <div className="h-px bg-gray-50 dark:bg-slate-700 my-1 mx-2"></div>
              <button onClick={() => { onLogout(); setMenuAberto(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black text-red-400 hover:bg-red-50 transition-all uppercase tracking-tighter">
                <FaSignOutAlt size={14} /> encerrar sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}