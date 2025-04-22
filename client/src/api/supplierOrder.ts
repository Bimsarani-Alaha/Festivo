import axios from "axios";

export async function sendOrderToSupplier(data: any) {
    const res = await axios.post("/public/supplierOrder",data);
    return res.data;
}