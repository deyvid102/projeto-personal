import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StatusDot from "../components/StatusDot";
import { 
  FaUsers, 
  FaClipboardCheck, 
  FaUserTimes, 
  FaUserClock, 
  FaArrowRight,
  FaDumbbell
} from "react-icons/fa";

export default function Dashboard() {
  const { personalId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, ativos: 0, suspensos: 0, cancelados: 0, recentes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!personalId) return;

      try {
        const response = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
        const data = await response.json();
        
        const listaAlunos = Array.isArray(data) ? data : [];

        const ativos = listaAlunos.filter(a => a.status === 'A').length;
        const suspensos = listaAlunos.filter(a => a.status === 'S').length;
        const cancelados = listaAlunos.filter(a => a.status === 'C').length;
        
        const recentes = [...listaAlunos].reverse().slice(0, 5);

        setStats({ total: listaAlunos.length, ativos, suspensos, cancelados, recentes });
      } catch (error) {
        console.error("erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [personalId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-full mb-4"></div>
          <div className="h-2 w-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 md:px-8 pt-16 md:pt-24">
      
      {/* Header - Mais compacto no mobile */}
      <div className="mb-8 md:mb-10 text-left">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
          Visão Geral
        </h1>
        <p className="text-gray-400 text-[8px] md:text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
          Monitoramento de performance da consultoria
        </p>
      </div>

      {/* Grid de Métricas - Grid 2x2 no mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard 
          title="Alunos" 
          value={stats.total} 
          icon={<FaUsers />} 
          color="blue"
          onClick={() => navigate(`/${personalId}/alunos`)} 
        />
        <StatCard 
          title="Ativos" 
          value={stats.ativos} 
          icon={<FaClipboardCheck />} 
          color="green"
          onClick={() => navigate(`/${personalId}/alunos?status=A`)} 
        />
        <StatCard 
          title="Suspensos" 
          value={stats.suspensos} 
          icon={<FaUserClock />} 
          color="orange"
          onClick={() => navigate(`/${personalId}/alunos?status=S`)} 
        />
        <StatCard 
          title="Cancelados" 
          value={stats.cancelados} 
          icon={<FaUserTimes />} 
          color="red"
          onClick={() => navigate(`/${personalId}/alunos?status=C`)} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Recentes */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Últimas Matrículas
            </h2>
            <button 
              onClick={() => navigate(`/${personalId}/alunos`)}
              className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-widest"
            >
              Ver todos
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
            {stats.recentes.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {stats.recentes.map((aluno) => (
                  <div 
                    key={aluno._id}
                    onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
                    className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-black uppercase">
                        {aluno.nome?.charAt(0)}
                      </div>
                      
                      <div>
                        <h3 className="text-[10px] md:text-[11px] font-black text-gray-900 leading-tight uppercase tracking-tight">
                          {aluno.nome}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusDot status={aluno.status} />
                          <span className="text-[9px] font-medium text-gray-400 uppercase">
                            {aluno.objetivo || "Geral"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-300 group-hover:text-blue-600 transition-all">
                      <FaArrowRight size={8} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-300">
                <FaUsers size={20} className="mb-2 opacity-20" />
                <p className="text-[9px] font-bold uppercase tracking-widest">Nenhum aluno</p>
              </div>
            )}
          </div>
        </div>

        {/* Card Exercícios - Adaptado para não ficar gigante no mobile */}
        <div className="lg:col-span-1">
          <div className="mb-4 px-2">
            <h2 className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Gestão
            </h2>
          </div>

          <div className="bg-gray-900 rounded-[2rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-white transform rotate-12 group-hover:rotate-6 transition-transform duration-700">
              <FaDumbbell size={140} className="md:size-[180px]" />
            </div>
            
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 border border-white/10">
                <FaDumbbell size={18} className="text-blue-400" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
                Banco de <br />
                <span className="text-blue-500">
                  Exercícios_
                </span>
              </h3>
              
              <p className="text-gray-400 text-[10px] md:text-xs font-medium leading-relaxed mt-3 max-w-[180px] md:max-w-none">
                Gerencie sua biblioteca de movimentos e instruções.
              </p>
            </div>

            <button 
              onClick={() => navigate(`/${personalId}/exercicios`)}
              className="relative z-10 mt-6 md:mt-8 w-full bg-white text-gray-900 py-3.5 md:py-4 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95"
            >
              Acessar Biblioteca
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, onClick }) {
  const styles = {
    blue:   "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green:  "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    red:    "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white"
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 active:scale-95 cursor-pointer group flex flex-col justify-between h-28 md:h-40"
    >
      <div className="flex justify-between items-start">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-2xl flex items-center justify-center transition-colors duration-300 ${styles[color]}`}>
          <div className="text-xs md:text-sm">{icon}</div>
        </div>
        <FaArrowRight className="opacity-0 -translate-x-2 md:group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-300 text-[10px]" />
      </div>

      <div>
        <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}