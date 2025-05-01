import { jwtDecode } from "jwt-decode";

// Define a custom type for the JWT payload
interface JwtPayload {
  sub?: string;  // This typically contains the email/username
  name?: string;
  email?: string;
  roles?: string[];
  // Add other potential claims from your token
}

export function getSupplierDetails(): JwtPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // First, verify the token structure
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the token
    const decoded: JwtPayload = jwtDecode(token);
    
    // Extract the email - it might be in 'sub' or 'email' field
    const email = decoded.email || decoded.sub;
    
    // Get role from localStorage as fallback
    const role = localStorage.getItem("role");

    return {
      ...decoded,
      email: email || undefined,
      roles: decoded.roles || (role ? [role] : undefined)
    };
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}