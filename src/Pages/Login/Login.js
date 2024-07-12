import React, { useState, useEffect } from 'react';
import { useManagerAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/components/Login.scss';


const Login = () => {
  const [email, setEmail] = useState('ssy.balu@gmail.com');
  const [password, setPassword] = useState('1234');
  const { login,manager } = useManagerAuth(); // Assuming managerAuth provides login method
  const navigate = useNavigate();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 


  useEffect(() => {
    if (manager) {
      navigate('/dashboard');
    }
  }, [manager, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      setLoading(false);
      navigate('/dashboard');
      toast.success('Login successful');
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
      toast.error('Login failed');
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="login-box">
        <h2>PG Manager Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="user-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input
            className="inputButton"
            type="submit"
            value={loading ? 'Loading...' : 'Login'}
          />
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
