import 'dotenv/config';
import { OpenAI } from "openai";

console.log(process.env.OPENAI_API_BASE);
export const openai = new OpenAI({
    // apiKey: process.env.OPENAI_KEY,
    baseURL: process.env.OPENAI_API_BASE + "/v1",

});