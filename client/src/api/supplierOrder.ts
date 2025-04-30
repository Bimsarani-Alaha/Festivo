import axios from "axios";

export async function sendOrderToSupplier(data: any) {
    const res = await axios.post("/public/supplierOrder",data);
    return res.data;
}

export const supplierCategoryData = [
    { id: "1", name: "Decoration And Balloon" },
    { id: "2", name: "Photography" },
    { id: "3", name: "Furniture And Seating" },
    { id: "4", name: "Floral Decoration" }
];
