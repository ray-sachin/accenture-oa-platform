const fs=require('node:fs');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
for(const file of ['server.js','server/app.js','server/access.js','server/db.js','server/sql-process.js','scripts/account.js','scripts/build-content.js']) {
 new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
}
for(const file of ['public/js/app.js','public/js/admin.js','public/js/ide.js','public/js/icons.js']) {
 new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{identifier:file});
}
console.log('Parsed all server scripts and browser ES modules successfully.');
