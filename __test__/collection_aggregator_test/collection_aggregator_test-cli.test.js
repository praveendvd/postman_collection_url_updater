const exec = require('shelljs').exec,
  sdk = require('postman-collection'),
  fs = require('fs-extra'),
  { removeID } = require('./utils/helperMethods.js');

describe('Validate collection_aggregator main.js test', () => {

  describe('Validate cli output messages', () => {

    it('Should show help if arguments are missing', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show error if collection folder is not folder', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -d "__test__/collection_aggregator_test/__snapshots__/collection_aggregator_test-cli-unit.test.js.snap" ', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show error if collection file is not valid', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -l "__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/__snapshots__/collection_aggregator_test-cli-unit.test.js.snap"  ', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show error if collection folder is not found', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -d "__test__/collection_aggregator_test/nonexisting" ', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show error if collection file is non existing', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -l "__test__/collection_aggregator_test/collection/collection5.json" "__test__/collection_aggregator_test/__snapshots__/collection_aggregator_test-cli-unit.test.js.snap"  ', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should not show help if -d argument is provided', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -d "__test__/collection_aggregator_test/collection"', { silent: true });
      expect(commandResponse.stderr).toMatch('');
      expect(commandResponse.stdout).toMatch(/File saved to: .*Aggregated_collection.collection.json/g);
    });

    it('Should not show help if -l argument is provided', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -n "test" -l "__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection_2.json"', { silent: true });
      expect(commandResponse.stderr).toMatch('');
      expect(commandResponse.stdout).toMatch(/File saved to: .*test.collection.json/g);
    });

    it('Should show -d will be accepted if both -l and -d given', async () => {
      const commandResponse = exec('npx postman-collection-aggregator -d "__test__/collection_aggregator_test/collection" -l "__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection_2.json" -s "output/new.json"', { silent: true });
      expect(commandResponse.stderr).toMatch('');
      expect(commandResponse.stdout).toMatch(/\[Warning\] Both -d and -l was provided. Will be using Using -d/g);
      expect(commandResponse.stdout).toMatch(/File saved to: .*[\\|\/]output[\\|\/]new.json/g);
    });

    it('Should save to custom path if -s argument is provided', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -l "__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection_2.json" -s "output/new.json"', { silent: true });
      expect(commandResponse.stderr).toMatch('');
      expect(commandResponse.stdout).toMatch(/File saved to: .*[\\|\/]output[\\|\/]new.json/g);
    });

    it('Should save to custom path if -s argument is provided', async () => {
      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -l "__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection_2.json" -s "output/new.json"', { silent: true });
      expect(commandResponse.stderr).toMatch('');
      expect(commandResponse.stdout).toMatch(/File saved to: .*[\\|\/]output[\\|\/]new.json/g);
    });
  })

  describe('Validate collection creation', () => {

    it('validate collection aggregated without modifiying source content ', async () => {

      const commandResponse = exec('node "./bin/mainCollectionAggregator.js" -n "new" -l "__test__/collection_aggregator_test/collection/collection.json" "__test__/collection_aggregator_test/collection/collection_2.json" -s "output/new_collection.json"', { silent: true });

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
      expect(aggregatedCollection.item[0].auth).toStrictEqual(sourceCollection1.auth);
      expect(aggregatedCollection.item[1].auth).toStrictEqual(sourceCollection2.auth);
      expect(aggregatedCollection.item[0].varible).toBeUndefined();
      expect(aggregatedCollection.item[1].variable).toBeUndefined();

      expect(aggregatedCollection.variable.slice(0, sourceCollection1.variable.length)).toStrictEqual(sourceCollection1.variable);
      expect(aggregatedCollection.variable.slice(sourceCollection1.variable.length, sourceCollection1.variable.length + sourceCollection2.variable.length)).toStrictEqual(sourceCollection2.variable);

    });

  })
})


