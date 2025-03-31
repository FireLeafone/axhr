const path = require('path');
const fs = require('fs');
const JSzip = require('jszip');
const rm = require('rimraf');

const folderName = 'docsDist';
const rootPath = `${__dirname}`;
const currRootPath = rootPath.replace('\\script', '');

const zip = new JSzip();

rm(path.resolve(__dirname, `../${folderName}.zip`), (error) => {
  if (error) {
    console.log(error);
    return;
  }

  pushZip(zip, path.resolve(__dirname, `../${folderName}`));

  zip
    .generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    })
    .then(function (content) {
      fs.writeFile(
        path.resolve(__dirname, `../${folderName}.zip`),
        content,
        (err) => {
          if (err) throw err;
          console.log('文件已被保存');
        },
      );
    });

  // 遍历文件夹
  function pushZip(floder, pPath) {
    const files = fs.readdirSync(pPath, { withFileTypes: true });
    files.forEach((dirent, index) => {
      let filePath = `${pPath}/${dirent.name}`;
      if (dirent.isDirectory()) {
        let zipFloder = zip.folder(
          filePath.replace(`${currRootPath}\\${folderName}/`, ''),
        );
        pushZip(zipFloder, filePath);
      } else {
        floder.file(dirent.name, fs.readFileSync(filePath));
      }
    });
  }
});
