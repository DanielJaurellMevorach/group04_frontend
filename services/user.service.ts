const login = async (username: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_USER_AUTHENTICATE_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

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

const register = async (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ADD_USER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    const { token, username: actualUsername, role } = await response.json();

    return {
      token,
      username: actualUsername,
      role,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Registration failed");
  }
};

const userService = {
  login,
  register,
};

export default userService;
