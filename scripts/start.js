const fs = require('fs')
const path = require('path')
const cp = require('child_process')

/** Packages which should not be build in development */
const buildBlacklist = ['@othrworld/app']

/** Packages which should not be started automatically */
const startBlacklist = []

const packageDirs = fs.readdirSync(path.join(__dirname, '..', 'packages'))
const packagesJsons = packageDirs.map((p) =>
  require(path.join(__dirname, '../packages', p, 'package.json'))
)

let packageObject = packagesJsons
  .filter((p) => !buildBlacklist.includes(p.name))
  .filter((p) => p.scripts && Object.keys(p.scripts).includes('build'))
  .map((p) => ({
    name: p.name,
    dependencies: p.dependencies
      ? Object.keys(p.dependencies).filter((d) => d.startsWith('@othrworld/'))
      : undefined,
  }))
// Remove blacklisted packages for build

/** @type {Array<Array<string>>} */
const buildLevels = []
let rec = 0

// Build an optimal build level tree by running concurrently the packages that are
// at the same level of build hierarchy (first, the packages with no dependency, then
// the packages which depend on them, etc...)
while (packageObject.length) {
  const inCurrentBuildLevel = packageObject.filter(
    (po) =>
      !(po.dependencies && po.dependencies.length) ||
      po.dependencies.every((d) =>
        buildLevels.some((bl) => bl.some((blp) => blp.name === d))
      )
  )

  buildLevels.push(inCurrentBuildLevel)
  packageObject = packageObject.filter(
    (po) => !inCurrentBuildLevel.includes(po)
  )

  rec++
  if (rec > 30) {
    console.error({ buildLevels })
    throw new Error('Too much recursion')
  }
}

// Build concurrently each level of the app
for (let levelIndex in buildLevels) {
  const level = buildLevels[levelIndex]
  console.log('Building packages:', level.map((l) => l.name).join(', '))
  const subCmds = level.map((l) => `"yarn workspace ${l.name} build"`)
  const cmd = `concurrently ${subCmds.join(' ')}`

  cp.execSync(cmd, { stdio: 'inherit' })
}

console.log('Starting all packages')

// Start every package individually
const startSubCmd = packagesJsons
  .filter((p) => p.scripts && p.scripts['start'])
  .filter((p) => !startBlacklist.includes(p.name))
  .map((p) => `"yarn workspace ${p.name} start"`)
  .join(' ')
const startCmd = `concurrently ${startSubCmd}`
cp.execSync(startCmd, { stdio: 'inherit' })

// // Add the first build level: packages with no dependency
// const buildLevel0 = packageObject.filter(
//   (o) => !(o.dependencies && o.dependencies.length)
// )

// // Level 1: packages with only dependencies in level 0
// const buildLevel1 = packageObject.filter(
//   (o) =>
//     o.dependencies &&
//     o.dependencies.length &&
//     o.dependencies.every((d) => buildLevel0.some((b0) => b0.name === d))
// )
