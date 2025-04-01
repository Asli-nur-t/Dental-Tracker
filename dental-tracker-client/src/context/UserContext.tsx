import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

interface UserContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  userProfile: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5164/api/User/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          setError('Profil bilgileri alınamadı');
        }
      } catch (error) {
        setError('Profil bilgileri alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 