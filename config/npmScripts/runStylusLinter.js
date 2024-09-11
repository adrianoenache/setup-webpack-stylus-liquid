// import dependencies
const fs = require('fs')
const glob = require('glob')
const Linter = require('stlint').Linter
const path = require('path')

// set paths
const stylusSourceFiles = '../../src/assets/styl'
const stylusLintConfig = '../../.stlintrc'

// resolve paths
const stylusSourcePath = `${path.resolve(__dirname, stylusSourceFiles)}`
const lintConfig = fs.readFileSync(`${path.resolve(__dirname, stylusLintConfig)}`, { encoding: 'utf8' })

// configure linter
const dataToLint = new Linter(JSON.parse(lintConfig))

// this will verify all files
glob.sync(stylusSourcePath + '/**/*.styl').reduce((x, targetFile) => {

  dataToLint.lint(targetFile)

})

// this verify if errors exist and call a function to show them if true
if(dataToLint.reporter.errors.length > 0) callLinterErrors(dataToLint)

// this function will print all erros and throw a error message
function callLinterErrors(data) {

  for(let i = 0; i < data.reporter.errors.length; i++) {

    const getError =  data.reporter.errors[i].message[0]

    console.error(`${getError.path} \n Line = ${getError.line}   | Rule: ${getError.rule}  | Description: ${getError.descr} \n\n`)

  }

  throw new Error(`Fix the ${data.reporter.errors.length} lint issues!`)

}
