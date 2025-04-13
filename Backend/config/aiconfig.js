const aiConfig = {
    departmentLabels: {
        'road': ['pothole', 'road', 'street', 'pavement', 'asphalt'],
        'garbage': ['trash', 'waste', 'garbage', 'dump', 'litter'],
        'streetlight': ['light', 'lamp', 'pole', 'streetlight'],
        'water': ['pipe', 'leak', 'drainage', 'water', 'sewage'],
        'park': ['garden', 'playground', 'bench', 'tree', 'grass']
    },
    modelConfig: {
        confidenceThreshold: 0.3,
        imageSize: 224,
        modelUrl: 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
    }
};

module.exports = aiConfig;