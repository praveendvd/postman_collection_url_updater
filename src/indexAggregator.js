let sourceCollection;

const yargs = require('yargs'),
    fs = require('fs-extra'),
    sdk = require('postman-collection'),
    inquirer = require('inquirer'),
    path = require('path'),
    chalk = require('chalk'),
    DEFAULTS = {
        replace_url_part: 'all',
        save_as: 'currentDirectory/<newcollectionName>.collection.json',
        use_regex_pattern: false
    },
    COLLECTION_AGGREGATOR_QUESTIONS = require('./helper/constant').collectionAggregatorQuestionaire(DEFAULTS);


let OPTIONS = yargs
    .usage('\nUsage: -c "root/collection_name.json" -r "{{Baseurl}}/path1/path2" -w "{{Baseurl}}/{{path}}" -s "root/new_collection_name.json"')
    .usage('\nor\n\nUsage: -i')
    .strict()
    .option('i', { alias: 'interactive', describe: 'Pass -i to enter Interactive mode', type: 'boolean', default: false })
    .option('n', { alias: 'new_collection_name', describe: 'Name of the new collection', type: 'string' })
    .option('l', { alias: 'collection_list', describe: 'Pass relative or absolute collection file paths', type: 'array' })
    .option('d', { alias: 'collection_directory', describe: 'Directory containing all collection files', type: 'string' })
    .option('s', { alias: 'save_as', describe: 'path to save new collection', type: 'string', default: DEFAULTS.save_as })
    .example([
        ['$0 -n "new_collection" -l "path/collection1.json" "path/collection1.json" "path/collection1.json"', '- Using collection list'],
        ['$0 -d "./collection_directory"', '- Using collection directory']
    ])
    .check((argv) => {
        if (!(argv.l || argv.d) && !argv.i) throw Error(`Please provide either collection_directory or collection_list
[Missing required property -l or -d]`)
        return true
    });

if (!OPTIONS.parse().i) OPTIONS.demandOption(['n'])

async function startConvert() {
    OPTIONS = OPTIONS.argv.i ? await inquirer.prompt(COLLECTION_AGGREGATOR_QUESTIONS) : OPTIONS.argv;
    console.log(OPTIONS)
    sourceCollection = new sdk.Collection({ "name": OPTIONS.new_collection_name });

    try {
        let collection_list = OPTIONS.collection_list || fs.readdirSync(OPTIONS.collection_directory).filter(file => file.endsWith('.json'));

        collection_list.map(filePath => {
            sourceCollection.items.add(new sdk.ItemGroup(JSON.parse(fs.readFileSync(filePath).toString())))
        })

        DESTINATIONPATH = path.resolve(OPTIONS.save_as === DEFAULTS.save_as ? `${process.cwd()}/${OPTIONS.new_collection_name}.collection.json` : OPTIONS.save_as);
        fs.outputFileSync(DESTINATIONPATH, JSON.stringify(sourceCollection.toJSON(), null, 2))
        console.log(chalk.green('File saved to: ') + chalk.yellowBright(DESTINATIONPATH))
    } catch (e) {
        if (!(e.code === 'ENOENT')
            &&
            !(e.stack && e.stack.includes("at JSON.parse"))) throw Error(e);

        console.error(chalk.red((e.stack && e.stack.includes("at JSON.parse")) ? "Invalid/corrupted collection provided. Please provide path to valid source collection"
            : (e.message)))
        process.exit()
    }
}

module.exports = { createNewCollection: startConvert }

