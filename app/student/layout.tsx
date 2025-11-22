"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Search,
  Send,
  MessageSquare,
  User,
  Settings,
  UserCircle,
  LogOut
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  // Cargar usuario desde localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    else router.push("/login");
  }, [router]);

  if (!user) return <p className="p-10 text-gray-600">Cargando...</p>;

  const menu = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/student" },
    { label: "Explorar tareas", icon: <Search size={18} />, href: "/student/tasks" },
    { label: "Mis postulaciones", icon: <Send size={18} />, href: "/student/applications" },
    { label: "Mensajes", icon: <MessageSquare size={18} />, href: "/student/messages" },
    { label: "Mi perfil", icon: <User size={18} />, href: "/student/profile" },
    { label: "Configuración", icon: <Settings size={18} />, href: "/student/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">

        <div>
          {/* LOGO */}
          <h1 className="text-2xl font-bold text-indigo-600 mb-6">
            Cachueleando
          </h1>

          {/* USER INFO */}
          <div className="flex flex-col items-center mb-8">

            {/* Foto o ícono */}
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
            ) : (
              <UserCircle className="w-20 h-20 text-gray-400 mb-2" />
            )}

            {/* Nombre */}
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>

            {/* Universidad */}
            <p className="text-sm text-gray-500">
              {user.university || "—"}
            </p>
          </div>

          {/* MENÚ */}
          <nav className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-600 hover:text-red-500 mt-6"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
