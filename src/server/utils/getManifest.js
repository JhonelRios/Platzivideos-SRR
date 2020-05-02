const path = require('path');
const fs = require('fs');

const getManifest = () => {
    try {
        return JSON.parse(
            fs.readFileSync(
                path.resolve(__dirname, '..', 'public/manifest.json')
            )
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = getManifest;
