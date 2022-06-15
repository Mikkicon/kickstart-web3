
import fs from "fs"
import path from "path"
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUILD_DIR_NAME = "build"
const CONTRACTS_DIR_NAME = "contracts"


export const getInput = (filename) => ({
    language: "Solidity",
    sources: { [filename]: { content: getSource(filename) } },
    settings: { outputSelection: { "*": { "*": ["*"] } } },
  });
  
export function getSource(contractFileName) {
    const inboxPath = path.resolve(__dirname, CONTRACTS_DIR_NAME, contractFileName);
    const source = fs.readFileSync(inboxPath, "utf8");
    return source;
}

export function createBuildFolder() {
    const buildFolderPath = path.resolve(__dirname, BUILD_DIR_NAME);
    fs.mkdirSync(buildFolderPath)
}

export function deleteBuildFolder() {
    const buildFolderPath = path.resolve(__dirname, BUILD_DIR_NAME);
    if(fs.existsSync(buildFolderPath)) fs.rmSync(buildFolderPath, { recursive: true, force: true });
}

export function listContracts() {
    const contractsFolderPath = path.resolve(__dirname, CONTRACTS_DIR_NAME);
    const contracts = fs.readdirSync(contractsFolderPath);
    return contracts;
}

export function writeFileToBuild(fileData, fileName) {
    const dirPath = path.resolve(__dirname, BUILD_DIR_NAME)
    const filePath = path.resolve(dirPath, fileName)
    
    if(!fs.existsSync(dirPath)) createBuildFolder()

    fs.writeFileSync(filePath, fileData);
}
