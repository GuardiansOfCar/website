import "server-only";
import { SignJWT, jwtVerify, JWTPayload, jwtDecrypt, decodeJwt } from "jose";
import { cookies } from "next/headers";

interface SessionPayload {
  email: string;
  id: number;
  nickname: string;
  role: string;
}

const secretKey = "Z8Dy1NTdrdiTXkq0zNDQ3NNgAEwkrmnCc09kw1fnwEo=";
const encodedKey = new TextEncoder().encode(secretKey);

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function createSession(token: string, profile: SessionPayload) {
  const session = await encrypt({ ...profile, sub: profile.id.toString() });

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    path: "/",
  });
}

export async function encrypt(payload: SessionPayload & JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
  }
}
