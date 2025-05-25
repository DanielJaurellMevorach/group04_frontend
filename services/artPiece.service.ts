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
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_ADD_ART_PIECE_URL}`, {
    method: "POST",
    headers, // No Content-Type!
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
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    console.log("Response from getAllProducts:", response);

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

    console.log("Response from getProductById:", response);

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

const getProductsByArtist = async (name: string, excludeId?: string) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/item/artist/${name}`);

  if (excludeId) {
    url.searchParams.append("exclude", excludeId);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("Response from getProductsByArtist:", response.json());

    return await response.json();
  } catch (error) {
    console.error("Error fetching products by artist:", error);
    throw new Error("Failed to fetch products by artist");
  }
};

const artPieceService = {
  uploadNewArtPiece,
  getAllProducts,
  getProductById,
  getProductsByArtist,
};

export default artPieceService;
