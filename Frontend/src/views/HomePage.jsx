import { useState, useEffect } from "react";
import Card from "../components/Card";
import { Search, ChevronDown, Filter } from "lucide-react";
import { useLocation } from "wouter";

function HomePage() {
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [chefSuggestion, setChefSuggestion] = useState(null);

  const [, setLocation] = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}recipes`)
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Erro ao buscar receitas:", err));
  }, [API_URL]);

  useEffect(() => {
    fetch(`${API_URL}recipes/chef-suggestion`)
      .then((res) => res.json())
      .then((data) => setChefSuggestion(data))
      .catch((err) => console.error("Erro ao buscar sugestão do chef:", err));
  }, [API_URL]);

  useEffect(() => {
    let filtered = [...recipes];

    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      filtered = filtered.filter((recipe) =>
        recipe.ingredients.some((ingrediente) =>
          ingrediente.toLowerCase().includes(termo)
        )
      );
    }

    if (difficultyFilter) {
      filtered = filtered.filter((recipe) => recipe.difficulty === difficultyFilter);
    }

    if (mealTypeFilter) {
      filtered = filtered.filter((recipe) => recipe.mealType === mealTypeFilter);
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, difficultyFilter, mealTypeFilter, recipes]);

  const toggleFiltro = () => {
    if (mostrarFiltro) {
      setDifficultyFilter("");
      setMealTypeFilter("");
    }
    setMostrarFiltro((prev) => !prev);
  };

  const limparFiltros = () => {
    setDifficultyFilter("");
    setMealTypeFilter("");
  };

  useEffect(() => {
    function handleClearFiltersEvent() {
      limparFiltros();
      setMostrarFiltro(false);
    }

    window.addEventListener("clearFilters", handleClearFiltersEvent);

    return () => {
      window.removeEventListener("clearFilters", handleClearFiltersEvent);
    };
  }, []);

  const handleChefSuggestionClick = () => {
    if (chefSuggestion?.slug) {
      setLocation(`/details/${chefSuggestion.slug}`);
    }
  };

  const chefImageUrl = chefSuggestion
    ? chefSuggestion.image
    : "";

  return (
    <main className="bg-gray-50 py-8">
      <section className="flex flex-col items-center px-6 mb-12 max-w-screen-xl mx-auto">
        <div className="w-full mb-6">
          <div className="flex items-center shadow-lg rounded-full overflow-hidden bg-white">
            <div className="flex items-center px-4 text-gray-500">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              placeholder="Buscar por ingredientes..."
              className="flex-grow px-6 py-4 outline-none text-gray-700 text-lg"
              aria-label="Campo de busca por ingredientes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full text-left ">
          <button
            onClick={toggleFiltro}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-full text-gray-700 text-base shadow-sm transition cursor-pointer"
            aria-label="Mostrar ou esconder filtros"
          >
            <Filter className="w-4 h-4" />
            {mostrarFiltro ? "Fechar Filtros" : "Filtros"}
          </button>
        </div>

        {mostrarFiltro && (
          <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <label className="text-sm font-semibold text-gray-700">Dificuldade</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Escolha a dificuldade</option>
                <option value="fácil">Fácil</option>
                <option value="médio">Médio</option>
                <option value="difícil">Difícil</option>
              </select>
            </div>

            <div className="flex flex-col space-y-4">
              <label className="text-sm font-semibold text-gray-700">Tipo de Refeição</label>
              <select
                value={mealTypeFilter}
                onChange={(e) => setMealTypeFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Escolha o tipo de refeição</option>
                <option value="café da manhã">Café da Manhã</option>
                <option value="almoço">Almoço</option>
                <option value="lanche">Lanche</option>
                <option value="jantar">Jantar</option>
                <option value="sobremesa">Sobremesa</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={limparFiltros}
                className="text-sm text-blue-600 hover:underline transition"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="px-6 mb-20 max-w-screen-xl mx-auto -mt-12">
        {filteredRecipes.length === 0 ? (
          <div className="text-center text-gray-500">Sem receitas para mostrar!</div>
        ) : (
          <Card data={filteredRecipes} />
        )}
      </section>

      {/* Sugestão do Chef */}
      <section className="px-6 text-center mb-6 max-w-screen-xl mx-auto -mt-18">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ChevronDown className="w-6 h-6 text-gray-600" />
          <h2 className="text-3xl font-semibold text-gray-800">Sugestão do Chef</h2>
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </div>

        {chefSuggestion ? (
          <div
            onClick={handleChefSuggestionClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleChefSuggestionClick();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes da receita: ${chefSuggestion.title}`}
            className="relative w-full mb-8 cursor-pointer rounded-xl overflow-hidden shadow-lg transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            <img
              src={chefImageUrl}
              alt={`Sugestão do Chef - ${chefSuggestion.title}`}
              className="w-full h-[350px] object-cover rounded-xl hover:scale-[1.03] transition-transform duration-300"
              draggable={false}
            />
            <div className="absolute bottom-4 left-4 text-white font-semibold text-xl bg-black bg-opacity-60 p-3 rounded-md">
              {chefSuggestion.title}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Carregando sugestão do chef...</div>
        )}
      </section>
    </main>
  );
}

export default HomePage;
