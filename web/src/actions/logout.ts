"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

export default async function logout() {
  cookies().delete({
    name: "linkerToken",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });
  cookies().delete({
    name: "linkerToken.sig",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });
  cookies().delete({
    name: "linkerRefreshToken",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });
  cookies().delete({
    name: "linkerRefreshToken.sig",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });

  redirect("/");
}
