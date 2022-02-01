const { boolean } = require("yargs");

function validate(answer, message) {
    if (answer.length < 1) {
        return message;
    }
    return true;
}

module.exports = (defaults) => {
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

