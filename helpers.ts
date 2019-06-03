import {Response} from "then-request";

export function parseCliArgumentValue(argv: string[], argName: string) {
  const argIndex = argv.findIndex(a => a.indexOf(argName) > -1);
  // Returns undefined if index = -1 or there is no = in the found string of the index matching
  return argIndex > -1 ? argv[argIndex].split('=')[1] : undefined;
}

export async function throwOnError(response: Response) {
  if(await response.isError()){
    const errorBody = JSON.parse(response.body.toString()).errors[0];
    throw new Error(`Code: ${errorBody.code} - Message : ${errorBody.message}`);
  }
}

export function parseResponse(jsonObj: Object) {
  return JSON.parse(jsonObj.toString());
}