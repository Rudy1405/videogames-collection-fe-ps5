import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/feed');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Credenciales incorrectas');
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
      <div className="w-1/2 bg-white flex flex-col justify-center items-center rounded-l-3xl shadow-lg">
        <div className="w-full max-w-md p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Inicia sesión</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input de Email */}
            <div className="text-left">
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

            {/* Input de Password */}
            <div className="text-left relative">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu contraseña"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-blue-600"
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
            </div>

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              className="w-full py-3 bg-psBlue text-white font-medium rounded-lg shadow-md hover:bg-blue-700"
            >
              Iniciar sesión
            </button>

            {/* Enlace a Registro */}
            <p className="text-sm text-gray-500 text-center">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
