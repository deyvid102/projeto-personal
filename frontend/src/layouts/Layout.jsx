import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop */}
      <div className="hidden md:flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden pb-16">
        <main className="p-4">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
