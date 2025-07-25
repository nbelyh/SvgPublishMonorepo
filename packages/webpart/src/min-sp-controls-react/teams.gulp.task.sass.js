const scssTsExtName = '.scss.ts';

const _classMaps = {};

class SassTask {
  name = 'sass';

  taskConfig;

  constructor(taskConfig) {
    this.taskConfig = taskConfig;
  }

  nukeMatch = [
    'src/**/*.scss.ts'
  ];

  executeTask(gulp, completeCallback) {
    const merge = require('merge2');
    const autoprefixer = require('autoprefixer');
    const cssModules = require('postcss-modules');

    const postCSSPlugins = [
      autoprefixer()
    ];
    const modulePostCssPlugins = postCSSPlugins.slice(0);
    modulePostCssPlugins.push(cssModules({
      getJSON: this.generateModuleStub.bind(this),
      generateScopedName: this.generateScopedName.bind(this)
    }));

    const srcPattern = this.taskConfig.sassMatch.slice(0);
    const moduleSrcPattern = srcPattern.map((value) => value.replace('.scss', '.module.scss'));

    if (this.taskConfig.useCSSModules) {
      return this.processFiles(gulp, merge, srcPattern, completeCallback, modulePostCssPlugins);
    } else {
      moduleSrcPattern.forEach((value) => srcPattern.push(`!${value}`));

      return merge(this.processFiles(gulp, merge, srcPattern, completeCallback, postCSSPlugins),
                   this.processFiles(gulp, merge, moduleSrcPattern, completeCallback, modulePostCssPlugins));
    }
  }

  processFiles(gulp, merge, srcPattern, completeCallback, postCSSPlugins) {
    const changed = require('gulp-changed');
    const cleancss = require('gulp-clean-css');
    const clone = require('gulp-clone');
    const path = require('path');
    const postcss = require('gulp-postcss');
    const sass = require('gulp-sass')(require("sass"));
    const texttojs = require('gulp-texttojs');
    const log = require("fancy-log");
    const chalk = require("chalk");

    const tasks = [];

    const baseTask = gulp.src(srcPattern)
      .pipe(changed('src', { extension: scssTsExtName }))
      .pipe(sass.sync({
        importer: (url, prev, done) => ({ file: patchSassUrl(url) })
      }).on('error', function(error) {
        sass.logError.call(this, error);
        completeCallback('Errors found in sass file(s).');
      }))
      .pipe(postcss(postCSSPlugins))
      .pipe(cleancss({
        advanced: false
      }));

    if (this.taskConfig.dropCssFiles) {
      tasks.push(baseTask.pipe(clone())
        .pipe(gulp.dest(this.taskConfig.libFolder)));
    }

    tasks.push(baseTask.pipe(clone())
      .pipe(texttojs({
        ext: scssTsExtName,
        isExtensionAppended: false,
        template: (file) => {
          const content = file.contents.toString('utf8');
          const classNames = _classMaps[file.path];
          let exportClassNames = '';

          if (classNames) {
            const classNamesLines = [
              'const styles = {'
            ];

            const classKeys = Object.keys(classNames);
            classKeys.forEach((key, index) => {
              const value = classNames[key];
              let line = '';
              if (key.indexOf('-') !== -1) {
                log(chalk.red("[Webpack errors]:") + chalk.reset());
                line = `  '${key}': '${value}'`;
              } else {
                line = `  ${key}: '${value}'`;
              }

              if ((index + 1) <= classKeys.length) {
                line += ',';
              }

              classNamesLines.push(line);
            });

            classNamesLines.push('};');
            classNamesLines.push('');
            classNamesLines.push('export default styles;');

            exportClassNames = classNamesLines.join('\n');
          }

          let lines = [];
          if (this.taskConfig.dropCssFiles) {
            lines = [
              `require('${path.basename(file.path, scssTsExtName)}.css');`,
              '',
              exportClassNames,
              ''
            ];
          } else if (!!content) {
            lines = [
              'import { loadStyles } from \'@microsoft/load-themed-styles\';',
              '',
              exportClassNames,
              '',
              `loadStyles(${flipDoubleQuotes(JSON.stringify(content))});`,
              ''
            ];
          }

          return lines.join('\n').replace(/\n\n+/, '\n\n');
        }
      }))
      .pipe(gulp.dest('src')));

    return merge(tasks);
  }

  generateModuleStub(cssFileName, json) {
    cssFileName = cssFileName.replace('.css', '.scss.ts');
    _classMaps[cssFileName] = json;
  }

  generateScopedName(name, fileName, css) {
    const crypto = require('crypto');

    return name + '_' + crypto.createHmac('sha1', fileName).update(name).digest('hex').substring(0, 8);
  }
}

function patchSassUrl(url) {
  if (url[0] === '~') {
    url = 'node_modules/' + url.substr(1);
  } else if (url === 'stdin') {
    url = '';
  }

  return url;
}

function flipDoubleQuotes(str) {
  return str ? (
    str
      .replace(/\\"/g, '`')
      .replace(/'/g, '\\\'')
      .replace(/"/g, `'`)
      .replace(/`/g, '"')
  ) : str;
}

module.exports = SassTask;
