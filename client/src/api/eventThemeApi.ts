import { z } from "zod";
import axios from "axios";

export const EventThemeSchema = z.object({
    id: z.string(),
    eventName: z.string(),
    themeName: z.string(),
    price: z.number(),
});

export type EventThemeSchema = z.infer<typeof EventThemeSchema>;

export async function fetchAllEventThemes() {
    const res = await axios.get("/public/event-theme");
    return res.data;
}