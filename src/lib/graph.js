
import { ConfidentialClientApplication } from "@azure/msal-node";
import { Client } from "@microsoft/microsoft-graph-client";

// Singleton instance
let cca = null;

export async function getGraphClient() {
    if (!process.env.AZURE_CLIENT_ID || !process.env.AZURE_TENANT_ID || !process.env.AZURE_CLIENT_SECRET) {
        throw new Error("Azure AD credentials are missing. Check environment variables.");
    }

    if (!cca) {
        const msalConfig = {
            auth: {
                clientId: process.env.AZURE_CLIENT_ID,
                authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
                clientSecret: process.env.AZURE_CLIENT_SECRET,
            },
        };
        cca = new ConfidentialClientApplication(msalConfig);
    }

    const authResponse = await cca.acquireTokenByClientCredential({
        scopes: ["https://graph.microsoft.com/.default"],
    });

    if (!authResponse?.accessToken) {
        throw new Error("Failed to acquire access token from Azure AD");
    }

    const client = Client.init({
        authProvider: (done) => {
            done(null, authResponse.accessToken);
        },
    });

    return client;
}
