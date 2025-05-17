import { useState } from "react";
import { useLocation } from "wouter";

const USERNAME = import.meta.env.VITE_TEST_USERNAME;
const PASSWORD = import.meta.env.VITE_TEST_PASSWORD;

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (username === USERNAME && password === PASSWORD) {
        setError("");
        setLocation("/receitas");
      } else {
        setError("Nome de usuário ou senha incorretos");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12 sm:px-8 md:px-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Nome de Usuário
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome de usuário"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {error && <div className="text-red-600 text-sm mt-2" aria-live="assertive">{error}</div>}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Registre-se
          </a>
        </span>
      </div>
    </main>
  );
}

export default LoginPage;
