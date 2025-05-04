import { uploadArtPieceInput } from "./types";


const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/item/create`,
    {
      method: "POST",
      headers, // No Content-Type!
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Upload error:", errorText);
    throw new Error(`Failed to upload art piece: ${response.statusText}`);
  }

  return response.json();
};


const getAllProducts = async () => {
  const token = sessionStorage.getItem("token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/item`,
    {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}` 
    },
    }
  );
  return response;
};

const getProductById = async (id : string) => {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/item/${id}`,
    {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    }
  );
  return response;
};

const getProductsByArtist = async (name: string, excludeId?: string) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/item/artist/${name}`);

  if (excludeId) {
    url.searchParams.append('exclude', excludeId);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return response;
};



const artPieceService = {
  uploadNewArtPiece,
  getAllProducts,
  getProductById,
  getProductsByArtist
};

export default artPieceService;
