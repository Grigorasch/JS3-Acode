import * as acorn from "acorn";
import {simple} from "acorn-walk";

import {fileURLToPath} from 'url';
import path, {dirname} from 'path';
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const code = fs.readFileSync(path.join(__dirname, 'lib', "entities_list.js"), "utf-8");

const code =`
    const z = 0;
    let h=hh=5;
    let i=j=k=l=5;
    let e,g;
const {a,b}={a:5,b:7}
const {aa,bb}=dd={cc}={aa:5,bb:7,cc:9}
    const [c,d]=[1,2]
`

const ast = acorn.parse(code, {ecmaVersion: 2020, sourceType: "module", locations: true})
simple(ast, {
    ClassDeclaration: (node) => console.log(node)
})
console.log('ok')