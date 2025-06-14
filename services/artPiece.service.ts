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
  uploadImageToBlob
};

export default artPieceService;
