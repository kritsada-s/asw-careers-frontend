import { decrypt } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { TokenProps } from '@/lib/types';

export const useToken = () => {
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

export const useDecryptedToken = (): TokenProps | null => {
  const token = useToken();
  const decryptedToken = decrypt(token || '');
  return decryptedToken ? JSON.parse(decryptedToken) as TokenProps : null;
}