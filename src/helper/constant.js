
module.exports = (defaults) => {
    let questions = [
        {
            name: 'collection_path',
            describe: 'Path to Collection file',
            type: 'string'
        },
        {
            name: 'replace_url_part',
            describe: 'Replaces only the matching part of the URL',
            type: 'string'
        },
        {
            name: 'with_url_part',
            describe: 'Replaces the matching part of the URL with provided value',
            type: 'string'
        },
        {
            name: 'save_as',
            describe: 'path to save new collection',
            type: 'string',
            default: defaults.save_as

        },
    ];

    return questions
};

