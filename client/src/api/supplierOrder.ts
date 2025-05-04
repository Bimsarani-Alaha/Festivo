import axios from "axios";

// Existing functions and data
export async function sendOrderToSupplier(data: any) {
    const res = await axios.post("/public/supplierOrder", data);
    return res.data;
}

export const supplierCategoryData = [
    { id: "1", name: "Decoration And Balloon" },
    { id: "2", name: "Photography" },
    { id: "3", name: "Furniture And Seating" },
    { id: "4", name: "Floral Decoration" }
];

// New function to get all supplier orders
export async function getAllSupplierOrders(): Promise<SupplierOrder[]> {
    const res = await axios.get("/public/supplierOrder/get-all");
    return res.data;
}

// Add these functions to your existing API file
export async function acceptSupplierOrder(orderId: string): Promise<SupplierOrder> {
    const res = await axios.put(`/public/supplierOrder/${orderId}/accept`);
    return res.data;
}

export async function rejectSupplierOrder(orderId: string): Promise<SupplierOrder> {
    const res = await axios.put(`/public/supplierOrder/${orderId}/reject`);
    return res.data;
}

// Type definition for the supplier order
export interface SupplierOrder {
    id: string;
    eventName: string;
    eventPackage: string;
    eventTheme: string;
    eventType: string;
    noOfGuest: number;
    specialRequest: string;
    eventDate: string;
    eventId: string | null;
    supplierCategory: string;
    status: string;
}