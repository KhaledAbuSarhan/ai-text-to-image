import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from "openai";

dotenv.config();



const router = express.Router();

router.route('/').get((req, res) => {
    res.send('Hello from dalle')
});
router.route('/').post(async (req, res) => {
    try {
        const {prompt, apiKey} = req.body;
        const openai = new OpenAI({apiKey: apiKey });
        const aiResponse = await openai.images.generate({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });
        const img = await aiResponse['data'][0]
        res.status(200).json(img)
    } catch(error) {
        console.log(error)
    }
})
export default router;