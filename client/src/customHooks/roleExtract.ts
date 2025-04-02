export const getRole = (): string | null => {
    const role: string | null = localStorage.getItem("role");
    return role;
  };
  