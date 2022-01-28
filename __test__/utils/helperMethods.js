function resetAndReimportUrlUpdator({ c, r, w, s, p }) {
    jest.resetModules()
    while (process.argv.length > 3) {
        process.argv.pop();
    }
    if (c) process.argv.push('-c', c);
    if (r) process.argv.push('-r', r);
    if (w) process.argv.push('-w', w);
    if (s) process.argv.push('-s', s);
    if (p) process.argv.push('-p', p);
}


class CustomError extends Error {
    constructor(errno) {
        super();
        this.errno = errno;
        this.message = 'Custom error';
    }
};


module.exports = { resetAndReimportUrlUpdator, CustomError };