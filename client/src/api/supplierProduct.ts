import axios from "axios";

export async function createProduct(data: any) {
  const res = await axios.post("/supplier/create-product", data);
  return res.data;
}

export async function getProduct(email: string) {
  const res = await axios.get(`/supplier/products/${email}`);
  return res.data;
}

export async function updateProduct(id: string, data: any) {
  const res = await axios.put(`/supplier/update-product/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: string) {
  const res = await axios.delete(`/supplier/delete-product/${id}`);
  return res.data;
}