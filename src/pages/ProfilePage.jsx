/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../services/api";

ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend
);

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Tomar el ID del usuario desde la URL

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        alert("No se pudieron cargar los datos del usuario.");
      }
    };

    fetchUserData();
  }, [id]);

  const chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Interacciones",
        data: [5, 10, 8, 15, 12],
        borderColor: "#003791", // Azul PlayStation
        backgroundColor: "rgba(0, 55, 145, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleGoBack = () => {
    navigate("/feed");
  };

  const handleEditProfile = () => {
    navigate(`/profile/${id}/edit`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-psBlue to-softWhite">
      {/* Botón de regreso */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 bg-white text-psBlue p-2 rounded-full shadow-lg hover:bg-blue-100"
      >
        <i className="fas fa-arrow-left"></i>
      </button>

      {/* Tarjeta del perfil */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.profile_image || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">{user.full_name}</h1>
          <p className="text-sm text-gray-500">@{user.nickname}</p>
        </div>

        <p className="text-gray-700 mb-4">{user.description || "Sin descripción."}</p>
        <p className="text-sm text-gray-500">Correo: {user.email}</p>

        {/* Gráfico mockeado */}
        <div className="my-6 h-64">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Botón para editar perfil */}
        <button
          onClick={handleEditProfile}
          className="block w-full bg-psBlue text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
