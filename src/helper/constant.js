const { boolean } = require("yargs");

function validate(answer, message) {
    if (answer.length < 1) {
        return message;
    }
    return true;
}

exports.urlReplacerQuestionaire = (defaults) => {
    let questions = [
        {
            name: 'collection_path',
            message: 'Please provided the path to source Collection file (.json)',
            type: 'string',
            suffix: " [Example: root/collection_name.json]",
            validate: (answer) => validate(answer, "Please provided the path to source Collection file (.json)")
        },
        {
            name: 'use_regex_pattern',
            message: 'Are you using regex pattern for matching url part',
            type: 'list',
            default: defaults.use_regex_pattern,
            choices: ['true', 'false'],
            filter: (answer) => JSON.parse(answer)
        
        },
        {
            name: 'replace_url_part',
            message: 'Please provided the url part to replace (Replaces the provided string part)',
            type: 'string',
            suffix: " [Example: www.test.com/path1/path2]",
            validate: (answer) => validate(answer, "Please provide a string to replace"),
        },
        {
            name: 'with_url_part',
            message: 'Please provide the replacement string (Replaces the previous string with this)',
            type: 'string',
            suffix: " [Example: {{baseURL}}/{{path}}]",
            validate: (answer) => validate(answer, "Please provide a replacement string")
        },
        {
            name: 'save_as',
            message: 'Please provide a custom path to save the new output collection',
            type: 'string',
            default: defaults.save_as,
            suffix: " [Example: output/new_collection_name.json]"
        },
    ];

    return questions
};


exports.collectionAggregatorQuestionaire = (defaults) => {
    let questions = [
        {
            name: 'new_collection_name',
            message: 'Please provided the name for new collection',
            type: 'string',
            suffix: " [Example: aggregated_collection]",
            validate: (answer) => validate(answer, "Please provided a name")
        },
        {
            name: 'using_collection_directory',
            message: 'Do you want to provide directory containing all collections or manually provide the path to each collection file',
            type:'list',
            choices: ['Providing directory', 'Manually entring path'],
        
        },
        {
            when    : function ( answers ) {
                return answers.using_collection_directory === 'Manually entring path';
            },
            name: 'collection_list',
            message: 'Provide relative or absolute collection file paths separated by comma',
            suffix: "[Example: test/collection_name1.json,test/collection_name2.json,test/collection name3.json]",
            filter: answer => answer.split(',')
        
        },
        {
            when    : function ( answers ) {
                return answers.using_collection_directory === 'Providing directory';
            },
            name: 'collection_directory',
            message: 'Directory containing all collection files',
            type: 'string',
            suffix: " [Example: www.test.com/path1/path2]",
            validate: (answer) => validate(answer, "Please provide a string to replace"),
        },
        {
            name: 'save_as',
            message: 'Please provide a custom path to save the new output collection',
            type: 'string',
            default: defaults.save_as,
            suffix: " [Example: output/new_collection_name.json]"
        },
    ];
    return questions
};

