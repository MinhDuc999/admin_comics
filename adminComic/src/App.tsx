import React, { useEffect, useState } from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  notificationProvider,
  ThemedLayoutV2,
} from "@refinedev/antd";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "@refinedev/antd/dist/reset.css";

import { dataProvider } from "../dataProvider";
import { ComicList } from "./pages/comics/list";
import { ComicCreate } from "./pages/comics/create";
import { ComicEdit } from "./pages/comics/edit";
import { ComicShow } from "./pages/comics/show";
import { DetailComicList } from "./pages/detailComics/list";
import { DetailComicCreate } from "./pages/detailComics/create";
import { DetailComicEdit } from "./pages/detailComics/edit";
import { DetailComicShow } from "./pages/detailComics/show";
import { LoginPage } from "./pages/login";
import { authProvider } from "./authProvider";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    authProvider.check().then((res) => {
      setIsAuthenticated(res.authenticated);
    });
  }, []);

  if (isAuthenticated === null) {
    return <div>Đang kiểm tra đăng nhập...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};


const AppLayout: React.FC = () => {
  return (
    <ThemedLayoutV2>
      <Outlet />
    </ThemedLayoutV2>
  );
};


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ComicList /> },
      {
        path: "comics",
        children: [
          { index: true, element: <ComicList /> },
          { path: "create", element: <ComicCreate /> },
          { path: "edit/:id", element: <ComicEdit /> },
          { path: "show/:id", element: <ComicShow /> },
        ],
      },
      {
        path: "detail_comics",
        children: [
          { index: true, element: <DetailComicList /> },
          { path: "create", element: <DetailComicCreate /> },
          { path: "edit/:id", element: <DetailComicEdit /> },
          { path: "show/:id", element: <DetailComicShow /> },
        ],
      },
      {
        path: "*",
        element: <ErrorComponent />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <GoogleOAuthProvider clientId="510682509369-kivsmv9998h6ehvlgkph8e9eq5lq7da6.apps.googleusercontent.com">
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          notificationProvider={notificationProvider}
          resources={[
            {
              name: "comics",
              list: "/comics",
              create: "/comics/create",
              edit: "/comics/edit/:id",
              show: "/comics/show/:id",
              meta: {
                canDelete: true,
                label: "Truyện tranh"
              },
            },
            {
              name: "detail_comics",
              list: "/detail_comics",
              create: "/detail_comics/create",
              edit: "/detail_comics/edit/:id",
              show: "/detail_comics/show/:id",
              meta: {
                canDelete: true,
                label: "Chi tiết truyện"
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            disableTelemetry: true,
          }}
        >
          <RouterProvider router={router} />
          <RefineKbar />
        </Refine>
      </RefineKbarProvider>
    </GoogleOAuthProvider>
  );
}

export default App;