import * as diff from 'diff';

export const ejsContentDiff = (ejsConent: string, fileContent: string) => {
  const result = diff.diffLines(fileContent, ejsConent);
  console.log(result);
};
