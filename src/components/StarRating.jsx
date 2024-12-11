/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";

const StarRating = ({ rating, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(null);

  const handleMouseEnter = (star) => {
    setHoveredRating(star);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const handleRate = (star) => {
    onRate(star);
  };

  return (
    <div className="flex justify-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleRate(star)}
          className={`cursor-pointer text-3xl ${
            (hoveredRating || rating) >= star ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired, // Calificación actual (general o del usuario)
  onRate: PropTypes.func.isRequired, // Función para manejar la calificación seleccionada
};

export default StarRating;
