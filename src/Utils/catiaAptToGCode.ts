const catiaAptToGCode = (lines: string[]) => {
  let gCode = "";
  let lineNumber = 1;
  let isProbeSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    if (line.startsWith("PPRINT") || line.startsWith("TPRINT/")) {
      gCode += `; ${line.substring(6)}\n`;
    } else if (line.startsWith("$$ OPERATION NAME")) {
      const parts = line.split(":");
      gCode += `;  Operation: ${parts[1]}\nN${lineNumber++} G54\n`;
    } else if (line.startsWith("LOADTL/")) {
      const params = line.split("/")[1].split(",");
      gCode += `N${lineNumber++} T${
        params[0]
      }\nN${lineNumber++} M6\nN${lineNumber++} D1\nN${lineNumber++} UP_Z\n`;
    } else if (line.startsWith("RAPID") && nextLine?.startsWith("GOTO")) {
      const parts = nextLine.split("/");
      const coordinates = parts[1].split(",");
      const [x, y, z] = coordinates.slice(0, 3).map(Number);
      gCode += `N${lineNumber++} G0 X${Math.round(x * 1000) / 1000} Y${
        Math.round(y * 1000) / 1000
      } Z${Math.round(z * 1000) / 1000}\n`;
    } else if (line.startsWith("FEDRAT") && nextLine?.startsWith("GOTO")) {
      const parts = nextLine.split("/");
      const feed = line.split("/");
      const feedValue = feed[1].split(",").map(Number);
      const coordinates = parts[1].split(",");
      const [x, y, z] = coordinates.slice(0, 3).map(Number);
      gCode += `N${lineNumber++} G1 X${Math.round(x * 1000) / 1000} Y${
        Math.round(y * 1000) / 1000
      } Z${Math.round(z * 1000) / 1000} F${
        Math.round(feedValue[0] * 1000) / 1000
      }\n`;
    } else if (line.startsWith("PROBE/POINTS")) {
      isProbeSection = true;
    } else if (line.startsWith("PROBE/OFF")) {
      isProbeSection = false;
    } else if (isProbeSection && line.startsWith("GOTO")) {
      const gotoCoords = line.split("/ ")[1];
      const arrOfCoords = gotoCoords.split(",").map(Number);
      const [x, y, z, dirX, dirY, dirZ] = arrOfCoords;
      if (dirZ == 1) {
        gCode += `N${lineNumber++} CYCLE978(0,1,,1,${
          Math.round(z * 1000) / 1000
        },100,100,3,2,1,"",,0,1.01,-1.01,,0.34,1,0,,1,0)\n`;
      } else if (dirZ == -1) {
        console.log("WRONG DIRECTION!!!");
      } else if (dirX == 1) {
        gCode += `N${lineNumber++} CYCLE978(0,1,,1,${
          Math.round(x * 1000) / 1000
        },100,100,1,2,1,"",,0,1.01,-1.01,,0.34,1,0,,1,0)\n`;
      } else if (dirX == -1) {
        gCode += `N${lineNumber++} CYCLE978(0,1,,1,${
          Math.round(x * 1000) / 1000
        },100,100,1,1,1,"",,0,1.01,-1.01,,0.34,1,0,,1,0)\n`;
      } else if (dirY == 1) {
        gCode += `N${lineNumber++} CYCLE978(0,1,,1,${
          Math.round(y * 1000) / 1000
        },100,100,2,2,1,"",,0,1.01,-1.01,,0.34,1,0,,1,0)\n`;
      } else if (dirY == -1) {
        gCode += `N${lineNumber++} CYCLE978(0,1,,1,${
          Math.round(y * 1000) / 1000
        },100,100,2,1,1,"",,0,1.01,-1.01,,0.34,1,0,,1,0)\n`;
      }
    } else if (line.startsWith("INSERT")) {
      const parts = line.split("INSERT");
      const insertText = parts[1];
      gCode += `N${lineNumber++}${insertText}`;
    } else if (line === "END\r") {
      gCode += `N${lineNumber++} CYCLE800()\nN${lineNumber++} UP_Z\nN${lineNumber++} TIME\nN${lineNumber++} M1=330\nN${lineNumber++} M30\n`;
    }
  }
  return gCode;
};

export default catiaAptToGCode;
