import { useState, useEffect } from 'react';

const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage or wherever you're storing it
    const storedToken = localStorage.getItem('authToken'); // or your storage method
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return token;
};

export default useToken; 