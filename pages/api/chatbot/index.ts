import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '../db';
import * as geminiService from '../../../services/geminiService';
import { ChatMessage } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { messages }: { messages: ChatMessage[] } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: 'Invalid "messages" array in request body.' });
    }

    try {
        const db = getDB();
        const tasks = db.tasks; // Provide all tasks as context for the chatbot

        const aiResponse = await geminiService.getChatbotResponse(messages, tasks);
        
        res.status(200).json({ response: aiResponse });

    } catch (error: any) {
        console.error("Chatbot API Error:", error);
        res.status(500).json({ message: error.message || 'An internal server error occurred.' });
    }
}