const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const login = async (username: string, password: string) => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const { token, username: actualUsername, role } = await response.json();

  return {
    token,
    username: actualUsername,
    role,
  };
};

const userService = {
  login,
};

export default userService;
