# React Library Template

This is a template for building React libraries using Bun and Vite.

### How to <u>use this template</u>:

1) Install bun (https://bun.sh/): ```curl -fsSL https://bun.sh/install | bash```
2) Install a recent version of nodejs (https://nodejs.org/it) (I don't know why but it's needed to running vite correctly even though bun SHOULD be sufficient)
2) ```bun create github.com/mavek87/react-library-template <name-of-react-library>```
3) In the terminal insert the **name** of your react library, the **description** and the **author**

### How to <u>run the scripts</u> in the 'package.json':

- ```bun run <package-json-script>```
  - ```bun run build```
  - ```bun run test```
  - ```...```

### How this template was created:

- Install bun (https://bun.sh/): ```curl -fsSL https://bun.sh/install | bash```
- ```bun create vite```
- ```bun install```
- add dependencies (for tests and other) 
- some manual configurations on various files (package.json, vite.config.js, tsconfig.json, .gitignore, .env)
- created a node script (applyLibConfig.js) which is automatically launched by Bun after you "clone" the template. It allows you to set the name, the description and the author of the library. 

------------------------

#### Author: Matteo Veroni
#### Website: www.matteoveroni.com
#### GitHub: www.github.com/mavek87
