/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

const GameCard = ({ game, onAddToCollection, onViewDetails, onDelete, deleteMode }) => {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800">{game.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{game.category.name}</p>
          {!deleteMode ? (
            <>
              <button
                onClick={() => onAddToCollection(game.id)}
                className="block w-full bg-psBlue text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Agregar a colección
              </button>
              <button
                onClick={() => onViewDetails(game)}
                className="block w-full bg-gray-200 text-gray-800 py-2 mt-2 rounded-lg hover:bg-gray-300"
              >
                Ver detalles
              </button>
            </>
          ) : (
            <button
              onClick={() => onDelete(game)}
              className="block w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Eliminar de la colección
            </button>
          )}
        </div>
      </div>
    );
  };
  

// Validación de props
GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onAddToCollection: PropTypes.func,
  onViewDetails: PropTypes.func,
  onRemoveFromCollection: PropTypes.func,
};

export default GameCard;
