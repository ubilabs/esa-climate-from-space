const {execSync} = require('child_process');
const https = require('https');

const url = process.env.SLACK_HOOK_URL;
const branchName = process.env.BRANCH_NAME;

const commitMessage = execSync('git log -1 --pretty=%B', {
  encoding: 'utf8'
});
const shortMessage = commitMessage
  .replace(/\*/g, '')
  .split('\n')[0]
  .trim();

const commitHash = execSync('git rev-parse HEAD', {
  encoding: 'utf8'
}).trim();

const visitUrl =
  branchName === 'live'
    ? 'https://cfs.climate.esa.int'
    : `https://storage.googleapis.com/esa-cfs-versions/web/${branchName}/index.html`;

const data = JSON.stringify({
  text: `New deployment to *${branchName}* is ready: *${shortMessage}*\n Visit: <${visitUrl}>\n Commit: <https://github.com/ubilabs/esa-climate-from-space/commit/${commitHash}>`
});

// eslint-disable-next-line no-console
console.log('Message Payload:', data);

const req = https.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(data)
  }
});
req.write(data);
req.end();
