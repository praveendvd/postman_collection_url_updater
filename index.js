let sdk = require('postman-collection'),
    fs = require('fs-extra');

try {
    sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync("./postman-collection-url-updater-2.0.2.tgz").toString()));
} catch (error) {
    let e = { code: 'ENOENT', stack: 'at JSON.psarse' };
    if (!(e.code === 'ENOENT')
        &&
        !(e.stack && e.stack.includes("at JSON.parse"))) throw Error("hhh");
    console.error((e.stack && e.stack.includes("at JSON.parse")) ? "hii" : (e.stack))
}


