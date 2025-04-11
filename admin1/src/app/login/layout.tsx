import authOptions from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return redirect("/");
  }

  return (
    <div className="login-layout">
      {children}
    </div>
  );
}