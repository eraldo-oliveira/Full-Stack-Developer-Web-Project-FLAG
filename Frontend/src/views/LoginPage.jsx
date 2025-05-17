import { useState } from "react";
import { useLocation } from "wouter"; // Importa o hook de navegação

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Adiciona estado para controle de carregamento
  const [, setLocation] = useLocation(); // Hook do wouter

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true); // Inicia carregamento ao submeter o formulário

    // Simula um processo de login (normalmente, você faria uma requisição para um backend)
    setTimeout(() => {
      if (username === "admin" && password === "batata123") {
        setError("");
        setLocation("/receitas"); // Redireciona para /receitas
      } else {
        setError("Nome de usuário ou senha incorretos");
      }
      setLoading(false); // Finaliza o carregamento
    }, 1000); // Simula um delay de 1 segundo
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
            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={loading} // Desabilita o botão durante o carregamento
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

