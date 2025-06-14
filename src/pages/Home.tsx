import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to Forela</h1>
      {user && (
        <div>
          <p>Hello, {user.email}</p>
          {/* Add more home page content here */}
        </div>
      )}
    </div>
  );
};

export default Home; 