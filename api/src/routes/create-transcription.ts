import { createReadStream } from "node:fs";

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { localAiEnabled, openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
    app.post("/videos/:videoId/transcription", async (req, res) => {
        const paramsSchema = z.object({
            videoId: z.string().uuid(),
        });

        const { videoId } = paramsSchema.parse(req.params);

        const bodySchema = z.object({
            prompt: z.string(),
        });

        const { prompt } = bodySchema.parse(req.body);

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        });

        const audioReadStream = createReadStream(video.path);
        console.log("ceateing taenscripti");
        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: localAiEnabled ? 'ggml-whisper-base.bin' : "whisper-1",
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt,
        });

        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                transcription: response.text
            }
        })

        return response.text;
    });
}