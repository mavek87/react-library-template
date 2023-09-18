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
            if (stat.isDirectory()) {
                // Is a dir
                const fileName = path.basename(file);
                if (!stat || isFolderExcluded(fileName)) {
                    excludedFolder.push(fileName);
                } else {
                    includedFolder.push(fileName);
                    results = [...results, ...walk(file)]; // Recurse into subdir
                }
            } else {
                // Is a file
                const fileName = path.basename(file);
                if (!stat || isFileExcluded(fileName)) {
                    excludedFiles.push(fileName);
                } else {
                    includedFiles.push(fileName);
                    results.push(file);
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
    return fileName === ".gitignore" || fileName === "applyLibConfig.js" || fileName === "bun.lockb" || fileName === "README.md" || fileName === "LICENSE";
}

const edit = (filePath, libName) => {
    const oldContent = fs.readFileSync(filePath, {encoding: 'utf8'});
    const regex = /react-library-template/;
    const newContent = oldContent.replaceAll(regex, libName);
    fs.writeFileSync(filePath, newContent, {encoding: 'utf-8'});
};

const editPackageJson = (author) => {
    const oldContent = fs.readFileSync("package.json", {encoding: 'utf8'});
    const regex = /"author": "not-specified"/;
    const newContent = oldContent.replaceAll(regex, `"author": "${author}"`);
    fs.writeFileSync("package.json", newContent, {encoding: 'utf-8'});
};

const main = async () => {
    const dir = __dirname;
    const filePaths = walk(dir);
    console.log(`included files: [${includedFiles}]`);
    console.log(`included folders: [${includedFolder}]`);
    console.log(`excluded files: [${excludedFiles}]`);
    console.log(`excluded folders: [${excludedFolder}]`);

    const libName = await new Promise(resolve => {
        rl.question("\nLibrary name: ", resolve)
    })
    const author = await new Promise(resolve => {
        rl.question("\nAuthor: ", resolve)
    })
    rl.close();

    const config = {
        libName,
        author
    }

    filePaths.forEach(filePath => edit(filePath, config.libName));
    editPackageJson(config.author);

    console.log(`\nSuccessfully applied configs: ${JSON.stringify(config)}`);
};

main();