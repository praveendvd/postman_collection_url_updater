const path = require('path'),
  sdk = require('postman-collection'),
  fs = require('fs-extra'),
  { resetAndReimportUrlUpdator, CustomError, removeID } = require('./utils/helperMethods.js');


let postman_url_updater,
  mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((error) => {
    console.info('process.exit called with error:', error);
    throw new Error("exit");
  }),
  mockConsoleLog = jest.spyOn(console, 'log').mockImplementation((log) => { console.info('console.log called with:', log); }),
  mockConsoleError = jest.spyOn(console, 'error').mockImplementation((error) => { console.info('console.error called with:', error); });

describe('Validate index.js unit tests', () => {
  describe('Validate cli output messages for non interactive', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    })

    it('Should show -d will be used if both -d and -l provided', async () => {
      resetAndReimportUrlUpdator({
        n: "new",
        l: '"__test__\\collection_aggregator_test\\collection\\collection.json" "__test__\\collection_aggregator_test\\collection\\collection.json"',
        d: "__test__\\collection_aggregator_test\\collection",
        s: 'output/new_collection.json',
        i: true
      });
      let fsDirReaderMock = jest.mock('fs-extra', () => ({
        ...jest.requireActual('fs-extra'),
        readdirSync: jest.fn(function () { return ['collection.json'] })
      })).requireMock('fs-extra').readdirSync;

      postman_url_updater = require('../../src/indexAggregator.js')
      jest.clearAllMocks()
      await postman_url_updater.createNewCollection()
      //await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot()
      expect(fsDirReaderMock).toBeCalledWith('__test__\\collection_aggregator_test\\collection');
      expect(mockConsoleLog).not.toBeCalledWith(`[Warning] Both -d and -l was provided. Will be using Using -d`);

      fsDirReaderMock.mockRestore();
    });



  })


})

