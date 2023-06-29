import { createCookieSessionStorage, redirect } from "@remix-run/node";

const USER_SESSION_KEY = "payload-token";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: USER_SESSION_KEY,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createUserSession({
  request,
  token,
  redirectTo,
}: {
  request: Request;
  token: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, token);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function getSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    return sessionStorage.getSession(cookie);
};
  
export async function logout(request: Request) {
    const session = await getSession(request);
    await fetch(`${process.env.CMS_URL}/api/users/logout`, {
    credentials: "include",
    headers: {
      Authorization: `JWT ${session.data['payload-token']}`,
    },
  });
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getUser(request : Request) {
  const session = await getSession(request);
  return await fetch(`${process.env.CMS_URL}/api/users/me`, {
    credentials: "include",
    headers: {
      Authorization: `JWT ${session.data['payload-token']}`,
    },
  });
}


  