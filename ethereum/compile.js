import { getInput, listContracts, deleteBuildFolder, writeFileToBuild } from "./util.js";
import solc from "solc";

function compileFile(filename) {
    deleteBuildFolder();    

    const input = getInput(filename);
    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

    const {errors} = compiled
    if (errors) throw new Error(errors.map(e => e.formattedMessage));
    else return Object.entries(compiled.contracts[filename]);   
}

function compileAll() {
    const allContractFilenames = listContracts()
    const comiledContracts = allContractFilenames.map(name => compileFile(name)).flat()
    comiledContracts.forEach(([name, content]) => writeFileToBuild(JSON.stringify(content), `${name}.json`))
}
compileAll()