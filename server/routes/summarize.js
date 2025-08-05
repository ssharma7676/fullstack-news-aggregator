const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

const Summary = require('../models/Summary');

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/pszemraj/led-large-book-summary';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const MAX_CHUNK_LENGTH = 3000;

function splitTextIntoChunks(text, maxLength = MAX_CHUNK_LENGTH) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        let end = start + maxLength;

        if (end < text.length) {
            const lastBreak = Math.max(
                text.lastIndexOf('.', end),
                text.lastIndexOf('!', end),
                text.lastIndexOf('?', end)
            );
            if (lastBreak > start) {
                end = lastBreak + 1;
            }
        }

        chunks.push(text.slice(start, end).trim());
        start = end;
    }

    return chunks;
}

// POST /api/summarize
router.post('/', async (req, res) => {
    const { url } = req.body; 
    
    // Check MongoDB for cached summary
    const cached = await Summary.findOne({ url });

    if (cached) {
        console.log('✅ Using cached summary');
        return res.json({ summary: cached.summary });
    }

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        // Fetch article HTML once
        const htmlResponse = await fetch(url);
        const html = await htmlResponse.text();

        // Parse and extract main content text using Readability
        const dom = new JSDOM(html, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (!article || !article.textContent) {
            return res.status(400).json({ error: 'Failed to extract article content' });
        }

        // Split the full article text into manageable chunks
        const chunks = splitTextIntoChunks(article.textContent, 3000);
        const summaries = [];
        
        const promptChunk = `You are a skilled journalist. Summarize the following section of a news article with clarity and depth. Preserve all meaningful details, ensure fluency and proper punctuation. Use complete sentences:\n\n`;

        // Summarize each chunk with prompt
        for (const chunk of chunks) {
            const cleanChunk = chunk.replace(/\s+/g, ' ').trim();

            if (!cleanChunk || cleanChunk.length < 50) {
                continue;
            }

            const response = await fetch(HUGGINGFACE_API_URL, {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: promptChunk + cleanChunk  }),
            });

            const data = await response.json();

            if (data.error) {
                console.error('Error summarizing:', data.error);
                return res.status(500).json({ error: 'Failed to summarize text', details: data.error });
            }

            summaries.push(data[0]?.summary_text || '');
            }

        // Combine all chunk summaries into one string
        const combinedSummary = summaries.join(' ');

        const finalPrompt = `You are an experienced editor. Combine the following section summaries into one fluent, detailed, and cohesive summary of the entire article. Ensure the transitions are smooth and the final result reads like a complete article summary:\n\n${combinedSummary}`;

        const finalResponse = await fetch(HUGGINGFACE_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: finalPrompt }),
        });

        const finalData = await finalResponse.json();

        if (finalData.error) {
            console.error('Error summarizing final summary:', finalData.error);
            return res.status(500).json({ error: 'Failed to summarize final summary', details: finalData.error });
        }

        const finalSummary = finalData[0]?.summary_text || combinedSummary;
        await Summary.create({ url, summary: finalSummary });

        res.json({ summary: finalSummary });
    } catch (err) {
        console.error('Error summarizing:', err);
        res.status(500).json({ error: 'Failed to summarize text' });
    }
});

module.exports = router;