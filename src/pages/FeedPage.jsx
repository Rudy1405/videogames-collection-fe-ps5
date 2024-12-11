/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import GameCard from "../components/GameCard";
import api from "../services/api";

const FeedPage = () => {
  const [user, setUser] = useState({});
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la información del usuario y los datos iniciales
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUser(user);

        const gamesResponse = await api.get("/ps5-games");
        const categoriesResponse = await api.get("/categories");

        setGames(gamesResponse.data);
        setCategories(categoriesResponse.data);
        setFilteredGames(gamesResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("No se pudieron cargar los datos. Por favor, intenta nuevamente.");
      }
    };

    fetchData();
  }, []);

  const handleCategoryFilter = (categoryId) => {
    const filtered = games.filter((game) => game.category.id === categoryId);
    setFilteredGames(filtered);
  };

  const handleAddToCollection = async (gameId) => {
    try {
      const userResponse = await api.get(`/users/${user.id}`);
      const personalCollection = userResponse.data.personal_collection || {
        xbox_games: [],
        ps5_games: [],
      };

      if (!personalCollection.ps5_games.includes(gameId)) {
        personalCollection.ps5_games.push(gameId);

        await api.put(`/users/${user.id}`, {
          personal_collection: personalCollection,
        });

        alert("Juego agregado a tu colección.");
      } else {
        alert("El juego ya está en tu colección.");
      }
    } catch (error) {
      console.error("Error al agregar a la colección:", error);
      alert("No se pudo agregar el juego a tu colección.");
    }
  };

  const handleGoToDetails = (game) => {
    localStorage.setItem("selectedGame", JSON.stringify(game));
    navigate(`/game/${game.id}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gradient-to-b from-psBlue to-softWhite">
        <h1 className="text-2xl font-bold text-center mb-4">Feed de Juegos</h1>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap justify-center space-x-4 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className="px-4 py-2 bg-psBlue text-white rounded-full hover:bg-blue-700"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grid de juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onAddToCollection={handleAddToCollection}
              onViewDetails={handleGoToDetails}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
