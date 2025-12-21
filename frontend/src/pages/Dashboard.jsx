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
  const { id: personalId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, ativos: 0, suspensos: 0, cancelados: 0, recentes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
        const data = await response.json();
        
        const ativos = data.filter(a => a.status === 'A').length;
        const suspensos = data.filter(a => a.status === 'S').length;
        const cancelados = data.filter(a => a.status === 'C').length;
        const recentes = [...data].reverse().slice(0, 5);

        setStats({ total: data.length, ativos, suspensos, cancelados, recentes });
      } catch (error) {
        console.error("erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [personalId]);

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 md:px-0">
      
      {/* header */}
      <div className="mt-6 md:mt-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
          Dashboard
        </h1>
        <p className="text-gray-400 text-[9px] md:text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
          visão geral da consultoria
        </p>
      </div>

      {/* grid de métricas com hover colorido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <StatCard 
          title="Total" 
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
          title="suspensos" 
          value={stats.suspensos} 
          icon={<FaUserClock />} 
          color="orange"
          onClick={() => navigate(`/${personalId}/alunos?status=S`)} 
        />
        <StatCard 
          title="cancelados" 
          value={stats.cancelados} 
          icon={<FaUserTimes />} 
          color="red"
          onClick={() => navigate(`/${personalId}/alunos?status=C`)} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* lista de recentes */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Recentes</h2>
            <button 
              onClick={() => navigate(`/${personalId}/alunos`)}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest cursor-pointer hover:underline"
            >
              ver tudo
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm">
            {stats.recentes.length > 0 ? (
              stats.recentes.map((aluno, index) => (
                <div 
                  key={aluno._id}
                  onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
                  className={`flex items-center justify-between p-4 active:bg-gray-50 transition-all cursor-pointer group ${
                    index !== stats.recentes.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-black text-gray-400 text-[10px]">
                      {aluno.nome.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xs uppercase tracking-tight truncate max-w-[150px]">
                        {aluno.nome}
                      </h3>
                      <div className="flex items-center gap-2">

                        <StatusDot status={aluno.status} />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                          {aluno.objetivo?.toLowerCase() === "definicao" 
                            ? "definição" 
                            : (aluno.objetivo || "geral")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <FaArrowRight size={10} className="text-gray-200 group-hover:text-blue-500 transition-colors" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-300 font-bold uppercase text-[9px]">
                vazio
              </div>
            )}
          </div>
        </div>

        {/* card exercícios */}
        <div className="order-1 lg:order-2">
          <div className="bg-black rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 text-blue-600">
              <FaDumbbell size={100} />
            </div>
            
            <div className="relative z-10">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FaDumbbell size={14} />
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic mb-2">
                Gerenciar <br /> <span className="text-blue-500">Exercícios</span>
              </h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tight mb-6">
                biblioteca de movimentos.
              </p>
              <button 
                onClick={() => navigate(`/${personalId}/exercicios`)}
                className="w-full bg-white text-black py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] active:scale-95 transition-all cursor-pointer hover:bg-gray-100"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, onClick }) {
  const colorMap = {
    blue: "hover:bg-blue-50/80 text-blue-600",
    green: "hover:bg-green-50/80 text-green-600",
    orange: "hover:bg-orange-50/80 text-orange-500",
    red: "hover:bg-red-50/80 text-red-500"
  };

  const iconBgMap = {
    blue: "bg-blue-50/50",
    green: "bg-green-50/50",
    orange: "bg-orange-50/50",
    red: "bg-red-50/50"
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-3.5 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] border border-gray-100 transition-all active:scale-95 cursor-pointer shadow-sm ${colorMap[color]}`}
    >
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center mb-3 ${iconBgMap[color]}`}>
        <div className="scale-90">{icon}</div>
      </div>
      <div>
        <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
        <p className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}