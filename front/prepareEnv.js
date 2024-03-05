const fs = require('fs'),
  { execSync } = require('child_process');

function deleteDirectory(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(path);
  }
};

function deletePackageLock(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        console.log("You doesn't have package-lock.json. It's okay. Don't worry");
      }
      resolve();
    })
  });
}

console.log("Cleaning working tree...");

deleteDirectory("./node_modules");

deletePackageLock("./package-lock.json")
  .then(() => console.log("Successfully cleaned working tree!"))
  .then(() => {
    if (process.argv.find((argv) => argv === "--with-gitclone")) {
      deleteDirectory("./mcn-ui-components");
      execSync('git clone git@github.com:welltime/mcn-ui-components.git', { stdio: 'inherit', cwd: './' });
    }

    execSync('npm cache clean --force', { stdio: 'inherit', cwd: './' });

    execSync('npm i', { stdio: 'inherit', cwd: './' });
  });