/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import GameCard from "../components/GameCard";
import api from "../services/api";

const CollectionPage = () => {
  const [user, setUser] = useState({});
  const [collection, setCollection] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUser(user);

        // Fetch user's collection
        const response = await api.get(`/users/${user.id}`);
        const { personal_collection } = response.data;

        // Fetch game details for each game ID in ps5_games
        if (personal_collection && personal_collection.ps5_games) {
          const gameRequests = personal_collection.ps5_games.map((id) =>
            api.get(`/ps5-games/${id}`)
          );
          const games = await Promise.all(gameRequests);
          setCollection(games.map((game) => game.data));
        }
      } catch (error) {
        console.error("Error al cargar la colección:", error);
        alert("No se pudo cargar tu colección.");
      }
    };

    fetchCollection();
  }, []);

  const handleDeleteGame = async () => {
    if (!selectedGame) return;

    try {
      // Fetch the current collection from the API
      const response = await api.get(`/users/${user.id}`);
      const personalCollection = response.data.personal_collection;

      // Remove the game ID from ps5_games
      personalCollection.ps5_games = personalCollection.ps5_games.filter(
        (id) => id !== selectedGame.id
      );

      // Update the user's collection
      await api.put(`/users/${user.id}`, {
        personal_collection: personalCollection,
      });

      // Update the collection in the state
      setCollection((prev) => prev.filter((game) => game.id !== selectedGame.id));

      alert(`${selectedGame.name} ha sido eliminado de tu colección.`);
      setModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el juego de la colección:", error);
      alert("No se pudo eliminar el juego de tu colección.");
    }
  };

  const openDeleteModal = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setSelectedGame(null);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gradient-to-b from-psBlue to-softWhite relative">
        {/* Botón de regreso */}
        <button
          onClick={goBack}
          className="absolute top-4 left-4 bg-white text-psBlue p-2 rounded-full shadow-lg hover:bg-blue-100"
        >
          <i className="fas fa-arrow-left"></i>
        </button>

        <h1 className="text-2xl font-bold text-center mb-4">
          Mi Colección de Juegos
        </h1>

        {/* Grid de juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collection.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDelete={() => openDeleteModal(game)}
              deleteMode
            />
          ))}
        </div>
      </main>

      {/* Modal de confirmación */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              ¿Seguro deseas eliminar{" "}
              <span className="text-psBlue">{selectedGame?.name}</span> de tu
              colección?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDeleteGame}
                className="px-4 py-2 bg-psBlue text-white rounded-lg hover:bg-blue-700"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
