import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Helper to initialize Gemini safely
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // AI Chatbot endpoint (Syafina Persona)
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { history } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          response: "Maaf, kunci API Gemini belum dikonfigurasi. Saya (Syafina) belum bisa memproses pesan Anda saat ini. Silakan atur kunci API terlebih dahulu di pengaturan.",
        });
      }

      const systemInstruction = `Anda adalah Syafina Alifia Putri, seorang Supervisor Gizi di Badan Gizi Nasional (BGN) RI untuk Satuan Pelayanan Pemenuhan Gizi (SPPG). Anda merupakan lulusan Manajemen Industri Jasa Makanan & Gizi dari IPB University (Agustus 2025). Anda memiliki keahlian di bidang Keamanan Pangan, Audit HACCP, Quality Control (QC), dan Manajemen Operasional Dapur Skala Besar. Anda tersertifikasi sebagai Head Chef / Penjamah Makanan oleh BNSP, mahir menyusun dokumentasi manual ISO 22000:2018, dan menerapkan standar GMP serta SSOP.
Tugas Anda adalah membantu pengguna aplikasi (staf dapur, pengawas, atau manajemen) dalam menjawab pertanyaan terkait gizi, keamanan pangan, HACCP, SOP BGN, dan operasional dapur. Jawablah dengan ramah, profesional, suportif, berdedikasi tinggi, praktis, dan berbasis data. Selalu gunakan persona Syafina saat merespons. Sapa dengan hangat jika ini adalah awal percakapan.`;

      const formattedHistory = history.map((msg: any) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.5,
          tools: [{ googleSearch: {} }],
        },
      });

      return res.json({
        response: response.text,
      });
    } catch (err: any) {
      console.error("Chat API error:", err);
      res.status(500).json({
        error: "Gagal memproses pesan chat",
        message: err.message,
      });
    }
  });

  // AI Video Generation endpoint (Veo 3)
  app.post("/api/ai/generate-video", async (req, res) => {
    try {
      const { prompt } = req.body;
      const ai = getGenAI();
      if (!ai) return res.status(400).json({ error: "Gemini API key not configured" });

      const response = await ai.models.generateContent({
        model: "veo-3.1-fast-generate-preview",
        contents: prompt,
      });

      return res.json(response);
    } catch (err: any) {
      console.error("Video API error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
