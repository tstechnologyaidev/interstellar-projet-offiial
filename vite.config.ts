import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        tailwindcss(), 
        viteSingleFile(),
        {
            name: "fs-database-sync",
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (req.method === "POST" && req.url === "/api/save") {
                        let body = "";
                        req.on("data", (chunk) => {
                            body += chunk;
                        });
                        req.on("end", () => {
                            try {
                                const { key, data } = JSON.parse(body);
                                const filePath = path.resolve(__dirname, "src/data", `${key}.json`);
                                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.end(JSON.stringify({ success: true }));
                            } catch (error: any) {
                                res.statusCode = 500;
                                res.setHeader("Content-Type", "application/json");
                                res.end(JSON.stringify({ error: error.message }));
                            }
                        });
                    } else {
                        next();
                    }
                });
            }
        }
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
