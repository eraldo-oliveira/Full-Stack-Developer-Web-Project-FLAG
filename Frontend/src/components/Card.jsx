import { useEffect, useState } from "react";
import { Heart, Clock } from "lucide-react";
import { useLocation } from "wouter";

function Card({ data }) {
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(3);
  const [, setLocation] = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!data) {
      fetch(`${API_URL}recipes`)
        .then((response) => response.json())
        .then(setCards)
        .catch((error) => console.error("Erro ao carregar cards:", error));
    }
  }, [data, API_URL]);

  const cardsToRender = data || cards;
  const cardsToDisplay = cardsToRender.slice(0, visibleCards);

  function showMoreCards() {
    setVisibleCards((prev) => prev + 3);
  }

  const handleNavigate = (slug) => {
    setLocation(`/details/${slug}`);
  };

  return (
    <section className="container mx-auto px-6 py-8 bg-gray-50">
      {cardsToRender.length === 0 ? (
        <div className="text-center text-gray-500">Carregando...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cardsToDisplay.map((card) => (
            <div
              key={card._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col justify-between"
            >
              <img
                src={card.image}
                alt={`Imagem de ${card.title}`}
                className="w-full h-[250px] object-cover"
                draggable={false}
              />

              <div className="p-4 space-y-2 flex flex-col justify-between items-center text-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>

                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{card.time}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{card.likes} curtidas</span>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate(card.slug)}
                  className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-base cursor-pointer"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleCards < cardsToRender.length && (
        <div className="text-center mt-8">
          <button
            onClick={showMoreCards}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg cursor-pointer"
            aria-label="Ver mais cards"
          >
            Ver mais
          </button>
        </div>
      )}
    </section>
  );
}

export default Card;
