import { useState } from "react";
import { useLocation } from "wouter";
import RecipeForm from "../components/RecipeForm";
import { addRecipe } from "../services/recipeService";

function CreateRecipePage() {
  const [loading] = useState(false);
  const [, navigate] = useLocation();  

  const handleSubmit = async (form) => {
    try {
      await addRecipe(form);  
      navigate("/receitas", { replace: true });  
    } catch (error) {
      console.error("Erro ao criar receita:", error);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Nova Receita</h1>
      <RecipeForm onSubmit={handleSubmit} />
      {loading && <div className="text-center mt-4">Adicionando a receita...</div>}
    </main>
  );
}

export default CreateRecipePage;

