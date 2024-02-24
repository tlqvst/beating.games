import { LoggedInLayout } from '@/components/Layout/Layouts/LoggedInLayout';
import { LoggedOutLayout } from '@/components/Layout/Layouts/LoggedOutLayout';
import { Home } from '@/features/home';
import { Profile } from '@/features/profile';
import { Settings } from '@/features/settings';
import { useGetLoginStatus } from '@/generated/user/user';
import { GuardLogin } from '@/guards/GuardLogin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const AppRoutes = () => {
  const user = useGetLoginStatus({
    query: {
      staleTime: 0,
      throwOnError: false,
    },
  });

  if (user.isFetching || user.isLoading) return <></>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user.data?.isLoggedIn ? <LoggedInLayout /> : <LoggedOutLayout />
          }
        >
          <Route index element={<Home />} />
          <Route path="/user/:username" element={<Profile />} />

          <Route element={<GuardLogin isLoggedIn={user.data?.isLoggedIn} />}>
            <Route path="/user/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
