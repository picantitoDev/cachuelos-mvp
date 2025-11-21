import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-gray-50 border-t py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* LOGO + DESCRIPTION */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600">Cachueleando</h2>
          <p className="text-sm text-gray-600 mt-3">
            Conectando talento universitario con tus necesidades.
          </p>

          {/* Social icons */}
          <div className="flex gap-4 mt-5 text-indigo-600">
            <a href="#">
              <Instagram className="w-5 h-5 hover:text-indigo-800 transition" />
            </a>
            <a href="#">
              <Facebook className="w-5 h-5 hover:text-indigo-800 transition" />
            </a>
            <a href="#">
              <Twitter className="w-5 h-5 hover:text-indigo-800 transition" />
            </a>
          </div>
        </div>

        {/* Column 1 */}
        <div>
          <p className="font-semibold text-gray-800 mb-3">Cachueleando</p>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li><a href="#">Sobre Nosotros</a></li>
            <li><a href="#">Trabaja con Nosotros</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <p className="font-semibold text-gray-800 mb-3">Soporte</p>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Política de Privacidad</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <p className="font-semibold text-gray-800 mb-3">Universidades Aliadas</p>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li>UPAO</li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="border-t mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Cachueleando. Todos los derechos reservados.
      </div>
    </footer>
  );
}
