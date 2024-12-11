/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import StarRating from "../components/StarRating";
import api from "../services/api";

// Registrar los elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const GameDetailsPage = () => {
  const [game, setGame] = useState({});
  const [generalRating, setGeneralRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const selectedGame = JSON.parse(localStorage.getItem("selectedGame"));
        if (!selectedGame) {
          alert("No se encontró información del juego.");
          navigate("/feed");
          return;
        }
        setGame(selectedGame);

        // Obtener detalles adicionales del juego
        const response = await api.get(`/game-info/${selectedGame.id}`);
        setGeneralRating(response.data.general_rating);
        setComments(response.data.user_comments || []);
      } catch (error) {
        console.error("Error al cargar detalles del juego:", error);
        alert("No se pudieron cargar los detalles del juego.");
      }
    };

    fetchGameDetails();
  }, [navigate]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const newCommentData = {
        user_image: user.profile_image || "https://via.placeholder.com/150",
        user_nickname: user.nickname || "Guest",
        comment: newComment,
      };

      await api.put(`/game-info/${game.id}`, newCommentData);

      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      alert("No se pudo agregar tu comentario.");
    }
  };

  const handleRateGame = async (rating) => {
    try {
      const newGeneralRating =
        (generalRating * comments.length + rating) / (comments.length + 1);

      await api.put(`/game-info/${game.id}`, {
        general_rating: newGeneralRating,
      });

      setGeneralRating(newGeneralRating);
    } catch (error) {
      console.error("Error al calificar el juego:", error);
      alert("No se pudo registrar tu calificación.");
    }
  };

  const chartData = {
    labels: ["Calificación actual", "Resto"],
    datasets: [
      {
        data: [generalRating, 5 - generalRating],
        backgroundColor: ["#0070d1", "#e5e7eb"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-psBlue to-softWhite">
      <button
        onClick={() => navigate("/feed")}
        className="absolute top-4 left-4 bg-white text-psBlue p-2 rounded-full shadow-lg hover:bg-blue-100"
      >
        <i className="fas fa-arrow-left"></i>
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h1 className="text-2xl font-bold text-gray-800">{game.name}</h1>
        <p className="text-sm text-gray-600 mb-2">{game.developer}</p>
        <p className="text-gray-700 mb-4">{game.description}</p>
        <p className="text-sm text-gray-500 text-right">
          Lanzado: {game.release_date}
        </p>

        <div className="my-4">
          <h2 className="text-lg font-bold text-gray-800 text-center">
            Calificación General
          </h2>
          <div className="relative w-40 h-40 mx-auto">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <StarRating rating={generalRating} onRate={handleRateGame} />

        <div className="my-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Comentarios</h2>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-4">
                <img
                  src={comment.user_image}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    {comment.user_nickname}
                  </h3>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border rounded-lg p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe tu comentario..."
          ></textarea>
          <button
            onClick={handleAddComment}
            className="w-full bg-psBlue text-white py-2 rounded-lg hover:bg-blue-700 mt-2"
          >
            Comentar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
