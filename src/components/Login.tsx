import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        firstName,
        email,
        password,
        dob,
        height: Number(height),
        weight: Number(weight),
      });
      console.log(response.data);
      localStorage.setItem('bmr', response.data.user.bmr); // Store BMR in local storage
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data in local storage
      setIsRegistering(false);
    } catch (error) {
      console.error('Error registering user:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/'); // Redirect to the main page
    } catch (error) {
      console.error('Error logging in:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <div>
      {isRegistering ? (
        <div>
          <h2>Register</h2>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Date of Birth" />
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height (cm)" />
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" />
          <button onClick={handleRegister}>Register</button>
          <button onClick={() => setIsRegistering(false)}>Back to Login</button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={handleLogin}>Login</button>
          <button onClick={() => setIsRegistering(true)}>Register</button>
        </div>
      )}
    </div>
  );
};

export default Login;