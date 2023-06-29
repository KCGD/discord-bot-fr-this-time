import * as fs from 'fs';
import * as path from "path";
import * as process from "process";

//define object for process arguments
let args:any = {
    "showHelpDoc":false
}

//parse process arguments
for(let i = 0; i < process.argv.length; i++) {
    switch(process.argv[i]) {
        case "--help":
        case "-h": {
            args.showHelpDoc = true;
        } break;
    }
}

//main function
Main();
function Main(): void {
    if(args.showHelpDoc) {
        console.log(fs.readFileSync("./src/assets/helpdoc").toString());
        process.exit(0);
    }
}