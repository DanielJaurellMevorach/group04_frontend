import { cp } from "fs";
import { uploadArtPieceInput } from "./types";

// import dotenv
import * as dotenv from "dotenv";
dotenv.config();

const uploadNewArtPiece = async (artPiece: uploadArtPieceInput) => {
  const formData = new FormData();

  // Add all images
  if (artPiece.images && Array.isArray(artPiece.images)) {
    for (const image of artPiece.images) {
      formData.append("images", image);
    }
  }

  formData.append("title", artPiece.title);
  formData.append("description", artPiece.description);
  formData.append("artist", artPiece.artist);
  formData.append("price", String(artPiece.price));
  formData.append("year", String(artPiece.year));
  formData.append("tags", JSON.stringify(artPiece.tags));

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  if (username) formData.append("username", username);

  const headers: Record<string, string> = {};
  // if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_ADD_ART_PIECE_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Upload error:", errorText);
    throw new Error(`Failed to upload art piece: ${response.statusText}`);
  }

  return response.json();
};

const getAllProducts = async () => {
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GET_ALL_ART_PIECES_URL}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    // console.log("Response from getAllProducts:", response);

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

const getProductById = async (id: string) => {
  const url = process.env.NEXT_PUBLIC_GET_ART_PIECE_BY_ID_URL;

  try {
    const response = await fetch(`${url}artPieceId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    // console.log("Response from getProductById:", response);

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

const getProductsByArtist = async (artistName: string) => {
  const result = await getAllProducts();

  let artPieces: any[] = [];
  if (result.artPieces && Array.isArray(result.artPieces.artPieces)) {
    // console.log(
    //   "Returning result.artPieces.artPieces:",
    //   result.artPieces.artPieces
    // );
    artPieces = result.artPieces.artPieces;
  } else if (Array.isArray(result.artPieces)) {
    // console.log("Returning result.artPieces:", result.artPieces);
    artPieces = result.artPieces;
  } else if (Array.isArray(result)) {
    // console.log("Returning result:", result);
    artPieces = result;
  } else {
    // console.log("Returning empty array");
    artPieces = [];
  }

  if (!artPieces || !Array.isArray(artPieces)) {
    console.error("Invalid response format from getAllProducts:", result);
    throw new Error("Invalid response format from getAllProducts");
  }

  const productsByArtist = artPieces.filter(
    (product: any) => product.artist === artistName
  );

  if (productsByArtist.length === 0) {
    throw new Error(`No products found for artist: ${artistName}`);
  }

  return productsByArtist;
};

const getProductsToSellByUser = async (userId: string) => {
  const result = await getAllProducts();

  let artPieces: any[] = [];
  if (result.artPieces && Array.isArray(result.artPieces.artPieces)) {
    // console.log(
    //   "Returning result.artPieces.artPieces:",
    //   result.artPieces.artPieces
    // );
    artPieces = result.artPieces.artPieces;
  } else if (Array.isArray(result.artPieces)) {
    console.log("Returning result.artPieces:", result.artPieces);
    artPieces = result.artPieces;
  } else if (Array.isArray(result)) {
    console.log("Returning result:", result);
    artPieces = result;
  } else {
    console.log("Returning empty array");
    artPieces = [];
  }

  if (!artPieces || !Array.isArray(artPieces)) {
    console.error("Invalid response format from getAllProducts:", result);
    throw new Error("Invalid response format from getAllProducts");
  }

  const productsToSell = artPieces.filter(
    (product: any) => product.userId === userId
  );

  if (productsToSell.length === 0) {
    throw new Error(`No products found for user: ${userId}`);
  }

  return productsToSell;
};

const addProductToUsersCart = async (productId: string, token: string) => {
  try {
    const url = process.env.NEXT_PUBLIC_USER_ADDS_ART_TO_CART_URL;
    if (!url) {
      throw new Error("Cart URL is not defined in environment variables");
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ artPieceId: productId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    // console.log("Response from addProductToUsersCart:", response);
    return response.json();
  } catch (error) {
    // console.error("Error adding product to cart:", error);
    throw new Error("Failed to add product to cart");
  }
};

const addToLikedItems = async (productId: string, token: string) => {
  try {
    const url = process.env.NEXT_PUBLIC_USER_LIKES_ART_URL;
    if (!url) {
      throw new Error(
        "Liked items URL is not defined in environment variables"
      );
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ artPieceId: productId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to liked items");
    }

    // console.log("Response from addToLikedItems:", response);
    return response.json();
  } catch (error) {
    // console.error("Error adding product to liked items:", error);
    throw new Error("Failed to add product to liked items");
  }
};

const togglePublishArtPiece = async (artPieceId: string, token: string) => {
  const url = process.env.NEXT_PUBLIC_TOGGLE_PUBLISH_URL;

  if (!url) {
    throw new Error(
      "Toggle publish URL is not defined in environment variables"
    );
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ artPieceId }),
  });
  if (!resp.ok) {
    throw new Error(`Failed to toggle publish state for ${artPieceId}`);
  }
  return resp.json(); // { success, action, artPieceId, publishOnMarket }
};

const artPieceService = {
  uploadNewArtPiece,
  getAllProducts,
  getProductById,
  getProductsByArtist,
  getProductsToSellByUser,
  addToLikedItems,
  addProductToUsersCart,
  togglePublishArtPiece,
};

export default artPieceService;
