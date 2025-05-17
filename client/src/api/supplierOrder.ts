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

export async function getAcceptedSupplierOrders(): Promise<SupplierOrder[]> {
    const res = await axios.get("/public/supplierOrder/get-accepted");
    return res.data;
}

// Accept a supplier order
export async function acceptSupplierOrder(orderId: string, acceptedSupplier: string, amount: string): Promise<SupplierOrder> {
    const res = await axios.put(`/public/supplierOrder/status/${orderId}`, {
        status: 'ACCEPTED',
        acceptedSupplier,
        amount
    });
    return res.data;
}

// Reject a supplier order
export async function rejectSupplierOrder(orderId: string): Promise<SupplierOrder> {
    const res = await axios.put(`/public/supplierOrder/status/${orderId}`, {
        status: 'REJECTED'
    });
    return res.data;
}

// Interface for Supplier Order
export interface SupplierOrder {
    id: string;
    eventName: string;
    eventPackage: string;
    eventTheme: string;
    eventType: string;
    noOfGuest: number;
    specialRequest: string;
    eventDate: Date | string;
    eventId: string | null;
    supplierCategory: string;
    status: 'ACCEPTED' | 'REJECTED' | 'ONGOING' | 'accept' | 'reject'; // Added possible status values from the example
    supplierEmail: string;
    amount: string;
}