import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaSearch, FaBell, FaSignOutAlt, 
  FaUserCog, FaDumbbell, FaUserGraduate 
} from "react-icons/fa";

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

  // 1. busca dados do personal e define o ID
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
    }
  }, []);

  // 2. busca alunos e exercicios (filtrados pelo personal logado)
  useEffect(() => {
    if (!idPersonal) return; // Só busca se tiver o ID

    // CORREÇÃO: busca alunos filtrando pelo idPersonal
    fetch(`http://localhost:3000/alunos?fk_personal=${idPersonal}`)
      .then((res) => res.json())
      .then((data) => {
        // Tratamento robusto: verifica se é array direto ou objeto { alunos: [...] }
        if (Array.isArray(data)) {
          setAlunos(data);
        } else if (data && data.alunos && Array.isArray(data.alunos)) {
          setAlunos(data.alunos);
        } else {
          setAlunos([]);
        }
      })
      .catch((err) => console.error("erro ao buscar alunos:", err));

    // busca exercicios passando o idPersonal como query param
    fetch(`http://localhost:3000/exercicios?fk_personal=${idPersonal}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.treinos && Array.isArray(data.treinos)) {
          setExercicios(data.treinos);
        } else if (Array.isArray(data)) {
          setExercicios(data);
        } else {
          setExercicios([]);
        }
      })
      .catch((err) => console.error("erro ao buscar exercicios:", err));

  }, [idPersonal]); 

  // 3. lógica de filtragem da busca
  useEffect(() => {
    if (busca.trim() === "") {
      setResultados([]);
      return;
    }

    const termo = busca.toLowerCase();

    const alunosFiltrados = alunos
      .filter((aluno) => aluno.nome && aluno.nome.toLowerCase().includes(termo))
      .map((aluno) => ({ ...aluno, tipo: "aluno" }));

    const exerciciosFiltrados = exercicios
      .filter((ex) => {
        const nomeAlvo = (ex.nome || ex.titulo || "").toLowerCase();
        return nomeAlvo.includes(termo);
      })
      .map((ex) => ({ ...ex, tipo: "exercicio" }));

    setResultados([...alunosFiltrados, ...exerciciosFiltrados]);
  }, [busca, alunos, exercicios]);

  // 4. fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuAberto(false);
      if (buscaRef.current && !buscaRef.current.contains(event.target)) setMostrarResultados(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 md:left-20 left-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-40 flex items-center justify-between px-8 transition-all duration-300">
      
      <div className="flex-1 max-w-sm relative" ref={buscaRef}>
        <div className="relative group">
          <FaSearch size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setMostrarResultados(true);
            }}
            placeholder="procurar atleta ou exercício..."
            className="w-full bg-gray-100/50 border-none py-2 pl-10 pr-4 rounded-xl text-[11px] font-bold uppercase tracking-tight focus:bg-white focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300"
          />
        </div>

        {mostrarResultados && busca.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-blue-900/10 overflow-hidden z-50">
            <div className="max-h-64 overflow-y-auto p-2">
              {resultados.length > 0 ? (
                resultados.map((item) => {
                  const idItem = item._id || item.id;
                  const rotaDestino = item.tipo === "aluno" 
                    ? `/${idPersonal}/alunos/${idItem}` 
                    : `/${idPersonal}/exercicios/${idItem}`;

                  return (
                    <Link
                      key={`${item.tipo}-${idItem}`}
                      to={rotaDestino}
                      onClick={() => { 
                        setBusca(""); 
                        setMostrarResultados(false); 
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${
                        item.tipo === "aluno" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                      }`}>
                        {item.tipo === "aluno" ? <FaUserGraduate size={12}/> : <FaDumbbell size={12}/>}
                      </div>

                      <div>
                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">
                          {item.nome || item.titulo}
                        </p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                          {item.tipo === "aluno" ? "acessar perfil" : "ver exercício"}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  nada encontrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-blue-600 transition-colors">
          <FaBell size={16} />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
        </button>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">{nomeExibicao}</p>
              <p className="text-[8px] text-blue-600 font-black uppercase tracking-[0.2em] leading-none">pro member</p>
            </div>
            
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-gray-200 group-hover:bg-blue-600 transition-colors">
              {nomeExibicao.charAt(0).toUpperCase()}
            </div>
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2">
              <Link 
                to="/profile" 
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-2 text-[11px] font-black text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-tighter"
              >
                <FaUserCog size={12} />
                configurações
              </Link>
              <div className="h-px bg-gray-50 my-1 mx-2"></div>
              <button 
                onClick={() => { onLogout(); setMenuAberto(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-black text-red-400 hover:bg-red-50 transition-all uppercase tracking-tighter"
              >
                <FaSignOutAlt size={12} />
                encerrar sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}