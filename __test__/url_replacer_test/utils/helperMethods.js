function resetAndReimportUrlUpdator({ c, r, w, s, i, p }) {
    jest.resetModules()
    let { c: mockc, r: mockr, w: mockw, s: mocks, i: mocki, p: mockp } = { c, r, w, s, i, p }
    while (process.argv.length > 2) {
        process.argv.pop();
    }
    
    if (c) process.argv.push('-c', c);
    if (r) process.argv.push('-r', r);
    if (w) process.argv.push('-w', w);
    if (s) process.argv.push('-s', s);
    if (i) process.argv.push('-i', i);
    if (p) process.argv.push('-i', p);

    return jest.mock('inquirer').requireMock('inquirer').prompt = jest.fn(async function () { return { collection_path: mockc, replace_url_part: mockr, with_url_part: mockw, save_as: mocks, use_regex_pattern:mockp, interactive:mocki } });
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