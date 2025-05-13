import axios from "axios";

export async function createSupplier(data: any) {
    const res = await axios.post("/supplier/create", data);
    return res.data;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
    try {
        const encodedEmail = encodeURIComponent(email);
        const res = await axios.get<boolean>(`/supplier/checkEmail/${encodedEmail}`);
        return res.data;
    } catch (error) {
        console.error('Error checking email availability:', error);
        throw error; // or return a default value if appropriate
    }
}

export async function fetchAllSuplierProducts() {
    const res = await axios.get(`/supplier/get-products`);
    console.log('Full API response:', res.data);
    return res.data;
}
export async function updateSupplier(email: string, data: any) {
    const res = await axios.put(`/supplier/update-supplier/${email}`, data);
    return res.data;
}
  
export async function deleteSupplier(email: string) {
    const res = await axios.delete(`/supplier/delete-supplier/${email}`);
    return res.data;
}

export async function getSupplierProducts(email: string) {
    const res = await axios.get(`/supplier/products/${email}`);
    return res.data;
}

export async function getSupplier(email: string) {
    const res = await axios.get(`/supplier/get-supplier/${email}`);
    return res.data;
}
