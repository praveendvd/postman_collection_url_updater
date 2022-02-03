const path = require('path'),
  sdk = require('postman-collection'),
  fs = require('fs-extra'),
  { resetAndReimportUrlUpdator, CustomError, removeID } = require('./utils/helperMethods.js');


let postman_url_updater, mockProcessExit, mockConsoleLog, mockConsoleError;

describe('Validate collection_aggregator index.js unit tests', () => {
  describe('Validate cli output messages for non interactive', () => {
    beforeAll(() => {
      mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((error) => {
        console.info('process.exit called with error:', error);
        throw new Error("exit");
      }),
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation((log) => { console.info('console.log called with:', log); }),
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation((error) => { console.info('console.error called with:', error); });
    })
    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    })

    it('Should show help if arguments are missing', async () => {
      resetAndReimportUrlUpdator({ n: undefined, l: undefined, d: undefined, s: undefined, i: undefined });

      expect(() => { require('../../src/indexAggregator.js') }).not.toThrowError()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();

      await expect(async () => { await require('../../src/indexAggregator.js').createNewCollection() }).rejects.toThrowErrorMatchingSnapshot()
      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show help if -n argument is missing', async () => {
      resetAndReimportUrlUpdator({ n: undefined, l: "undefined", d: "undefined", s: undefined, i: undefined });

      expect(() => { require('../../src/indexAggregator.js') }).not.toThrowError()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();

      await expect(async () => { await require('../../src/indexAggregator.js').createNewCollection() }).rejects.toThrowErrorMatchingSnapshot()

      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show help if -l and -d argument is missing', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: undefined, d: undefined, s: undefined, i: undefined });

      expect(() => { require('../../src/indexAggregator.js') }).not.toThrowError()
      expect(mockProcessExit).not.toBeCalled();
      expect(mockConsoleError).not.toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();

      await expect(async () => { await require('../../src/indexAggregator.js').createNewCollection() }).rejects.toThrowErrorMatchingSnapshot()

      expect(mockProcessExit).toBeCalled();
      expect(mockConsoleError).toBeCalled();
      expect(mockProcessExit).toMatchSnapshot();
      expect(mockConsoleError).toMatchSnapshot();
      expect(mockConsoleLog).not.toBeCalled();
      expect(mockConsoleLog).toMatchSnapshot();
    });

    it('Should show file/folder not found error if collection directory doesnt exists', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: undefined, d: '__test__/collection_aggregator_test/collections', s: undefined, i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
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

    it('Should show file/folder not found error if collection list file doesnt exists', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: '__test__/collection_aggregator_test/collection/collection.json __test__/collection_aggregator_test/collection/collections.json', d: undefined, s: undefined, i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
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

    it('Should show file saved message correctly with default path for -l', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection.json"', d: undefined, s: undefined, i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
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
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./new.collection.json')}`);
    });

    it('Should show file saved message correctly with default path for -d', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: undefined, d: "__test__/collection_aggregator_test/collection", s: undefined, i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
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
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./new.collection.json')}`);
    });

    it('Should show file saved message correctly with default name and path if n not provided', async () => {
      resetAndReimportUrlUpdator({ n: undefined, l: undefined, d: "__test__/collection_aggregator_test/collection", s: undefined, i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
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
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./Aggregated_collection.collection.json')}`);
    });

    it('Should show file saved message correctly with default path for -d', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: undefined, d: "__test__/collection_aggregator_test/collection", s: undefined, i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
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
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./new.collection.json')}`);
    });

    it('Should show file saved message correctly with custom path -1', async () => {
      resetAndReimportUrlUpdator({
        n: "new",
        l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection.json"',
        d: undefined,
        s: '__test__/collection_aggregator_test/collection/output/test_collection.json',
        i: undefined
      });
      postman_url_updater = require('../../src/indexAggregator.js')
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
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./__test__/collection_aggregator_test/collection/output/test_collection.json')}`);
    });

    it('Should show file saved message correctly with custom path -d', async () => {
      resetAndReimportUrlUpdator({
        n: "new",
        l: undefined, d: "__test__/collection_aggregator_test/collection",
        s: "__test__/collection_aggregator_test/collection/output/new_collection.json",
        i: undefined
      });
      postman_url_updater = require('../../src/indexAggregator.js')
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
      expect(mockConsoleLog).toBeCalledWith(`File saved to: ${path.resolve('./__test__/collection_aggregator_test/collection/output/new_collection.json')}`);
    });

    it('Should throw error if exception thrown doesnt contain error code ENOENT', async () => {
      resetAndReimportUrlUpdator({
        n: "new",
        l: undefined, d: "__test__/collection_aggregator_test/collection",
        s: "__test__/collection_aggregator_test/collection/output/new_collection.json",
        i: undefined
      });
      postman_url_updater = require('../../src/indexAggregator.js')
      jest.clearAllMocks()
      mockConsoleLog.mockImplementationOnce(() => { throw new CustomError(256) });
      await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot()
      expect(process.exit).not.toBeCalled()
    });

    it('Should throw invalid collection if a valid collection is not provided in -l', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/__snapshots__/collection_aggregator_test-cli-unit.test.js.snap"', d: undefined, s: 'output/new_collection.json', i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
      jest.clearAllMocks()
      await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot()
      expect(console.error).toBeCalledWith(`Invalid/corrupted collection provided. Please provide path to valid source collection`);
    });


    it('Should throw invalid collection if a valid collection directory is not provided', async () => {
      resetAndReimportUrlUpdator({ n: "new", l: undefined, d: "__test__/collection_aggregator_test/collection/collection.json", s: 'output/new_collection.json', i: undefined });
      postman_url_updater = require('../../src/indexAggregator.js')
      jest.clearAllMocks()
      await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot()
      expect(console.error).toBeCalledWith(`ENOTDIR: not a directory, scandir '__test__/collection_aggregator_test/collection/collection.json'`);
    });

    it('Should show -d will be used if both -d and -l provided', async () => {
      resetAndReimportUrlUpdator({
        n: "new",
        l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection.json"',
        d: "__test__/collection_aggregator_test/collection",
        s: undefined,
        i: undefined
      });

      let fsDirReaderMock = jest.mock('fs-extra', () => ({
        ...jest.requireActual('fs-extra'),
        readdirSync: jest.fn(function () { return ['collection.json'] })
      })).requireMock('fs-extra').readdirSync;

      postman_url_updater = require('../../src/indexAggregator.js')
      jest.clearAllMocks()
      await postman_url_updater.createNewCollection()
      //await expect(postman_url_updater.createNewCollection).rejects.toThrowErrorMatchingSnapshot()
      expect(fsDirReaderMock).toBeCalledWith('__test__/collection_aggregator_test/collection');
      expect(mockConsoleLog).toHaveBeenNthCalledWith(1, `[Warning] Both -d and -l was provided. Will be using Using -d`);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(2, `File saved to: ${path.resolve('./new.collection.json')}`);

      fsDirReaderMock.mockRestore();
    });
  })

  describe('Validate cli output messages for interactive', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    })

    it('Should call inquirer if i provided', async () => {
      let inquirerSpy = resetAndReimportUrlUpdator({ n: "new", l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection.json', d: undefined, s: 'output/new_collection.json', i: true });
      await require('../../src/indexAggregator.js').createNewCollection();
      expect(inquirerSpy).toHaveBeenCalled()
    });

    it('Should not call inquirer if i not provided', async () => {
      let inquirerSpy = resetAndReimportUrlUpdator({ n: "new", l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection.json"', d: undefined, s: 'output/new_collection.json', i: undefined });
      await require('../../src/indexAggregator.js').createNewCollection();
      expect(inquirerSpy).not.toHaveBeenCalled()
    });

    it('Should not show -d will be used message if -i is used with -d and -l', async () => {
      resetAndReimportUrlUpdator({
        n: "new",
        l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection.json"',
        d: "__test__/collection_aggregator_test/collection",
        s: 'output/new_collection.json',
        i: true
      });

      let fsDirReaderMock = jest.mock('fs-extra', () => ({
        ...jest.requireActual('fs-extra'),
        readdirSync: jest.fn(function () { return ['collection.json'] })
      })).requireMock('fs-extra').readdirSync;

      mockConsoleLog = jest.spyOn(console, 'log').mockImplementationOnce((log) => { console.info('console.log called with:', log); }),
     
      postman_url_updater = require('../../src/indexAggregator.js')
     
      jest.clearAllMocks()
      await postman_url_updater.createNewCollection()
     
      expect(fsDirReaderMock).toBeCalledWith('__test__/collection_aggregator_test/collection');
      expect(mockConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockConsoleLog).toHaveBeenNthCalledWith(1, `File saved to: ${path.resolve('output/new_collection.json')}`);

      fsDirReaderMock.mockRestore();
    });
  })

  describe('Validate collection creation', () => {

    it('validate collection aggregated without modifiying source content ', async () => {

      let inquirerSpy = resetAndReimportUrlUpdator({
        n: "new",
        l: '"__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection_2.json"',
        d: undefined,
        s: 'output/new_collection.json',
        i: undefined
      });

      await require('../../src/indexAggregator.js').createNewCollection();

      const aggregatedCollection = new sdk.Collection(JSON.parse(fs.readFileSync('output/new_collection.json').toString())).toJSON();
      const sourceCollection1 = new sdk.Collection(JSON.parse(fs.readFileSync('__test__/collection_aggregator_test/collection/collection.json').toString())).toJSON();
      const sourceCollection2 = new sdk.Collection(JSON.parse(fs.readFileSync('__test__/collection_aggregator_test/collection/collection_2.json').toString())).toJSON();

      removeID(sourceCollection1);
      removeID(sourceCollection2);
      removeID(aggregatedCollection);

      //expect source and output have same collection level settings
      expect(aggregatedCollection.item[0].item).toStrictEqual(sourceCollection1.item);
      expect(aggregatedCollection.item[1].item).toStrictEqual(sourceCollection2.item);
      expect(aggregatedCollection.item[0].event).toStrictEqual(sourceCollection1.event);
      expect(aggregatedCollection.item[1].event).toStrictEqual(sourceCollection2.event);
      expect(aggregatedCollection.item[0].name).toStrictEqual(sourceCollection1.info.name);
      expect(aggregatedCollection.item[1].name).toStrictEqual(sourceCollection2.info.name);
      expect(aggregatedCollection.item[0].varible).toBeUndefined();
      expect(aggregatedCollection.item[1].variable).toBeUndefined();
    });

  })
})

