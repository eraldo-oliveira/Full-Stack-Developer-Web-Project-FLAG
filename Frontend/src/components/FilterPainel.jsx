import { useState } from "react";

const categorias = ["Café da manhã", "Almoço", "Lanche", "Jantar", "Sobremesa"];
const ingredientes = ["Frango", "Batata", "Tomate", "Cenoura", "Arroz", "Feijão"];

export default function FilterPanel({ onFilter }) {
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedIngredientes, setSelectedIngredientes] = useState([]);

  const toggleIngrediente = (ingrediente) => {
    setSelectedIngredientes((prev) =>
      prev.includes(ingrediente)
        ? prev.filter((ing) => ing !== ingrediente)
        : [...prev, ingrediente]
    );
  };

  const aplicarFiltros = () => {
    onFilter({ categoria: selectedCategoria, ingredientes: selectedIngredientes });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full mt-4">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>

      {/* Categoria */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Categoria</label>
        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Todas</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Ingredientes */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Ingredientes</label>
        <div className="flex flex-wrap gap-2">
          {ingredientes.map((ing) => (
            <button
              key={ing}
              onClick={() => toggleIngrediente(ing)}
              className={`px-3 py-1 rounded-full border ${
                selectedIngredientes.includes(ing)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {ing}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={aplicarFiltros}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Aplicar Filtros
      </button>
    </div>
  );
}
