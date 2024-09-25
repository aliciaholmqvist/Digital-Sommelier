import { Mistral } from '@mistralai/mistralai';

class DigitalSommelier {
    constructor(apiKey) {
        this.client = new Mistral({ apiKey });
    }

    async getRecommendation(dishIngredients, dishDescription) {
        try {
            const chatResponse = await this.client.chat.complete({
                model: 'mistral-tiny',
                messages: [{
                    role: 'user',
                    content: `Recommend a wine for a dish with ${dishIngredients}, described as ${dishDescription}. Reply with: "I recommend {wine type and grape} from {country} because {reason}."`
                }],
            });
            return chatResponse.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching wine recommendation:', error);
            throw new Error('Failed to get wine recommendation');
        }
    }
}

export default DigitalSommelier;
