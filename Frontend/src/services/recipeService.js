const API_URL = `${import.meta.env.VITE_API_URL}recipes`;

function buildFormData(recipe) {
  const formData = new FormData();

  for (const key in recipe) {
    if (key === "imageFile" && recipe.imageFile) {
      formData.append("imageFile", recipe.imageFile);
    } else if (key === "ingredients") {
      recipe[key].forEach((ingredient, index) => {
        formData.append(`ingredients[${index}]`, ingredient);
      });
    } else if (Array.isArray(recipe[key])) {
      recipe[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item); 
      });
    } else if (key !== "imageFile") {
      formData.append(key, recipe[key]);
    }
  }

  return formData;
}


export async function getAllRecipes() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Erro ao buscar receitas");
  return await response.json();
}


export async function getRecipeById(_id) {
  const response = await fetch(`${API_URL}/${_id}`);
  if (!response.ok) throw new Error("Receita não encontrada");
  return await response.json();
}


export async function updateRecipe(updatedRecipe) {
  const formData = buildFormData(updatedRecipe);

  const response = await fetch(`${API_URL}/${updatedRecipe._id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) throw new Error("Erro ao atualizar receita");
  return await response.json();
}

export async function deleteRecipe(_id) {
  const response = await fetch(`${API_URL}/${_id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir receita");
}

export async function addRecipe(newRecipe) {
  const formData = buildFormData(newRecipe);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Erro ao adicionar receita");
  return await response.json();
}
