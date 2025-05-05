import { z } from "zod";
import axios from "axios";



export const EventThemePackageSchema = z.object({
    id: z.string(),
    packageName: z.string(),
    packagePrice: z.number(),
    description: z.string(),
});

export type ThemePackage = z.infer<typeof EventThemePackageSchema>;

export const EventThemeSchema = z.object({
    id: z.string(),
    eventName: z.string(),
    themeName: z.string(),
    price: z.number(),
    description: z.string(),
    img: z.string(),
    themePackage: z.array(EventThemePackageSchema),
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
    const res = await axios.post("/public/event-theme", data);
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

export async function deleteEventTheme({ themeId, themeName }: { themeId: string; themeName: string }) {
    const res = await axios.delete(`/public/event-theme/${themeId}/${themeName}`);
    return res.data;
}

export const PackageNameData = [
    {
        id: "1",
        name: "Basic",
    },
    {
        id: "2",
        name: "Premium",
    },
    {
        id: "3",
        name: "Luxury",
    },
];