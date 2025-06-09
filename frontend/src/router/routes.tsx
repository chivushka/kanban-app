import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTER_KEYS } from '@/shared/keys';
import { HomePage } from '@/modules/home/home.page';
import BoardPage from '@/modules/board/board.page';

export const publicRoutes = (
  <Routes>
    <Route path={ROUTER_KEYS.HOME} element={<HomePage />} />
    <Route path={ROUTER_KEYS.BOARD} element={<BoardPage />} />
    <Route
      path={ROUTER_KEYS.ALL_MATCH}
      element={<Navigate to={ROUTER_KEYS.HOME} />}
    />
  </Routes>
);

export const privateRoutes = (
  <Routes>
    <Route
      path={ROUTER_KEYS.ALL_MATCH}
      element={<Navigate to={ROUTER_KEYS.HOME} />}
    />
  </Routes>
);
