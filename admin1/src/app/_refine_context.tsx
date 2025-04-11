"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { Refine, type AuthProvider } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import routerProvider from "@refinedev/nextjs-router";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "../contexts/color-mode";
import { dataProvider } from "../providers/data-provider";
import "@refinedev/antd/dist/reset.css";

type RefineContextProps = {
  defaultMode?: string;
};

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>
) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  );
};

const App = (props: React.PropsWithChildren<RefineContextProps>) => {
  const { data, status } = useSession();
  const to = usePathname();
  const router = useRouter();

  if (status === "loading") {
    return <span>Đang tải...</span>;
  }

  // if (status === "unauthenticated" && to !== "/login") {
  //   router.push("/login");
  //   return <span>Đang chuyển hướng...</span>;
  // }

  // if (status === "authenticated" && to === "/login") {
  //   router.push("/");
  //   return <span>Đang chuyển hướng đến trang chính...</span>;
  // }

  const authProvider: AuthProvider = {
    login: async () => {
      signIn("google", {
        callbackUrl: to ? to.toString() : "/",
        redirect: true,
      });

      return {
        success: true,
      };
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: "/login",
      });

      return {
        success: true,
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return {
        error,
      };
    },
    check: async () => {
      if (status === "unauthenticated") {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    },
    getPermissions: async () => {
      return null;
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data;
        return {
          name: user.name,
          avatar: user.image,
        };
      }

      return null;
    },
  };

  const defaultMode = props?.defaultMode;

  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            authProvider={authProvider}
            resources={[
              {
                name: "comics",
                list: "/comics",
                create: "/comics/create",
                edit: "/comics/edit/:id",
                show: "/comics/show/:id",
                meta: {
                  canDelete: true,
                  label: "Truyện tranh",
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
                  label: "Chi tiết truyện",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              disableTelemetry: true,
            }}
          >
            {props.children}
            <RefineKbar />
          </Refine>
        </ColorModeContextProvider>
      </AntdRegistry>
    </RefineKbarProvider>
  );
};