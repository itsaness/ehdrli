import { createAuthClient } from "better-auth/vue"
export const authClient = createAuthClient({
    baseURL: "https://api.dzoin.com" // The base URL of your auth server
})