import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      if (req.nextUrl.pathname.startsWith("/profile")) {
        return !!token;
      }
      return true;
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/profile"]
};
