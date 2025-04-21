import axios, { AxiosResponse } from "axios";

interface UserData {
    name?: string;
    email: string;
    gender: string;
    password: string;
    age?: number;
}

class UserService {
    private static BASE_URL: string = "http://localhost:8080";

    static async login(email: string, password: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async register(userData: UserData, token?: string): Promise<any> {
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response: AxiosResponse = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsers(token: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(`${UserService.BASE_URL}/admin/allUser`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getYourProfile(token: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(userId: string, token: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(`${UserService.BASE_URL}/admin/getUsers/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(userId: string, token: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(userId: string, userData: UserData, token: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("age");
        localStorage.removeItem("email");
    }

    

    static isAuthenticated(): boolean {
        return !!localStorage.getItem("token");
    }

    static isAdmin(): boolean {
        return localStorage.getItem("role") === "ADMIN";
    }

    static isUser(): boolean {
        return localStorage.getItem("role") === "USER";
    }

    static isSupplier(): boolean {
        return localStorage.getItem("role") === "Supplier";
    }

    static adminOnly(): boolean {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;