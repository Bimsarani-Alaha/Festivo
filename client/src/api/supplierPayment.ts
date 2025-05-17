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
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/public/supplier/supplier-payment`;

const supplierPaymentApi = {
  /**
   * Get all supplier payments
   * @returns Promise<SupplierPayment[]> - Array of supplier payments
   */
  async getAllSupplierPayments(): Promise<SupplierPayment[]> {
    try {
      const response = await axios.get<SupplierPayment[]>(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all supplier payments:', error);
      throw error;
    }
  },

  /**
   * Get supplier payments by product ID
   * @param productId - The product ID to filter by
   * @returns Promise<SupplierPayment[]> - Array of supplier payments for the product
   */
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

  /**
   * Get supplier payments by order ID
   * @param orderRequestId - The order request ID to filter by
   * @returns Promise<SupplierPayment[]> - Array of supplier payments for the order
   */
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

  /**
   * Get supplier payments by email
   * @param supplierEmail - The supplier email to filter by
   * @returns Promise<SupplierPayment[]> - Array of supplier payments for the supplier
   */
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

  /**
   * Create a new supplier payment
   * @param paymentData - The payment data to create
   * @returns Promise<SupplierPayment> - The created payment
   */
  async createSupplierPayment(
    paymentData: SupplierPaymentRequest
  ): Promise<SupplierPayment> {
    try {
      // Set default values if not provided
      const completePaymentData = {
        ...paymentData,
        paymentStatus: paymentData.paymentStatus || 'PENDING',
        paymentDate: paymentData.paymentDate || new Date().toISOString()
      };

      const response = await axios.post<SupplierPayment>(
        `${API_BASE_URL}/create`,
        completePaymentData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating supplier payment:', error);
      throw error;
    }
  },

  /**
   * Update an existing supplier payment
   * @param id - The ID of the payment to update
   * @param paymentData - The updated payment data
   * @returns Promise<SupplierPayment> - The updated payment
   */
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

  /**
   * Delete a supplier payment
   * @param id - The ID of the payment to delete
   * @returns Promise<void>
   */
  async deleteSupplierPayment(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting payment with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update payment status
   * @param id - The ID of the payment to update
   * @param status - The new status (e.g., 'PAID', 'FAILED')
   * @returns Promise<SupplierPayment> - The updated payment
   */
  async updatePaymentStatus(
    id: string,
    status: string
  ): Promise<SupplierPayment> {
    try {
      const response = await axios.patch<SupplierPayment>(
        `${API_BASE_URL}/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for payment ${id}:`, error);
      throw error;
    }
  }
};

export default supplierPaymentApi;