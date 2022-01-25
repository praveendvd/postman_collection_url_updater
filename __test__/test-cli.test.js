const exec = require('shelljs').exec,
  SDK = require('postman-collection'),
  FS = require('fs');

describe('Validate index.js', () => {
  describe('Validate cli output messages', () => {
    it('Should show help if arguments are missing', async () => {
      const commandResponse = exec('node "index.js"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
    });

    it('Should show help if -c argument is missing', async () => {
      const commandResponse = exec('node "index.js" -c "test/collection/collection.json" -w "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show help if -r argument is missing', async () => {
      const commandResponse = exec('node "index.js" -c "test/collection/collection.json" -w "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show help if -w argument is missing', async () => {
      const commandResponse = exec('node "index.js" -c "test/collection/collection.json" -r "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show file not found error if collection doesnt exists', async () => {
      const commandResponse = exec('node "index.js" -c "test/collection/collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show file saved message correctly with default path', async () => {
      const commandResponse = exec('node "index.js" -c "__test__/collection/collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });

    it('Should show file saved message correctly with custom path', async () => {
      const commandResponse = exec('node "index.js" -c "__test__/collection/collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "__test__/collection/output/new.json"', { silent: true });
      expect(commandResponse.stderr).toMatchSnapshot();
      expect(commandResponse.stdout).toMatchSnapshot();
    });
  })

  describe('Validate collection changes', () => {
    let collectionPath = '__test__/collection/collection.json',
      outputCollectionPath = '__test__/collection/output/new.json';

    it('validate no changes happens when there is no match', async () => {
      sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(collectionPath).toString()));
      const commandResponse = exec(`node "index.js" -c "${collectionPath}" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json" -s "${outputCollectionPath}"`, { silent: true });
      outputCollection = new SDK.Collection(JSON.parse(FS.readFileSync(outputCollectionPath).toString()));
      expect(sourceCollection).toStrictEqual(outputCollection)
    });

  })
})


