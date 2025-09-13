import express from "express";
import { createServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";

const app = express();
const http = createServer(app);

// Proxy WebSocket requests
app.use(
  "/socket",
  createProxyMiddleware({
    target: "wss://webminer.moneroocean.stream/",
    changeOrigin: true,
    ws: true,
    logLevel: "debug",
  })
);

// Serve frontend (dist folder from Vite)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Fallback para sa single-page app (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
