let sourceCollection;

const yargs = require('yargs'),
    fs = require('fs-extra'),
    sdk = require('postman-collection'),
    inquirer = require('inquirer'),
    path = require('path'),
    chalk = require('chalk'),
    DEFAULTS = {
        replace_url_part: 'all',
        save_as: '<collectionDirectory>/new_<collectionName>.json',
        use_regex_pattern: false
    },
    URL_REPLACER_QUESTIONS = require('./helper/constant').urlReplacerQuestionaire(DEFAULTS);

let OPTIONS = yargs
    .usage('\nUsage: -c "root/collection_name.json" -r "{{Baseurl}}/path1/path2" -w "{{Baseurl}}/{{path}}" -s "root/new_collection_name.json"')
    .usage('\nor\n\nUsage: -i')
    .strict()
    .option('i', { alias: 'interactive', describe: 'Pass -i to enter Interactive mode', type: 'boolean', default: false })
    .option('c', { alias: 'collection_path', describe: 'Path to Collection file', type: 'string' })
    .option('r', { alias: 'replace_url_part', describe: 'Replaces only the matching part of the URL', type: 'string' })
    .option('w', { alias: 'with_url_part', describe: 'Replaces the matching part of the URL with provided value', type: 'string' })
    .option('s', { alias: 'save_as', describe: 'path to save new collection', type: 'string', default: DEFAULTS.save_as })
    .option('p', { alias: 'use_regex_pattern', describe: 'Flag to enable matching url using regex', demandOption: false, default: DEFAULTS.use_regex_pattern, type: "boolean" })

if (!OPTIONS.parse().i) {
    OPTIONS.demandOption(['c', 'r', 'w'])
}

async function startConvert() {

    OPTIONS = OPTIONS.argv.i ? await inquirer.prompt(URL_REPLACER_QUESTIONS) : OPTIONS.argv;

    const COLLECTIONFILE = path.parse(OPTIONS.collection_path).base,
        COLLECTIONDIR = path.resolve(path.parse(OPTIONS.collection_path).dir),
        DESTINATIONPATH = path.resolve(OPTIONS.save_as === DEFAULTS.save_as ? `${COLLECTIONDIR}/new_${COLLECTIONFILE}` : OPTIONS.save_as);
    try {
        sourceCollection = new sdk.Collection(JSON.parse(fs.readFileSync(OPTIONS.collection_path).toString()));
        //forEachItem has all request details irrespective of folder structure
        sourceCollection.forEachItem((requestItem) => {
            //stops path variable from resolving
            let variables_ = requestItem.request.url.variables.all()
            requestItem.request.url.variables.clear()
            let currentURL_ = requestItem.request.url.toString()

            const newURL = urlReplacer(currentURL_, OPTIONS.replace_url_part, OPTIONS.with_url_part, OPTIONS.use_regex_pattern)

            //add varaibles back if required and update the collection
            updateCollection(requestItem, variables_, newURL)
        })
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

function urlReplacer(currentUrl, urlToReplace, urlToReplaceWith, usePattern) {
    return currentUrl.replaceAll(usePattern ? new RegExp(urlToReplace, 'g') : urlToReplace,
        urlToReplaceWith)
}

function updateCollection(requestItem, variables, newURL) {
    requestItem.request.url.update(newURL)
    const newURLString_ = requestItem.request.url.toString()
    variables.forEach((variableItem, index) => {
        if (!newURLString_.includes(`:${variableItem.key}`)) delete variables[index]
    })
    requestItem.request.url.variables.repopulate(variables)
}

module.exports = { createNewCollection: startConvert }