var shell = require('shelljs');

const consoleColor = {
  fgCyan: "\x1b[36m",
  fgGreen: "\x1b[32m",
  reset: "\x1b[0m"
};

var runCommandInDirs = (command, dirs) => {
  var startDir = shell.pwd().toString();

  dirs.forEach((dir) => {
    shell.cd(dir);

    console.log('\n', consoleColor.fgCyan, `running '${command}' in ${dir}`, consoleColor.reset);
    var commandProcess = shell.exec(command);
    if (commandProcess.code !== 0) {
      shell.exit(1);
    }

    shell.cd(startDir);
  });
}

var runCommandInDirsAsync = (command, dirs) => {
  var startDir = shell.pwd().toString();

  dirs.forEach((dir) => {
    shell.cd(dir);

    console.log('\n', consoleColor.fgCyan, `running async '${command}' in ${dir}`, consoleColor.reset);
    var commandProcess = shell.exec(command, {async: true});

    shell.cd(startDir);
  });
}

var getDirsContainingFile = (filename, exclusions = []) => {
  console.log(consoleColor.fgCyan, `searching for ${filename}...`, consoleColor.reset);

  var find = shell.exec(`find ./ -name '${filename}'`, { silent: true });
  if (find.code !== 0) {
    find = shell.exec(`dir ${filename} /b/s`, { silent: true });
  }

  var dirs =
    find.stdout
      .split(/\r\n?|\n/)
      .filter(dir => dir);
  if(exclusions.length > 0) {
    dirs = dirs.filter(dir => !new RegExp(exclusions.join("|")).test(`/${dir}/`))
  }
  dirs = dirs.map(file => file.replace(filename, ''));     

  console.log(consoleColor.fgCyan, `${filename} found in: `);
  console.log(consoleColor.fgGreen);
  dirs.forEach(dir => console.log(dir));
  console.log(consoleColor.reset);

  return dirs;
}

module.exports = {
  runCommandInDirs: runCommandInDirs,
  runCommandInDirsAsync: runCommandInDirsAsync,
  getDirsContainingFile: getDirsContainingFile
}
