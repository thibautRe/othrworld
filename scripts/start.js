const path = require('path')
const cp = require('child_process')

const appPackage = require('../packages/app/package.json')
const appInternalDeps = Object.keys(appPackage.dependencies)
  .filter((n) => n.startsWith('@othrworld/'))
  .map((n) => n.slice('@othrworld/'.length))
  .map((n) => path.join(__dirname, '..', 'packages', n))

// This command builds and watch the direct dependencies from @othrworld/app (but not itself)
cp.execSync(`tsc -b ${appInternalDeps.join(' ')} --watch`, { stdio: 'inherit' })
