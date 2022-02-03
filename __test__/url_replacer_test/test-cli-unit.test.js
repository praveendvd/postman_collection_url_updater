const path = require('path'),
  sdk = require('postman-collection'),
  fs = require('fs'),
  { resetAndReimportUrlUpdator, CustomError } = require('./utils/helperMethods.js')

let postman_url_updater,
  mockProcessExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error("exit"); }),
  mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { }),
  mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });

describe('Validate url_updator index.js unit tests', () => {
  describe('Validate cli output messages for non interactive', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    })

    it('Should show help if arguments are missing', async () => {
      resetAndReimportUrlUpdator({ c: undefined, r: undefined, w: undefined, s: undefined, p: undefined, i: undefined });

      expect(() => { require('../../src/indexUrlReplacer.js') }).not.toThrowError()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();

      await expect(async () => { await require('../../src/indexUrlReplacer.js').createNewCollection() }).rejects.toThrowErrorMatchingSnapshot()
      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show help if -c argument is missing', async () => {
      resetAndReimportUrlUpdator({ c: undefined, r: "{{baseURL}}/{{path}}", w: "new_collection.json", s: undefined, p: undefined, i: undefined });

      expect(() => { require('../../src/indexUrlReplacer.js') }).not.toThrowError()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();

      await expect(async () => { await require('../../src/indexUrlReplacer.js').createNewCollection() }).rejects.toThrowErrorMatchingSnapshot()

      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show help if -r argument is missing', async () => {
      resetAndReimportUrlUpdator({ c: "test/collection/collection.json", r: undefined, w: "new_collection.json", s: undefined, p: undefined, i: undefined });

      expect(() => { require('../../src/indexUrlReplacer.js') }).not.toThrowError()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();

      await expect(async () => { await require('../../src/indexUrlReplacer.js').createNewCollection() }).rejects.toThrowErrorMatchingSnapshot()

      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show help if -w argument is missing', async () => {
      resetAndReimportUrlUpdator({ c: "test/collection/collection.json", r: "{{baseURL}}/{{path}}", w: undefined, s: "new_collection.json", p: undefined, i: undefined });

      expect(() => { require('../../src/indexUrlReplacer.js') }).not.toThrowError()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();

      await expect(async () => { await require('../../src/indexUrlReplacer.js').createNewCollection() }).rejects.toThrowErrorMatchingSnapshot()

      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show file not found error if collection doesnt exists', async () => {
      resetAndReimportUrlUpdator({ c: "test/collection/collection.json", r: "{{baseURL}}/{{path}}", w: "{{baseURL}}/{{path}}", s: "new_collection.json", p: undefined, i: undefined });
      postman_url_updater = require('../../src/indexUrlReplacer.js')
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
      jest.clearAllMocks()
      await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot();
      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show file saved message correctly with default path', async () => {
      resetAndReimportUrlUpdator({ c: "__test__/url_replacer_test/collection/collection.json", r: "{{baseURL}}/{{path}}", w: "{{baseURL}}/{{path}}", s: undefined, p: undefined, i: undefined });
      postman_url_updater = require('../../src/indexUrlReplacer.js')
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
      jest.clearAllMocks()
      await postman_url_updater.createNewCollection();
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./__test__/url_replacer_test/collection/new_collection.json')}`);
    });

    it('Should show file saved message correctly with custom path', async () => {
      resetAndReimportUrlUpdator({ c: "__test__/url_replacer_test/collection/collection.json", r: "{{baseURL}}/{{path}}", w: "{{baseURL}}/{{path}}", s: "__test__/url_replacer_test/collection/output/new_collection.json", p: undefined, i: undefined });
      postman_url_updater = require('../../src/indexUrlReplacer.js')
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
      jest.clearAllMocks()
      await postman_url_updater.createNewCollection()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./__test__/url_replacer_test/collection/output/new_collection.json')}`);
    });

    it('Should throw error if exception thrown doesnt contain error code ENOENT', async () => {
      resetAndReimportUrlUpdator({ c: "__test__/url_replacer_test/collection/collection.json", r: "{{baseURL}}/{{path}}", w: "{{baseURL}}/{{path}}", s: "new_collection.json", p: undefined, i: undefined });
      postman_url_updater = require('../../src/indexUrlReplacer.js')
      jest.clearAllMocks()
      mockConsoleLog.mockImplementation(() => { throw new CustomError(256) });
      await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot()
      expect(process.exit).not.toBeCalled()
    });

    it('Should throw invalid collection if a valid collection is not provided', async () => {
      resetAndReimportUrlUpdator({ c: "__test__/url_replacer_test/__snapshots__/test-cli-unit.test.js.snap", r: "{{baseURL}}/{{path}}", w: "{{baseURL}}/{{path}}", s: "new_collection.json", p: undefined, i: undefined });
      postman_url_updater = require('../../src/indexUrlReplacer.js')
      jest.clearAllMocks()
      await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot()
      expect(console.error).toBeCalledWith(`Invalid/corrupted collection provided. Please provide path to valid source collection`);
    });

  })

  describe('Validate cli output messages for interactive', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    })

    it('Should call inquirer if i not provided', async () => {
      let inquirerSpy = resetAndReimportUrlUpdator({ c: "__test__/url_replacer_test/collection/collection.json", r: "{{baseURL}}/{{path}}", w: "{{baseURL}}/{{path}}", s: "__test__/url_replacer_test/collection/output/new_collection.json", p: undefined, i: true });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      expect(inquirerSpy).toHaveBeenCalled()
    });

    it('Should not call inquirer if i not provided', async () => {
      let inquirerSpy = resetAndReimportUrlUpdator({ c: "__test__/url_replacer_test/collection/collection.json", r: "{{baseURL}}/{{path}}", w: "{{baseURL}}/{{path}}", s: "__test__/url_replacer_test/collection/output/new_collection.json", p: undefined, i: false });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      expect(inquirerSpy).not.toHaveBeenCalled()
    });

  })

  describe('Validate collection changes', () => {
    let collectionPath = '__test__/url_replacer_test/collection/collection.json',
      outputCollectionPath = '__test__/url_replacer_test/collection/output/new_unit.json';

    it('validate no changes happens when there is no match', async () => {
      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({ c: collectionPath, r: "https://localhost:23456/api/v1/{{path}}", w: "{{baseURL}}/{{path}}", s: outputCollectionPath, p: undefined, i: undefined });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();
      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
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

      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({ c: collectionPath, r: "https://www.testdomain0.ie", w: "{{baseURL}}/{{path}}", s: outputCollectionPath, p: undefined, i: undefined });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);
      updatedRequestObject(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0], 'n', 1);
      updatedRequestObject(sourceCollection.item[2], 0, 1);

      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
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

      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({ c: collectionPath, r: "www.testdomain0.ie", w: "{{baseURL}}/{{path}}", s: outputCollectionPath, p: undefined, i: undefined });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);
      updatedRequestObject(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0], 'n', 1);
      updatedRequestObject(sourceCollection.item[2], 0, 1);

      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
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

      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({ c: collectionPath, r: "www.testdomain0.ie/testpath/:pathvariable1-1", w: "{{baseURL}}/{{path}}", s: outputCollectionPath, p: undefined, i: undefined });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);

      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
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

      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({ c: collectionPath, r: "/:pathvariable1-1/path/request1-1?query1-1-0", w: "/:pathvariable1-1/path/request1-1?query1-1-0=queryvalue1-1-0-0&test", s: outputCollectionPath, p: undefined, i: undefined });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();

      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);

      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
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

      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({
        c: collectionPath,
        r: "https://www.testdomain0.ie/testpath/:pathvariable1-1/path/request1-1?query1-1-0=queryvalue1-1-0&query1-1-1=queryvalue1-1-1",
        w: "{{protocol}}://{{baseURL}}/v1/{{path}}", s: outputCollectionPath, p: undefined, i: undefined
      });
      await require('../../src/indexUrlReplacer.js').createNewCollection();

      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();

      //expect only first request is modified 
      updatedRequestObject(sourceCollection.item[0].item[0], 1, 1);

      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
    });

    it('validate query parameters are updated using regex if p flag used ', async () => {

      function updatedRequestObject(source) {
        source.request.url.query.unshift({
          "key": "querynew",
          "value": "valuenew",
        })
      }

      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({ c: collectionPath, r: "^(.*?)(?:\\?(.*))?$", w: "$1?querynew=valuenew&$2", s: outputCollectionPath, p: true });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();

      //expect that new query parameter is added as first parameter
      updatedRequestObject(sourceCollection.item[0].item[0]);
      updatedRequestObject(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0]);
      updatedRequestObject(sourceCollection.item[2]);
      updatedRequestObject(sourceCollection.item[3]);
      updatedRequestObject(sourceCollection.item[4]);

      sourceCollection.item[4].request.url.query.push({
        "key": "",
        "value": null,
      })

      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
      expect(outputCollection.item[4].request).toStrictEqual(sourceCollection.item[4].request);
    });

    it('validate regex have no effect if p flag is not used ', async () => {

      const sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(collectionPath).toString())).toJSON();
      resetAndReimportUrlUpdator({ c: collectionPath, r: "^(.*?)(?:\\?(.*))?$", w: "$1?querynew=valuenew&$2", s: outputCollectionPath, p: undefined });
      await require('../../src/indexUrlReplacer.js').createNewCollection();
      const outputCollection = new sdk.Collection(JSON.parse(fs.readFileSync(outputCollectionPath).toString())).toJSON();

      //expect source and output are the same
      expect(outputCollection.item[0].item[0].request).toStrictEqual(sourceCollection.item[0].item[0].request);
      expect(outputCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request)
        .toStrictEqual(sourceCollection.item[1].item[0].item[0].item[0].item[0].item[0].item[0].item[0].request);
      expect(outputCollection.item[2].request).toStrictEqual(sourceCollection.item[2].request);
      expect(outputCollection.item[3].request).toStrictEqual(sourceCollection.item[3].request);
      expect(outputCollection.item[4].request).toStrictEqual(sourceCollection.item[4].request);
    });

  })
})

