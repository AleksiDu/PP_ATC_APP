const extractPartName = (lines: string[]) => {
  let projectName = "";
  for (const element of lines) {
    if (element.startsWith("$$ CATPRODUCT/")) {
      const parts = element.split("/");
      if (parts.length > 1) {
        projectName = parts[1].trim();
      }
      break;
    }
  }
  return projectName;
};

export default extractPartName;
