"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  User,
  Settings,
  UserCircle,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  // 1. Obtener usuario desde localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    else router.push("/login"); // si no hay login → redirigir
  }, [router]);

  // 2. Bloqueo mientras carga
  if (!user) return <p className="p-10 text-gray-600">Cargando...</p>;

  const menu = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
    { label: "Mis tareas", icon: <ClipboardList size={18} />, href: "/dashboard/tasks" },
    { label: "Mensajes", icon: <MessageSquare size={18} />, href: "/dashboard/messages" },
    { label: "Perfil", icon: <User size={18} />, href: "/dashboard/profile" },
    { label: "Configuración", icon: <Settings size={18} />, href: "/dashboard/settings" },
  ];

  // 3. Cerrar sesión
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
          <h1 className="text-2xl font-bold text-indigo-600 mb-6">Cachueleando</h1>

          {/* USER INFO */}
          <div className="flex flex-col items-center mb-8">

            {/* Foto o icono */}
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
            ) : (
              <UserCircle className="w-20 h-20 text-gray-400 mb-2" />
            )}

            {/* Nombre del usuario */}
            <h2 className="text-lg font-semibold">{user.name}</h2>

            {/* Universidad o NONE */}
            <p className="text-sm text-gray-500">
              {user.university === "NONE" ? "—" : user.university}
            </p>
          </div>

          {/* MENU */}
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
