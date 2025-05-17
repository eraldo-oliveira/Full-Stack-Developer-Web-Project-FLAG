import { useState, useEffect } from "react";
import { addRecipe, updateRecipe } from "../services/recipeService";
import { useLocation } from "wouter";

const BASE_URL = "https://full-stack-developer-web-project-flag.onrender.com";

function RecipeForm({ initialData }) {
  const [form, setForm] = useState(
    initialData || {
      slug: "",
      title: "",
      image: "",
      ingredients: [""],
      mealType: "",
      difficulty: "",
      time: "",
      description: "",
      instructions: "",
      like: 0,
      chefSuggestion: false,
    }
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (initialData?.image) {

      let imageUrl = "";

      if (
        initialData.image.startsWith("http://") ||
        initialData.image.startsWith("https://")
      ) {
        imageUrl = initialData.image;
      } else {
        // Remove a barra inicial se existir para evitar //
        const path = initialData.image.startsWith("/")
          ? initialData.image.substring(1)
          : initialData.image;

        imageUrl = BASE_URL.endsWith("/")
          ? BASE_URL + path
          : BASE_URL + "/" + path;
      }

      setImagePreview(imageUrl);
    }
  }, [initialData?.image]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.slug || !form.description || !form.instructions) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const recipeToSend = {
      ...form,
      imageFile,
    };

    try {
      if (form._id) {
        await updateRecipe(recipeToSend);
      } else {
        await addRecipe(recipeToSend);
      }
      setLocation("/receitas");
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-md">
      {/* Título */}
      <label className="block">
        <span className="font-semibold">Título *</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Slug */}
      <label className="block">
        <span className="font-semibold">Slug *</span>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Descrição */}
      <label className="block">
        <span className="font-semibold">Descrição *</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border px-4 py-2 rounded mt-1 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Imagem */}
      <label className="block">
        <span className="font-semibold">Imagem</span>
        <div className="mt-2 flex items-center gap-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Pré-visualização"
              className="w-32 h-32 object-cover rounded border"
              onError={() => {
                console.error("Erro ao carregar a imagem preview:", imagePreview);
                setImagePreview(null);
              }}
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center text-gray-400 border rounded">
              Prévia
            </div>
          )}
          <div>
            <label className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Selecionar Imagem
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                className="hidden"
              />
            </label>
            {imageFile && (
              <p className="text-sm text-gray-600 mt-1">{imageFile.name}</p>
            )}
          </div>
        </div>
      </label>

      {/* Ingredientes */}
      <label className="block">
        <span className="font-semibold">Ingredientes</span>
        <div className="space-y-2 mt-2">
          {form.ingredients.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newIngredients = [...form.ingredients];
                  newIngredients[index] = e.target.value;
                  setForm({ ...form, ingredients: newIngredients });
                }}
                className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const newIngredients = form.ingredients.filter((_, i) => i !== index);
                  setForm({ ...form, ingredients: newIngredients });
                }}
                className="text-red-500 font-bold px-2"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm({ ...form, ingredients: [...form.ingredients, ""] })}
            className="text-blue-600 hover:underline mt-1 cursor-pointer"
          >
            + Adicionar ingrediente
          </button>
        </div>
      </label>

      {/* Tipo de Refeição */}
      <label className="block">
        <span className="font-semibold">Tipo de Refeição</span>
        <select
          name="mealType"
          value={form.mealType}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {!form.mealType && <option value="">Selecione...</option>}
          <option value="café da manhã">Café da manhã</option>
          <option value="almoço">Almoço</option>
          <option value="lanche">Lanche</option>
          <option value="jantar">Jantar</option>
          <option value="sobremesa">Sobremesa</option>
        </select>
      </label>

      {/* Dificuldade */}
      <label className="block">
        <span className="font-semibold">Dificuldade</span>
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {!form.difficulty && <option value="">Selecione...</option>}
          <option value="fácil">Fácil</option>
          <option value="médio">Médio</option>
          <option value="difícil">Difícil</option>
        </select>
      </label>

      {/* Tempo */}
      <label className="block">
        <span className="font-semibold">Tempo de Preparo</span>
        <input
          name="time"
          type="text"
          value={form.time}
          onChange={handleChange}
          placeholder="Ex: 1 hora e 30 minutos"
          className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Instruções */}
      <label className="block">
        <span className="font-semibold">Instruções *</span>
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          rows={4}
          className="w-full border px-4 py-2 rounded mt-1 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Sugestão do Chef */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="chefSuggestion"
          checked={form.chefSuggestion}
          onChange={(e) => setForm({ ...form, chefSuggestion: e.target.checked })}
          className="w-5 h-5 cursor-pointer"
        />
        <span className="font-semibold">Marcar como Sugestão do Chef</span>
      </label>

      {/* Botão de envio */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
