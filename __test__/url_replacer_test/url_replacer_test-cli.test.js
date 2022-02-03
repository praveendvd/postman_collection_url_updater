const { removeID } = require('./utils/helperMethods.js');

const exec = require('shelljs').exec,
  SDK = require('postman-collection'),
  FS = require('fs');

describe('Validate url_updator main.js test', () => {
  describe('Validate cli output messages', () => {
    it('Should show help if arguments are missing', async () => {
      const commandResponse = exec('node "bin/mainUrlUpdater.js"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
    });

    it('Should show help if -c argument is missing', async () => {
      const commandResponse = exec('node "bin/mainUrlUpdater.js" -r "test" -w "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show help if -r argument is missing', async () => {
      const commandResponse = exec('node "bin/mainUrlUpdater.js" -c "test/collection/collection.json" -w "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show help if -w argument is missing', async () => {
      const commandResponse = exec('node "bin/mainUrlUpdater.js" -c "test/collection/collection.json" -r "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show file not found error if collection doesnt exists', async () => {
      const commandResponse = exec('node "bin/mainUrlUpdater.js" -c "test/collection/collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show file saved message correctly with default path', async () => {
      const commandResponse = exec('node "bin/mainUrlUpdater.js" -c "__test__/url_replacer_test/collection/collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}"', { silent: true });
      expect(commandResponse.stderr).toMatch('');
      expect(commandResponse.stdout).toMatch(/File saved to: .*[\\|\/]__test__[\\|\/]url_replacer_test[\\|\/]collection[\\|\/]new_collection.json/g);
    });

    it('Should show file saved message correctly with custom path', async () => {
      const commandResponse = exec('node "bin/mainUrlUpdater.js" -c "__test__/url_replacer_test/collection/collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "__test__/url_replacer_test/collection/output/new.json"', { silent: true });
      expect(commandResponse.stderr).toMatch('');
      expect(commandResponse.stdout).toMatch(/File saved to: .*[\\|\/]__test__[\\|\/]url_replacer_test[\\|\/]collection[\\|\/]output[\\|\/]new\.json/g);
    });
  })

  describe('Validate collection changes', () => {
    let collectionPath = '__test__/url_replacer_test/collection/collection.json',
      outputCollectionPath = '__test__/url_replacer_test/collection/output/new.json';

    it('validate no changes happens when there is no match', async () => {

      const sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString())).toJSON();
      const commandResponse = exec(`node "bin/mainUrlUpdater.js" -c "${collectionPath}" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "${outputCollectionPath}"`, { silent: true });
      const outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString())).toJSON();
      removeID(sourceCollection);
      removeID(outputCollection);
      expect(outputCollection).toStrictEqual(sourceCollection);
    });

    it('validate change happens only for urls other properties remains the same', async () => {

      function updatedRequestObject(source, depthID, postionID) {
        source.request.url.host = ["{{baseURL}}"];
        source.request.url.path = [
          "{{path}}",
          "testpath",
          `:pathvariable${depthID}-${postionID}`,
          "path",
          `request${depthID}-${postionID}`,
        ];
        delete source.request.url.protocol
      }

      const sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString())).toJSON();
      const commandResponse = exec(`node "bin/mainUrlUpdater.js" -c "${collectionPath}" -r "https://www.testdomain0.ie" -w "{{baseURL}}/{{path}}" -s "${outputCollectionPath}"`, { silent: true });
      const outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString())).toJSON();

      removeID(sourceCollection);
      removeID(outputCollection);

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);
      updatedRequestObject(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0], 'n', 1);
      updatedRequestObject(sourceCollection.item[2], 0, 1);

      expect(outputCollection).toStrictEqual(sourceCollection);
    });

    it('validate change protocol is shown if not removed', async () => {

      function updatedRequestObject(source, depthID, postionID) {
        source.request.url.host = ["{{baseURL}}"];
        source.request.url.path = [
          "{{path}}",
          "testpath",
          `:pathvariable${depthID}-${postionID}`,
          "path",
          `request${depthID}-${postionID}`,
        ];
      }

      const sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString())).toJSON();
      const commandResponse = exec(`node "bin/mainUrlUpdater.js" -c "${collectionPath}" -r "www.testdomain0.ie" -w "{{baseURL}}/{{path}}" -s "${outputCollectionPath}"`, { silent: true });
      const outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString())).toJSON();

      removeID(sourceCollection);
      removeID(outputCollection);

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);
      updatedRequestObject(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0], 'n', 1);
      updatedRequestObject(sourceCollection.item[2], 0, 1);

      expect(outputCollection).toStrictEqual(sourceCollection);
    });


    it('validate path varaible is removed if replaced', async () => {

      function updatedRequestObject(source, depthID, postionID) {
        source.request.url.host = ["{{baseURL}}"];
        source.request.url.path = [
          "{{path}}",
          "path",
          `request${depthID}-${postionID}`,
        ];
        source.request.url.variable = []
      }

      const sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString())).toJSON();
      const commandResponse = exec(`node "bin/mainUrlUpdater.js" -c "${collectionPath}" -r "www.testdomain0.ie/testpath/:pathvariable1-1" -w "{{baseURL}}/{{path}}" -s "${outputCollectionPath}"`, { silent: true });
      const outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString())).toJSON();

      removeID(sourceCollection);
      removeID(outputCollection);

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);

      expect(outputCollection).toStrictEqual(sourceCollection);
    });


    it('validate query parameters are updated', async () => {

      function updatedRequestObject(source, depthID, postionID) {
        source.request.url.path = [
          "testpath",
          `:pathvariable${depthID}-${postionID}`,
          "path",
          `request${depthID}-${postionID}`,
        ];
        source.request.url.query = [
          { key: 'query1-1-0', value: 'queryvalue1-1-0-0' },
          { key: 'test', value: 'queryvalue1-1-0' },
          { key: 'query1-1-1', value: 'queryvalue1-1-1' }
        ]

      }

      const sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString())).toJSON();
      const commandResponse = exec(`node "bin/mainUrlUpdater.js" -c "${collectionPath}" -r "/:pathvariable1-1/path/request1-1?query1-1-0" -w "/:pathvariable1-1/path/request1-1?query1-1-0=queryvalue1-1-0-0&test" -s "${outputCollectionPath}"`, { silent: true });
      const outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString())).toJSON();
      
      removeID(sourceCollection);
      removeID(outputCollection);

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);

      expect(outputCollection).toStrictEqual(sourceCollection);
    });


    it('validate query and path variables are removed if replaced completely', async () => {

      function updatedRequestObject(source, depthID, postionID) {
        source.request.url.path = [
          'v1',
          '{{path}}'
        ];
        source.request.url.variable = [];
        source.request.url.query = [];
        source.request.url.host = ["{{baseURL}}"];
        source.request.url.protocol = "{{protocol}}";

      }

      const sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString())).toJSON();
      const commandResponse = exec(`node "bin/mainUrlUpdater.js" -c "${collectionPath}" -r "https://www.testdomain0.ie/testpath/:pathvariable1-1/path/request1-1?query1-1-0=queryvalue1-1-0&query1-1-1=queryvalue1-1-1" -w "{{protocol}}://{{baseURL}}/v1/{{path}}" -s "${outputCollectionPath}"`, { silent: true });
      const outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString())).toJSON();

      removeID(sourceCollection);
      removeID(outputCollection);

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);

      expect(outputCollection).toStrictEqual(sourceCollection);

    });

  })
})


