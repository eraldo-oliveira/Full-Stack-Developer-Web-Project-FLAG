import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Heart } from "lucide-react";
import { Link } from "wouter";

// Importa a URL da API do .env e remove barra final, se houver
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Função para montar URL correta da imagem, evitando barras duplicadas
function getImageUrl(imagePath) {
  if (!imagePath) return "";
  // Remove barra inicial da imagem, se existir
  const cleanPath = imagePath.replace(/^\/+/, "");
  return `${API_URL}/${cleanPath}`;
}

function DetailsPage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeError, setLikeError] = useState("");
  const [match, params] = useRoute("/details/:slug");
  const [likes, setLikes] = useState(0);
  const [similarRecipes, setSimilarRecipes] = useState([]);

  const slug = params.slug;

  useEffect(() => {
    if (!localStorage.getItem("userToken")) {
      localStorage.setItem("userToken", crypto.randomUUID());
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API_URL}/recipes`);
        const data = await res.json();

        const foundRecipe = data.find((item) => item.slug === slug);

        if (foundRecipe) {
          setRecipe(foundRecipe);
          setLikes(foundRecipe.likes);

          let similar = data.filter(
            (item) =>
              item.slug !== slug &&
              item.mealType?.toLowerCase() ===
                foundRecipe.mealType?.toLowerCase()
          );

          if (similar.length === 0) {
            similar = data
              .filter((item) => item.slug !== slug)
              .sort((a, b) => b.likes - a.likes)
              .slice(0, 3);
          }

          setSimilarRecipes(similar);
        } else {
          setError("Receita não encontrada.");
        }
      } catch (err) {
        setError("Erro ao buscar receita.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [slug]);

  const handleLike = () => {
    const userToken = localStorage.getItem("userToken");

    if (recipe.likedUsers?.includes(userToken)) {
      setLikeError("Você já curtiu esta receita. Você pode curtir apenas uma vez.");
      return;
    }

    fetch(`${API_URL}/recipes/${slug}/like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.likes) {
          setLikes(data.likes);
          setRecipe((prev) => ({
            ...prev,
            likedUsers: [...(prev.likedUsers || []), userToken],
          }));
          setLikeError("");
        } else if (data.error) {
          setLikeError(data.error);
        }
      })
      .catch((err) => {
        console.error("Erro ao curtir receita:", err);
        setLikeError("Ocorreu um erro ao tentar curtir. Tente novamente mais tarde.");
      });
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Carregando receita...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          className="w-full h-[350px] object-cover rounded-xl shadow-md"
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{recipe.title}</h1>

      <div className="text-lg text-gray-700 leading-relaxed mb-8 text-justify">
        <p>{recipe.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-4">
          <ul className="text-gray-700 space-y-2 text-center">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="capitalize">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-700 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">Tipo de Refeição:</span>
              <span>{capitalizeFirstLetter(recipe.mealType)}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">Tempo de Preparo:</span>
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">Dificuldade:</span>
              <span>{capitalizeFirstLetter(recipe.difficulty)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-lg text-gray-700 leading-relaxed mb-8 text-justify">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instruções</h2>
        <p>{recipe.instructions}</p>
      </div>

      <div className="flex justify-center mb-2">
        <button
          onClick={handleLike}
          className="flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer"
        >
          <Heart className="w-5 h-5 mr-2" />
          Curtir ({likes})
        </button>
      </div>

      {likeError && (
        <div className="text-center text-red-500 mt-2">{likeError}</div>
      )}

      <div className="flex items-center justify-center mb-10 space-x-4 mt-10">
        <div className="hidden sm:block sm:w-1/3 border-t-3 border-gray-800"></div>
        <h3 className="text-xl font-semibold text-gray-800 text-center">Receitas Similares</h3>
        <div className="hidden sm:block sm:w-1/3 border-t-3 border-gray-800"></div>
      </div>

      {similarRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {similarRecipes.map((similarRecipe) => (
            <Link key={similarRecipe.slug} href={`/details/${similarRecipe.slug}`}>
              <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer">
                <img
                  src={getImageUrl(similarRecipe.image)}
                  alt={similarRecipe.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h4 className="text-lg font-semibold text-gray-800 text-center">
                  {similarRecipe.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-gray-500 text-justify">
          <p>Não encontramos receitas similares.</p>
          <Link href="/">
            <button className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
              Ver todas as receitas
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}

export default DetailsPage;
