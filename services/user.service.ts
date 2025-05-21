import artPieceService from "./artPiece.service";

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

const getUsersLikedItems = async (token: string) => {
  const url = `${process.env.NEXT_PUBLIC_GET_USERS_LIKED_ITEMS_URL}`;

  const decodedToken = decodeJWT(token);
  if (!decodedToken) {
    throw new Error("Invalid token");
  }

  const userId = decodedToken.userId;
  if (!userId) {
    throw new Error("User ID not found in token");
  }

  try {
    const response = await fetch(`${url}userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch liked items");
    }

    const data = await response.json(); // { likedItems: [...] }

    if (!data.likedItems || !Array.isArray(data.likedItems)) {
      return [];
    }

    // Fetch all liked items in parallel
    const likedItemsDetails = await Promise.all(
      data.likedItems.map((itemId: string) =>
        artPieceService.getProductById(itemId)
      )
    );
    return likedItemsDetails;
  } catch (error) {
    console.error("Error fetching liked items:", error);
    throw new Error("Failed to fetch liked items");
  }
};

const getUsersCartItems = async (token: string) => {
  const url = `${process.env.NEXT_PUBLIC_GET_USERS_CART_URL}`;

  const decodedToken = decodeJWT(token);
  if (!decodedToken) {
    throw new Error("Invalid token");
  }

  const userId = decodedToken.userId;
  if (!userId) {
    throw new Error("User ID not found in token");
  }

  try {
    const response = await fetch(`${url}userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch liked items");
    }

    const data = await response.json(); // { likedItems: [...] }

    if (!data.userCart || !Array.isArray(data.userCart)) {
      return [];
    }

    // Fetch all liked items in parallel
    const likedItemsDetails = await Promise.all(
      data.userCart.map((itemId: string) =>
        artPieceService.getProductById(itemId)
      )
    );
    console.log("likedUserCart", likedItemsDetails);
    return likedItemsDetails;
  } catch (error) {
    console.error("Error fetching liked items:", error);
    throw new Error("Failed to fetch liked items");
  }
};

const toggleLikeItem = async (token: string, itemId: string) => {
  const url = `${process.env.NEXT_PUBLIC_USER_LIKES_ART_URL}`;

  if (!token) {
    throw new Error("Token is required");
  }

  const decodedToken = decodeJWT(token);

  if (!decodedToken) {
    throw new Error("Invalid token");
  }

  const userId = decodedToken.userId;

  if (!userId) {
    throw new Error("User ID not found in token");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        artPieceId: itemId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like item");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling like item:", error);
    throw new Error("Failed to toggle like item");
  }
};

const toggleCartItem = async (token: string, itemId: string) => {
  const url = `${process.env.NEXT_PUBLIC_USER_ADDS_ART_TO_CART_URL}`;

  if (!token) {
    throw new Error("Token is required");
  }

  const decodedToken = decodeJWT(token);

  if (!decodedToken) {
    throw new Error("Invalid token");
  }

  const userId = decodedToken.userId;

  if (!userId) {
    throw new Error("User ID not found in token");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        artPieceId: itemId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like item");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling like item:", error);
    throw new Error("Failed to toggle like item");
  }
};

const decodeJWT = (token: string) => {
  if (!token) {
    return null;
  }

  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  const userData = JSON.parse(decodedPayload);

  return userData;
};

const userService = {
  login,
  register,
  decodeJWT,
  getUsersLikedItems,
  getUsersCartItems,
  toggleLikeItem,
  toggleCartItem,
};

export default userService;
