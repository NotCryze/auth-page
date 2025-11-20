import { db } from "../src/db.js"; 
import { ssoProvider } from "../../../packages/db/src/schema.js";

async function main() {
    try {

        await db.insert(ssoProvider).values({
            id: "azure-ad",
            issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/`,
            oidcConfig: JSON.stringify({
                clientId: process.env.AZURE_CLIENT_ID,
                clientSecret: process.env.AZURE_CLIENT_SECRET,
                authorizationEndpoint: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize`,
                tokenEndpoint: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
                jwksEndpoint: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`,
                scopes: ["openid", "email", "profile", "offline_access", "User.Read"],
                pkce: true,
                mapping: { id: "sub", email: "email", name: "name" },
            }),
            providerId: "azure-ad",
            domain: "",
            userId: null
        });

        console.log("Azure AD SSO provider inserted successfully!");
    } catch (err) {
        console.error("Error inserting Azure AD SSO provider:", err);
    }
}

main();
