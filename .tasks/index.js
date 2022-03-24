const { version } = require('../package.json');

const axios = require('axios');

const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

const NPM_PACKAGE_URL = 'https://registry.npmjs.org/helly/';

// Publish with 'dev' tag
async function publish() {
    const lastCommitHash = await exec('git rev-parse HEAD');
    const lastCommitHashString = lastCommitHash.stdout.trim().slice(0, 7);

    console.log(`Last commit hash: ${lastCommitHashString}`);

    const lastCommitPublished = await wasLastCommitPublished(lastCommitHashString);
    if (lastCommitPublished) {
        console.log('Last commit was already published, exiting...');
        process.exit(0);
    }

    await transpileCode();

    console.log('Deprecating older dev versions...');
    await deprecateOlderDevVersions().catch(() => {});

    console.log('Last commit was not published.');

    // Set version
    console.log(`Setting version to ${version}-dev${lastCommitHashString}`);
    await exec(`cd .. && npm version ${version}-dev${lastCommitHashString} --force --no-git-tag-version --no-commit-hooks`);

    // Publish
    console.log('Publishing...');
    await exec(`cd .. && npm publish --tag dev`);
    console.log('Published!')

    process.exit(0);
}

async function transpileCode() {
    await exec('cd .. && npm i');
    await exec('cd .. && npm run build');
}

async function wasLastCommitPublished(lastHash) {
    const response = await axios.default(NPM_PACKAGE_URL, { method: 'GET' });

    if (response.data.time[`${version}-dev${lastHash}`]) return true;
    return false;
}

// Deprecate older dev versions with old commits
async function deprecateOlderDevVersions() {
    return exec(`cd .. && npm deprecate helly@"~${version}-dev" "no longer supported"`);
}

publish();
