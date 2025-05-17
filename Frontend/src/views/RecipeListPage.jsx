import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { getAllRecipes, deleteRecipe } from "../services/recipeService";

function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    getAllRecipes()
      .then((recipes) => {
        if (Array.isArray(recipes)) {
          setRecipes(recipes);
        } else {
          console.error("Dados de receitas não são válidos", recipes);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar receitas:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (_id) => {
    if (!_id) {
      console.error("ID inválido para deletar a receita");
      return;
    }

    if (window.confirm("Você tem certeza que deseja excluir esta receita?")) {
      try {
        await deleteRecipe(_id);
        const updated = await getAllRecipes();
        setRecipes(updated);
      } catch (error) {
        console.error("Erro ao excluir receita", error);
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Lista de receitas</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/nova-receita")}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Adicionar nova receita
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Carregando receitas...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {recipes.map((recipe) => {
            const key = recipe._id ? recipe._id : `recipe-${recipe.title}-${Math.random()}`;

            return (
              <div key={key} className="flex justify-between items-center gap-20">
                <span className="font-medium">{recipe.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => recipe._id ? navigate(`/edit/${recipe._id}`) : alert("ID inválido")}
                    className="flex items-center gap-1 text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="flex items-center gap-1 text-sm bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Apagar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default RecipeListPage;
