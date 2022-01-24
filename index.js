#! /usr/bin/env node
let sourceCollection;

const YARGS = require('YARGS'),
    FS = require('fs'),
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

try {
    sourceCollection = new SDK.Collection(JSON.parse(FS.readFileSync(OPTIONS.collection_path).toString()));
    //forEachItem has all request details irrespective of folder structure
    sourceCollection.forEachItem((requestItem) => {
        let currentURL_ = requestItem.request.url.toString()
        const newURL = urlReplacer(currentURL_, OPTIONS.replace_url_part, OPTIONS.with_url_part)
        requestItem.request.url.update(newURL)
    })

    const destination_ = OPTIONS.save_as === DEFAULTS.save_as ? `${COLLECTIONDIR}/new_${COLLECTIONFILE}` : OPTIONS.save_as
    FS.writeFileSync(destination_, JSON.stringify(sourceCollection.toJSON(), null, 2))
} catch (e) {
     if(!e.errno === 4058) throw Error(e)
     console.log(e.message) 
}

function urlReplacer(currentUrl, urlToReplace, urlToReplaceWith) {
    return currentUrl.replaceAll(urlToReplace, urlToReplaceWith)
}
