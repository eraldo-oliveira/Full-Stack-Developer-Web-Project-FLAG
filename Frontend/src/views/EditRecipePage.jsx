import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { getRecipeById, updateRecipe } from "../services/recipeService";
import RecipeForm from "../components/RecipeForm";

function EditRecipePage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const { _id } = useParams();
  const [, navigate] = useLocation(); 

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const recipeData = await getRecipeById(_id);
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          console.error("Receita não encontrada");
          navigate("/receitas", { replace: true });  
        }
      } catch (error) {
        console.error("Erro ao carregar a receita:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [_id, navigate]);

  const handleSubmit = async (form) => {
    if (!form.title || !form.description || form.ingredients.length === 0) {
      alert("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    try {
      await updateRecipe(form);  
      navigate("/receitas", { replace: true }); 
    } catch (error) {
      console.error("Erro ao atualizar a receita:", error);
      alert("Houve um erro ao atualizar a receita. Tente novamente!");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!recipe) return <p>Receita não encontrada.</p>;

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Editar Receita</h1>
      <RecipeForm initialData={recipe} onSubmit={handleSubmit} />
    </main>
  );
}

export default EditRecipePage;
