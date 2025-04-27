import { z } from "zod";
import axios from "axios";
import { Description } from "@mui/icons-material";

export const EventThemeSchema = z.object({
    id: z.string(),
    eventName: z.string(),
    themeName: z.string(),
    price: z.number(),
    description: z.string(),
    img: z.string(),
    color: z.string(),
});

export type EventThemeSchema = z.infer<typeof EventThemeSchema>;

export async function fetchAllEventThemes() {
    const res = await axios.get("/public/event-theme");
    return res.data;
}

export async function fetchThemesByEvent(Event: String) {
    const res = await axios.get(`/public/event-theme/${Event}`);
    return res.data;
}

export async function createEventTheme(data: EventThemeSchema) {
    const res = await axios.post("/public/event-theme",data);
    return res.data;
}

export async function updateEventTheme(data: EventThemeSchema) {
    try {
        const res = await axios.put(`/public/event-theme/${data.id}`, data);
        return res.data;  // Response from backend
    } catch (error) {
        console.error("Error updating event theme:", error);
        throw error;  // Or return a specific error message
    }
}

export async function deleteEventTheme(id: String) {
    const res = await axios.delete(`/public/event-theme/${id}`);
    return res.data;
}