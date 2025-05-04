import axios from "axios";

export async function createSupplier(data: any) {
    const res = await axios.post("/supplier/create", data);
    return res.data;
}

export async function checkEmailAvailability(email: string) {
    const res = await axios.get(`/supplier/checkEmail/${email}`);
    console.log('Full API response:', res.data); // Logs `true`
    return res.data; // Instead of `res.data.available`
}

export async function fetchAllSuplierProducts() {
    const res = await axios.get(`/supplier/get-products`);
    console.log('Full API response:', res.data);
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