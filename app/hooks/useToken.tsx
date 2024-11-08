import { useEffect, useState } from 'react';

const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  return token;
};

export default useToken;
