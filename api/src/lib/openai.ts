import 'dotenv/config';
import { OpenAI } from "openai";

export const localAiEnabled = process.env.OPENAI_KEY == "" ? true : false;
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    baseURL: process.env.OPENAI_API_BASE + (localAiEnabled ? "/v1" : ""), 

});