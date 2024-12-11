/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditProfilePage = () => {
  const [user, setUser] = useState({
    full_name: "",
    nickname: "",
    email: "",
    description: "",
    profile_image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        setPreviewImage(response.data.profile_image); // Set preview a la imagen actual
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        alert("No se pudieron cargar los datos del usuario.");
      }
    };

    fetchUserData();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (user.full_name.length < 4) {
      newErrors.full_name = "El nombre debe tener más de 4 caracteres.";
    }
    if (user.nickname.length < 4) {
      newErrors.nickname = "El nickname debe tener más de 4 caracteres.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "El correo debe tener un formato válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Genera un preview de la imagen
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return user.profile_image; // Si no hay imagen nueva, regresa la actual

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await api.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.path; // Devuelve el path de la imagen subida
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("No se pudo subir la imagen.");
      return user.profile_image; // Mantiene la imagen anterior si falla
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Por favor corrige los errores antes de continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedImagePath = await handleImageUpload();

      const updatedUserData = {
        ...user,
        profile_image: uploadedImagePath,
      };

      await api.put(`/users/${id}`, updatedUserData);
      alert("Perfil actualizado con éxito.");
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("No se pudo actualizar el perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-psBlue to-softWhite">
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 bg-white text-psBlue p-2 rounded-full shadow-lg hover:bg-blue-100"
      >
        <i className="fas fa-arrow-left"></i>
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Editar Perfil
        </h1>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-gray-700 font-medium mb-1"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={user.full_name}
              onChange={handleInputChange}
              className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.full_name && "border-red-500"
              }`}
              required
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="nickname"
              className="block text-gray-700 font-medium mb-1"
            >
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={user.nickname}
              onChange={handleInputChange}
              className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.nickname && "border-red-500"
              }`}
              required
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm">{errors.nickname}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.email && "border-red-500"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={user.description}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile_image"
              className="block text-gray-700 font-medium mb-1"
            >
              Imagen de perfil
            </label>
            <input
              type="file"
              id="profile_image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Preview de la imagen */}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 rounded-full mt-4"
              />
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 bg-psBlue text-white font-medium rounded-lg shadow-md hover:bg-blue-700 ${
              Object.keys(errors).length > 0 && "opacity-50 cursor-not-allowed"
            }`}
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
