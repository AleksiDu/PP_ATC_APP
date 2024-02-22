/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
// import * as fs from "fs";
const fs = window.require("fs");
import extractPartName from "./Utils/extractPartName";
import extractProjectName from "./Utils/extractProjectName";
import catiaAptToGCode from "./Utils/catiaAptToGCode";

let inputFilePath: string;
let outputFilePath: string;

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

async function main() {
  fs.readFile(inputFilePath, "utf8", (err: any, data: string) => {
    if (err) {
      console.error("Error reading input file:", err);
      return;
    }

    const lines = data.split("\n");
    const projectName = extractProjectName(lines);
    const partName = extractPartName(lines);

    const headerInfo = [
      `; ( PROJECT  : ${projectName} )`,
      `; ( PART NAME: ${partName})`,
      "; ( DRW.   NO: 0 )",
      "; ( OPERATION: 1 )",
      "; ( DRW.REV  : Rev01 )",
      "; ( PREPARED BY: AD )",
      `; (DATE : ${new Date().toLocaleString()} )`,
      "; ( -------- LIST OF TOOLS ---------- )",
      "; N3 T98_RENISHAW",
      "; ( --------------------------------- )",
      "VERIFY",
      "",
    ].join("\n");

    const gCode = catiaAptToGCode(lines);

    const finalGCode = headerInfo + gCode;

    fs.writeFile(outputFilePath, finalGCode, (err: any) => {
      if (err) {
        console.error("Error writing output file:", err);
        return;
      }
      console.log("G-code generated successfully!");
    });
  });
}

document.getElementById("file").addEventListener("change", (event) => {
  const inputFile = event.target as HTMLInputElement;
  const inputFileName = inputFile.files[0].name;
  inputFilePath = inputFile.files[0].path;
  outputFilePath =
    inputFilePath.substring(0, inputFilePath.lastIndexOf("\\") + 1) +
    inputFileName.replace(".aptsource", ".MPF");

  console.log("INPUT FILE NAME:", inputFilePath);
  console.log("OUTPUT FILE NAME", outputFilePath);
});

document.getElementById("btn").addEventListener("click", async () => {
  await main();
});
