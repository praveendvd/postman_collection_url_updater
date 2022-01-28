let sourceCollection;

const YARGS = require('yargs'),
    FS = require('fs-extra'),
    SDK = require('postman-collection'),
    DEFAULTS = {
        replace_url_part: 'all',
        save_as: 'root/new_<collection_name>.json',
    },
    OPTIONS = YARGS
        .usage('Usage: -c "root/collection_name.json" -r "{{Baseurl}}/path1/path2" -w "{{Baseurl}}/{{path}}" -s "root/new_collection_name.json"')
        .option('c', { alias: 'collection_path', describe: 'Path to Collection file', type: 'string', demandOption: true })
        .option('r', { alias: 'replace_url_part', describe: 'Replaces only the matching part of the URL', type: 'string', demandOption: true })
        .option('w', { alias: 'with_url_part', describe: 'Replaces the matching part of the URL with provided value', type: 'string', demandOption: true })
        .option('s', { alias: 'save_as', describe: 'path to save new collection', type: 'string', demandOption: false, default: DEFAULTS.save_as })
        .argv,
    PATH = require('path'),
    COLLECTIONFILE = PATH.parse(OPTIONS.collection_path).base,
    COLLECTIONDIR = PATH.resolve(PATH.parse(OPTIONS.collection_path).dir);


function startConvert() {
    try {
        sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(OPTIONS.collection_path).toString()));
        //forEachItem has all request details irrespective of folder structure
        sourceCollection.forEachItem((requestItem) => {
            //stops path variable from resolving
            let variables_ = requestItem.request.url.variables.all()
            requestItem.request.url.variables.clear()
            let currentURL_ = requestItem.request.url.toString()

            const newURL = urlReplacer(currentURL_, OPTIONS.replace_url_part, OPTIONS.with_url_part)

            //add varaibles back if required and update the collection
            updateCollection(requestItem, variables_, newURL)
        })

        const destination_ = PATH.resolve(OPTIONS.save_as === DEFAULTS.save_as ? `${COLLECTIONDIR}/new_${COLLECTIONFILE}` : OPTIONS.save_as)
        FS.outputFileSync(destination_, JSON.stringify(sourceCollection.toJSON(), null, 2))
        console.log(`File saved to: ${destination_}`)
    } catch (e) {
        if (!(e.errno === -4058)) throw Error(e)
        console.error(e.message)
        process.exit()
    }
}


function urlReplacer(currentUrl, urlToReplace, urlToReplaceWith) {
    return currentUrl.replaceAll(urlToReplace, urlToReplaceWith)
}

function updateCollection(requestItem, variables, newURL) {
    requestItem.request.url.update(newURL)
    const newURLString_ = requestItem.request.url.toString()
    variables.forEach((variableItem, index) => {
        if (!newURLString_.includes(`:${variableItem.key}`)) delete variables[index]
    })
    requestItem.request.url.variables.repopulate(variables)
}

module.exports = {startConvert}