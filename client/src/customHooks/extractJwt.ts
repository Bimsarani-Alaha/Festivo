import { jwtDecode } from "jwt-decode";


// Define a custom type for the JWT payload
interface JwtPayload {
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
  role?:string;
  sub?:string;
}

function getUserDetails(): Partial<JwtPayload> | null {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log(token)
  if (!token) return null;

  try {
    const payload: JwtPayload = jwtDecode(token);
    return {
      name: payload.name,
      preferred_username: payload.preferred_username,
      given_name: payload.given_name,
      family_name: payload.family_name,
      email: payload.email,
      role: role || undefined,
      sub: payload.sub,
    };
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
}

export default getUserDetails
