import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { db, client } from "@/lib/mongodb";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

    database: mongodbAdapter(db, { client }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        requireEmailVerification: false,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account",
        },
    },

    plugins: [
        jwt({
            jwt: {
                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }),
            },
        }),
    ],
});