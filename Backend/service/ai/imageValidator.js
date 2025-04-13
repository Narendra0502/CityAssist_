const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const config = require('../../config/aiconfig');  // This path should now work

class ImageValidator {
    constructor() {
        this.model = null;
        this.labels = config.departmentLabels;
    }

    async init() {
        if (!this.model) {
            console.log('🔄 Loading AI model...');
            this.model = await tf.loadLayersModel(config.modelConfig.modelUrl);
            console.log('✅ AI model loaded successfully');
        }
    }

    async validateImage(imagePath, department) {
        try {
            await this.init();

            const imageBuffer = await sharp(imagePath)
                .resize(config.modelConfig.imageSize, config.modelConfig.imageSize)
                .toBuffer();

            const tensor = tf.node.decodeImage(imageBuffer, 3)
                .expandDims()
                .toFloat()
                .div(255.0);

            const predictions = await this.model.predict(tensor).data();
            
            const result = this.processResults(predictions, department);
            
            tensor.dispose();
            return result;

        } catch (error) {
            console.error('❌ Error validating image:', error);
            throw error;
        }
    }

    processResults(predictions, department) {
        const relevantLabels = this.labels[department.toLowerCase()] || [];
        let relevanceScore = 0;
        let detectedObjects = [];

        const top5 = Array.from(predictions)
            .map((prob, i) => ({ probability: prob, className: i }))
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 5);

        top5.forEach(pred => {
            detectedObjects.push({
                object: pred.className,
                confidence: (pred.probability * 100).toFixed(2)
            });

            if (relevantLabels.some(label => 
                pred.className.toLowerCase().includes(label))) {
                relevanceScore += pred.probability;
            }
        });

        return {
            isRelevant: relevanceScore > config.modelConfig.confidenceThreshold,
            relevanceScore: (relevanceScore * 100).toFixed(2) + '%',
            detectedObjects,
            department
        };
    }
}

module.exports = new ImageValidator();