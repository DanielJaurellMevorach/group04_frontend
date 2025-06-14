import { cp } from "fs";
import { uploadArtPieceInput } from "./types";

// import dotenv
import * as dotenv from "dotenv";
dotenv.config();


const uploadImageToBlob = async (file: File) => {
  const url = `${process.env.NEXT_PUBLIC_UPLOAD_IMAGE}?name=${encodeURIComponent(file.name)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image upload failed: ${errorText}`);
  }

  // Azure function can return the blob URL or you construct it if you know the format
  const uploadedUrl = await response.text();
  return uploadedUrl;
};

const uploadNewArtPiece = async (artPiece: uploadArtPieceInput) => {
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  

  // Build the JSON payload
  const body = {
    title: artPiece.title,
    description: artPiece.description,
    artist: artPiece.artist,
    price: artPiece.price,
    year: artPiece.year,
    tags: artPiece.tags,
    userId,
    url: artPiece.url
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_ADD_ART_PIECE_URL}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)

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

/* front-end

const transferArtPiece = async (
  artPieceId: string,
  options?: {
    token?: string;
    buyerId?: string;
    price?: number;
    metadata?: Record<string, any>;
    notifyOwner?: boolean;
    referralCode?: string;
  }
): Promise<boolean> => {
  const token = options?.token || sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  try {
    // Using artPieceService for the transfer
    const result = await artPieceService.transferOwnership(
      artPieceId,
      token,
      {
        buyerId: options?.buyerId,
        price: options?.price,
        metadata: options?.metadata,
        notifyOwner: options?.notifyOwner !== false, // Defaults to true
        referralCode: options?.referralCode
      }
    );
    
    console.log("Transfer successful:", result);
    return true;
  } catch (error) {
    console.error("Transfer failed for art piece:", artPieceId, error);
    throw error;
  }
};

*/

// const transferArtPiece = async (
//   artPieceId: string,
//   buyerId: string,
//   sellerId: string,
//   subtotal: number,
//   shipping: number,
//   tax: number,
//   total: number,
//   paymentMethod: string,
//   orderDate: string,
//   estimatedDeliveryDate: string
// ): Promise<boolean> => {
//   const token = sessionStorage.getItem("token");
//   if (!token) {
//     throw new Error("No authentication token found. Please log in again.");
//   }

//   const endpoint = process.env.NEXT_PUBLIC_USER_BUYS_ART_PIECE_URL;
//   if (!endpoint) {
//     throw new Error("API endpoint is not configured.");
//   }

//   try {
//     const response = await fetch(endpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ artPieceId }),
//     });

//     if (!response.ok) {
//       let errorMsg = `HTTP ${response.status}`;
//       try {
//         const errorData = await response.json();
//         errorMsg = errorData.error || errorMsg;
//       } catch {
//         // Ignore JSON parse errors
//       }
//       throw new Error(`Transfer failed: ${errorMsg}`);
//     }

//     const result = await response.json();
//     console.log("Transfer successful:", result);
//     return true;
//   } catch (error) {
//     console.error("Transfer failed for art piece:", artPieceId, error);
//     throw error;
//   }
// };

const transferArtPiece = async (
  artPieceId: string,
  token: string,
  options?: {
    buyerId?: string;
    price?: number;
    metadata?: Record<string, any>;
    notifyOwner?: boolean;
    referralCode?: string;
  }
): Promise<boolean> => {
  const url = process.env.NEXT_PUBLIC_USER_BUYS_ART_PIECE_URL;

  if (!url) {
    throw new Error("Transfer URL is not defined in environment variables");
  }

  const body = {
    artPieceId,
    buyerId: options?.buyerId,
    price: options?.price,
    metadata: options?.metadata,
    notifyOwner: options?.notifyOwner !== false, // Defaults to true
    referralCode: options?.referralCode,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Transfer error:", errorText);
    throw new Error(`Failed to transfer art piece: ${response.statusText}`);
  }

  return response.json();
};

const artPieceService = {
  uploadNewArtPiece,
  getAllProducts,
  getProductById,
  getProductsByArtist,
  uploadImageToBlob,
  getProductsToSellByUser,
  addToLikedItems,
  addProductToUsersCart,
  togglePublishArtPiece,
  transferArtPiece,
};

export default artPieceService;
