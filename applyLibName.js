const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const includedFiles = [];
const excludedFiles = [];
const includedFolder = [];
const excludedFolder = [];

const walk = dir => {
    try {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            file = path.join(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                const fileName = path.basename(file);
                if (isFolderExcluded(fileName)) {
                    excludedFolder.push(fileName);
                } else {
                    includedFolder.push(fileName);
                    results = [...results, ...walk(file)]; // Recurse into subdir
                }
            } else {
                const fileName = path.basename(file);
                if (!stat || isFileExcluded(fileName)) {
                    excludedFiles.push(fileName);
                } else {
                    includedFiles.push(fileName);
                    results.push(file); // Is a file
                }
            }
        });
        return results;
    } catch (error) {
        console.error(`Error when walking dir ${dir}`, error);
    }
};

const isFolderExcluded = (folderName) => {
    return folderName.startsWith('.') || folderName === 'node_modules';
}

const isFileExcluded = (fileName) => {
    return fileName === "applyLibName.js" || fileName === "bun.lockb";
}

const edit = (filePath, libName) => {
    const oldContent = fs.readFileSync(filePath, {encoding: 'utf8'});
    const regex = /react-library-template/;
    const newContent = oldContent.replace(regex, libName);
    fs.writeFileSync(filePath, newContent, {encoding: 'utf-8'});
};

const main = () => {
    const dir = __dirname;
    const filePaths = walk(dir);
    console.log(`included files: [${includedFiles}]`);
    console.log(`included folders: [${includedFolder}]`);
    console.log(`excluded files: [${excludedFiles}]`);
    console.log(`excluded folders: [${excludedFolder}]`);
    rl.question('\ninsert the library name: ', (libName) => {
        filePaths.forEach(filePath => edit(filePath, libName));
        rl.close();
    });
};

main();