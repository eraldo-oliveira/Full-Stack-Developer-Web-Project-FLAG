import { useLocation } from "wouter";

function Header() {
  const [, setLocation] = useLocation();

  return (
    <header>
      <nav aria-label="Menu principal" className="bg-sky-600 text-white shadow-md">
        <div className="container mx-auto flex flex-wrap sm:flex-nowrap p-6 justify-between items-center">
          {/* Logo como botão */}
          <div>
            <button
              aria-label="Voltar para página inicial"
              onClick={() => {
                window.dispatchEvent(new Event("clearFilters"));
                setLocation("/");
              }}
              className="cursor-pointer transition duration-300 flex items-center space-x-3"
            >
              <img
                src="/data/image/logo.png"
                alt="Receitinhas logo"
                className="h-10 sm:h-12 md:h-14 w-auto"
              />
              <h1 className="text-white text-lg sm:text-2xl md:text-3xl font-bold">
                Receitinhas
              </h1>
            </button>
          </div>

          {/* Botão de Login */}
          <div className="bg-gray-800 px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300">
            <button
              aria-label="Fazer login"
              onClick={() => setLocation("/login")}
              className="cursor-pointer text-white text-lg font-semibold hover:text-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              LOGIN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
