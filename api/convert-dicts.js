const fs = require('fs');

const langPath = '../lang/';
const exportFile = 'dicts.ts';
const exportPath = 'src/';
const dicts = {};

const convertLangs = () => {
  fs.readdir(langPath, (error, files) => {
    if (error) {
      console.log(error.message);
    }
    for (const filename of files) {
      const lang = filename.substring(0, 5);
      dicts[lang] = {};
      fs.readFile(`${langPath}${filename}`, 'utf8', (error, data) => {
        if (error) {
          console.log(error.message);
        }
        let key;
        let value;
        for (const line of data.split('\n')) {
          if (line.startsWith('msgid')) {
            key = line.substring(7, line.length - 1);
          }
          if (line.startsWith('msgstr') && key) {
            value = line.substring(8, line.length - 1);
          }
          if (line.startsWith('"') && key) {
            value += line.substring(1, line.length - 1);
          }
          if (!line.length && key && value) {
            dicts[lang][key] = value;
          }
        }
        if (key && value) {
          dicts[lang][key] = value;
        }
        const file = `export const dicts: Record<string, unknown> = ${JSON.stringify(dicts)}`;
        fs.writeFileSync(`${exportPath}${exportFile}`, file);
      });
    }
  });
};

convertLangs();
