var f=Object.create;var m=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var d=Object.getPrototypeOf,F=Object.prototype.hasOwnProperty;var h=(i,t,o,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of S(t))!F.call(i,r)&&r!==o&&m(i,r,{get:()=>t[r],enumerable:!(l=g(t,r))||l.enumerable});return i};var n=(i,t,o)=>(o=i!=null?f(d(i)):{},h(t||!i||!i.__esModule?m(o,"default",{value:i,enumerable:!0}):o,i));var s=n(require("fs")),c=n(require("os")),p=n(require("path")),a=process.argv[2],j=s.default.readFileSync(a).toString(),k=s.default.readFileSync(p.default.join(__dirname,"./jit-name-file.txt")).toString().trim(),e=j.split(c.default.EOL);if(e[0].startsWith("pick"))for(let i=0;i<e.length;i++){let t=e[i].trim();i===0?e[i]=`pick ${e[0].slice(5,12)} ${k}`:e[i]=t.replace("pick","fixup")}s.default.writeFileSync(a,e.join(c.default.EOL));console.log("Done :)");process.exit(0);
