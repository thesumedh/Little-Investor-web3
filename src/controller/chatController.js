const { Ollama } = require('ollama');

exports.handleChat = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        
        if (!req.body || !req.body.message) {
            console.log('Bad request: Message is required');
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        const { message } = req.body;
        
        const systemPrompt = `You are a friendly financial advisor for children. 
            Keep answers simple, fun, and educational. Use examples that children can relate to.
            Focus on basic financial literacy concepts.
            Keep responses short - no more than 2.3 sentences.`;

        console.log('Sending request to Ollama');
        const host = process.env.OLLAMA_HOST || 'http://192.168.1.122:11434';
        const ollama = new Ollama({ host: host });
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        console.log('Received response from Ollama:', response);

        res.json({
            success: true,
            message: response.message.content
        });
        console.log('Sent response to client');
    } catch (error) {
        console.error('Chat error:', error);
        
        // Provide a robust kid-friendly fallback instead of failing with a 500 error
        const msgLower = (req.body.message || '').toLowerCase();
        let fallbackMessage = "That's a great question about money! Remember, saving some of your coins today helps you buy bigger things tomorrow.";
        
        if (msgLower.includes('allowance')) {
            fallbackMessage = "An allowance is money your parents give you, often for doing chores. You can save some, spend some, and share some!";
        } else if (msgLower.includes('save') || msgLower.includes('saving')) {
            fallbackMessage = "Saving means putting money away for later! Instead of buying a candy bar today, save your money to buy a cool toy next month.";
        } else if (msgLower.includes('piggy bank') || msgLower.includes('piggy')) {
            fallbackMessage = "A piggy bank is a fun jar or box where you keep your physical coins safe. Watching it get heavier is super exciting!";
        } else if (msgLower.includes('buy') || msgLower.includes('toy')) {
            fallbackMessage = "You can definitely buy toys, but make sure to budget! Try dividing your money: 50% to save and 50% for fun toys.";
        } else if (msgLower.includes('invest') || msgLower.includes('stock')) {
            fallbackMessage = "Investing is like planting a seed. You put money in a business, and as the business grows, your money grows too!";
        } else if (msgLower.includes('money') || msgLower.includes('cash')) {
            fallbackMessage = "Money is a tool we use to trade for things we need and want. We earn it by working and we can save, spend, or donate it!";
        }
        
        res.json({
            success: true,
            message: fallbackMessage,
            isFallback: true
        });
        console.log('Sent fallback response to client');
    }
};