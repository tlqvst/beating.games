import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const GuardLogin = ({ isLoggedIn }: { isLoggedIn?: boolean }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return <Outlet />;
};
