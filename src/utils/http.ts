import axios from "axios";
import { clientEnv } from "./zod-schemas/env/client";

export const http = axios.create({
    baseURL: clientEnv.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});