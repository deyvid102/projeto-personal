export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Alunos</p>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Treinos ativos</p>
          <p className="text-2xl font-bold">8</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Avaliações</p>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Novos alunos</p>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>
    </div>
  );
}


// export default function App() {
//   const students = [
//     { name: "João Silva", goal: "Hipertrofia", status: "ativo" },
//     { name: "Maria Souza", goal: "Emagrecimento", status: "atrasado" },
//     { name: "Pedro Oliveira", goal: "Definição", status: "ativo" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* Header */}
//       <header className="w-full flex justify-between items-center py-4 px-6 border-b bg-white">
//         <h1 className="text-xl font-semibold">AthletIQ - Painel do Personal</h1>

//         <div className="flex items-center gap-3">
//           <button className="px-4 py-2 rounded-lg border hover:bg-gray-100">
//             Sair
//           </button>
//         </div>
//       </header>

//       {/* Conteúdo */}
//       <main className="p-6 max-w-5xl mx-auto">

//         {/* Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <div className="p-5 border rounded-xl shadow-sm bg-white">
//             <p className="text-gray-600 text-sm">Alunos ativos</p>
//             <h2 className="text-2xl font-bold mt-2">12</h2>
//           </div>

//           <div className="p-5 border rounded-xl shadow-sm bg-white">
//             <p className="text-gray-600 text-sm">Treinos cadastrados</p>
//             <h2 className="text-2xl font-bold mt-2">34</h2>
//           </div>

//           <div className="p-5 border rounded-xl shadow-sm bg-white">
//             <p className="text-gray-600 text-sm">Avaliações marcadas</p>
//             <h2 className="text-2xl font-bold mt-2">5</h2>
//           </div>
//         </div>

//         {/* Lista de alunos */}
//         <h2 className="text-xl font-semibold mb-3">Meus alunos</h2>

//         <div className="flex flex-col gap-3">
//           {students.map((s, i) => (
//             <div
//               key={i}
//               className="p-4 border rounded-xl flex justify-between items-center bg-white shadow-sm"
//             >
//               <div>
//                 <h3 className="font-semibold">{s.name}</h3>
//                 <p className="text-sm text-gray-600">{s.goal}</p>

//                 <span
//                   className={`text-xs px-2 py-1 rounded-lg mt-1 inline-block ${
//                     s.status === "ativo"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {s.status}
//                 </span>
//               </div>

//               <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
//                 Ver treino
//               </button>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
