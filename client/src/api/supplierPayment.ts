import axios from 'axios';

// Define types for the supplier payment data
export interface SupplierPayment {
  id?: string;
  supplierEmail: string;
  productId: string;
  orderRequestId: string;
  amount: number;
  paymentType: string;
  paymentStatus: string;
  deliveryDate: string | Date;
  paymentDate: string | Date;
}

export interface SupplierPaymentRequest {
  supplierEmail: string;
  productId: string;
  orderRequestId: string;
  amount: number;
  paymentType: string;
  paymentStatus?: string;
  deliveryDate: string | Date;
  paymentDate?: string | Date;
}

// Use environment variable for base URL
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/supplier/supplier-payment`;

const supplierPaymentApi = {
  // Get all supplier payments
  async getAllSupplierPayments(): Promise<SupplierPayment[]> {
    try {
      const response = await axios.get<SupplierPayment[]>(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all supplier payments:', error);
      throw error;
    }
  },

  // Get supplier payments by product ID
  async getPaymentsByProductId(productId: string): Promise<SupplierPayment[]> {
    try {
      const response = await axios.get<SupplierPayment[]>(
        `${API_BASE_URL}/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for product ${productId}:`, error);
      throw error;
    }
  },

  // Get supplier payments by order ID
  async getPaymentsByOrderRequestId(orderRequestId: string): Promise<SupplierPayment[]> {
    try {
      const response = await axios.get<SupplierPayment[]>(
        `${API_BASE_URL}/order/${orderRequestId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for order ${orderRequestId}:`, error);
      throw error;
    }
  },

  // Get supplier payments by email
  async getPaymentsBySupplierEmail(supplierEmail: string): Promise<SupplierPayment[]> {
    try {
      const response = await axios.get<SupplierPayment[]>(
        `${API_BASE_URL}/supplier/${supplierEmail}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for supplier ${supplierEmail}:`, error);
      throw error;
    }
  },

  // Create a new supplier payment
  async createSupplierPayment(
    paymentData: SupplierPaymentRequest
  ): Promise<SupplierPayment> {
    try {
      const response = await axios.post<SupplierPayment>(
        API_BASE_URL,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating supplier payment:', error);
      throw error;
    }
  },

  // Update an existing supplier payment
  async updateSupplierPayment(
    id: string,
    paymentData: SupplierPaymentRequest
  ): Promise<SupplierPayment> {
    try {
      const response = await axios.put<SupplierPayment>(
        `${API_BASE_URL}/${id}`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating payment with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a supplier payment
  async deleteSupplierPayment(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting payment with ID ${id}:`, error);
      throw error;
    }
  }
};

export default supplierPaymentApi;