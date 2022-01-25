const exec = require('shelljs').exec,
  SDK = require('postman-collection'),
  FS = require('fs');

let collectionPath = '__test__/collection/collection.json',
  outputCollectionPath = '__test__/collection/output/new.json';

sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString())).toJSON();
const commandResponse = exec(`node "index.js" -c "${collectionPath}" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json" -s "${outputCollectionPath}"`, { silent: true });
outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString()));


console.log(sourceCollection);