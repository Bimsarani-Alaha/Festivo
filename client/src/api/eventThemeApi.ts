import { z } from "zod";
import axios from "axios";
import { Description } from "@mui/icons-material";

export const EventThemeSchema = z.object({
    id: z.string(),
    eventName: z.string(),
    themeName: z.string(),
    price: z.number(),
    description: z.string(),
    img: z.number(),
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