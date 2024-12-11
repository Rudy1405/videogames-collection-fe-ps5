/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types"; // Importar PropTypes para validar props
import { useNavigate } from "react-router-dom";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col items-center py-6">
      <div className="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden shadow-md">
        <img
          src={user.profile_image || "https://via.placeholder.com/150"}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-xl font-bold text-blue-600 mb-6">
        Welcome, {user.nickname || "Guest"}
      </h2>
      <ul className="w-full">
        <li className="text-blue-600 font-medium hover:bg-blue-100 rounded-lg py-3 px-6 cursor-pointer transition duration-300">
          <button onClick={() => navigate(`/profile/${user.id}`)}>
            <i className="fas fa-user mr-3"></i> Mi perfil
          </button>
        </li>
        <li className="text-blue-600 font-medium hover:bg-blue-100 rounded-lg py-3 px-6 cursor-pointer transition duration-300">
          <button onClick={() => navigate("/collection")}>
            <i className="fas fa-gamepad mr-3"></i> Mi colección
          </button>
        </li>
        <li className="text-blue-600 font-medium hover:bg-blue-100 rounded-lg py-3 px-6 cursor-pointer transition duration-300">
          <button onClick={handleLogout}>
            <i className="fas fa-sign-out-alt mr-3"></i> Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

// Validar las props con PropTypes
Sidebar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profile_image: PropTypes.string,
    nickname: PropTypes.string,
  }).isRequired, // El prop user es obligatorio
};

export default Sidebar;
