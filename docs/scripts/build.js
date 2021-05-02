const marked = require('marked')

const minify = require('html-minifier').minify

const fs = require('fs')

const path = require('path')

const pkg = require('../package.json')


const config = {
  pages: Object.keys(pkg.pages).map(key => ({
    name: key,
    path: pkg.pages[key],
  })),
  output: pkg.output,
  template: pkg.template,
}

function saveFile(filePath, content) {
  if (!fs.existsSync(config.output)) {
    fs.mkdirSync(config.output)
  }
  const outputPath = path.join(config.output, filePath)
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }
  fs.writeFileSync(path.join(config.output, filePath), content)
}

function run() {
  console.time('Build Finished')
  config.pages.forEach(page => {
    console.log('Exporting page:', page.name)
    const filenames = fs.readdirSync(page.path)
    const fileContents = []
    filenames.forEach(file => {
      const fileContent = fs.readFileSync(path.join(page.path, file), 'utf-8')
      const markedContent = marked(fileContent)
      fileContents.push(markedContent)
    })
    const template = fs.readFileSync(config.template, 'utf-8')
    const content = template.replace('{render}', fileContents.join(''))
    saveFile(`${page.name}.html`, minify(content, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
    }))
  })
  console.timeEnd('Build Finished')
}

run()