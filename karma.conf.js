require('ts-node').register({
    compilerOptions: {
        module: 'commonjs'
    }
});
require('./karma.conf.ts');

browsers: ['Firefox']
files: ['src/**/*.ts']
listenAddress: '::'