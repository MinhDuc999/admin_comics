"use client";
import { RefineContext } from "./_refine_context";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <RefineContext>
            {isLoginPage ? (
              children
            ) : (
              <ThemedLayoutV2>
                {children}
              </ThemedLayoutV2>
            )}
          </RefineContext>
        </SessionProvider>
      </body>
    </html>
  );
}