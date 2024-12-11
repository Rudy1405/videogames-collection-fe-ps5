import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (fullName.length < 4) {
      setError('El nombre debe tener más de 4 caracteres.');
      return;
    }

    if (nickname.length < 4) {
      setError('El nickname debe tener más de 4 caracteres.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const personalCollection = { xbox_games: [], ps5_games: [] };
      await api.post('/users', {
        full_name: fullName,
        nickname,
        email,
        password,
        personal_collection: personalCollection,
      });

      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('No se pudo completar el registro. Verifica los datos e inténtalo nuevamente.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-psBlue to-softWhite">
      {/* Sección izquierda */}
      <div className="w-1/2 flex flex-col justify-center items-center text-white px-12">
        <img
          src="src/assets/psLogo.png"
          alt="PlayStation Logo"
          className="w-24 h-24 mb-4"
        />
        <h1 className="text-4xl font-bold">Bienvenido a</h1>
        <p className="text-xl mt-2">PlayStation Games Collection</p>
      </div>

      {/* Sección derecha */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center rounded-l-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Crea tu cuenta</h2>
        <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
          {/* Input de Nombre completo */}
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          {/* Input de Nickname */}
          <div>
            <label htmlFor="nickname" className="block text-gray-700 font-medium mb-1">
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu nickname"
              required
            />
          </div>

          {/* Input de Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu correo"
              required
            />
          </div>

          {/* Input de Contraseña */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* Input de Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirma tu contraseña"
              required
            />
          </div>

          {/* Mostrar errores */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full py-2 bg-psBlue text-white font-medium rounded-lg shadow-md hover:bg-blue-700"
          >
            Registrarse
          </button>

          {/* Enlace a Login */}
          <p className="text-sm text-gray-500 text-center">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
