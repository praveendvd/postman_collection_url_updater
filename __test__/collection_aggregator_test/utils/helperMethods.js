function resetAndReimportUrlUpdator({ n, l, d, s, i }) {
    jest.resetModules()

    let { n: mockn, l: mockl, d: mockd, s: mocks, i: mocki } = { n, l, d, s, i },
        mocklArr = [];

    while (process.argv.length > 2) {
        process.argv.pop();
    }

    if (n) process.argv.push('-n', n);
    if (l) {
        let regEx = /"(?<path>.*?)"/g,
            matches;
        do {
            matches = regEx.exec(l)
            matches && matches.groups
                && matches.groups.path
                && process.argv.push('-l', matches.groups.path)
                && mocklArr.push(matches.groups.path)
        } while (matches)
    }

    if (d) process.argv.push('-d', d);
    if (s) process.argv.push('-s', s);
    if (i) process.argv.push('-i', i);

    return jest.mock('inquirer').requireMock('inquirer').prompt = jest.fn(async function () { return { new_collection_name: mockn, collection_list: mocklArr, collection_directory: mockd, save_as: mocks, interactive: mocki } });
}


class CustomError extends Error {
    constructor(errno) {
        super();
        this.errno = errno;
        this.message = 'Custom error';
    }
};


function removeID(obj) {
    for (prop in obj) {
        if (prop === 'id' || prop === '_id')
            delete obj[prop];
        else if (typeof obj[prop] === 'object')
            removeID(obj[prop]);
    }
}

module.exports = { resetAndReimportUrlUpdator, CustomError, removeID };