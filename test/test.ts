import request, {Response} from 'then-request';
import {readFileSync} from "fs";
import * as assert from 'assert';
import * as querystring from "querystring";
import {parseCliArgumentValue, throwOnError, parseResponse} from "../helpers";

const apiKey = parseCliArgumentValue(process.argv, '--apiKey') || "f892c332-7491-4cb2-ba03-acc6199b4d2d",
  urlPrefix = "digitalapi.auspost.com.au",
  apiEndpoint = `https://${urlPrefix}/postage/parcel/domestic/`,
  header = {"AUTH-KEY": apiKey};

describe('auspost api test', function() {

  it('should have an api-key set', async function() {
    assert.ok(apiKey);
    console.log(apiKey);
  });

  it('should return the expected size.json', async function() {
    const res: Response = await request('GET', apiEndpoint + 'size.json', {headers: header});
    await throwOnError(res);

    const resBody = parseResponse(await res.getBody());
    const expectedBody = parseResponse(readFileSync('expectedSize.json'));
    // console.log(JSON.stringify(resBody, undefined, 2));
    assert.deepStrictEqual(expectedBody, resBody);
  });

  it('should return the expected service.json with querystring', async function() {
    const packageDetails = {height: '7.7', length: '22', weight: '1.5', width: "16", from_postcode: "2000", to_postcode: "3000"},
      res: Response = await request('GET', apiEndpoint + `service.json?${querystring.stringify(packageDetails)}`, {headers: header});
    await throwOnError(res);

    const resBody = parseResponse(await res.getBody());
    const expectedBody = parseResponse(readFileSync('expectedService.json'));
    // console.log(JSON.stringify(resBody, undefined, 2));
    assert.deepStrictEqual(expectedBody, resBody);
  });

  it('should return an error status code if the request is incomplete', async function() {
    const packageDetails = {height: '7.7', length: '22', weight: '1.5', width: "16", from_postcode: "2000", to_postcode: "3000"},
      res: Response = await request('GET', apiEndpoint + `asd.json?${querystring.stringify(packageDetails)}`, {headers: header});
    assert.equal(await res.isError(), true);
  });

  it('should calculate total deliver price', async function() {
    const packageDetails = {height: '7.7', length: '22', weight: '1.5', width: "16", from_postcode: "2000", to_postcode: "3000", service_code:"AUS_PARCEL_REGULAR"},
      res: Response = await request('GET', apiEndpoint + `calculate.json?${querystring.stringify(packageDetails)}`, {headers: header});
    await throwOnError(res);

    const resBody = parseResponse(await res.getBody());
    const expectedBody = parseResponse(readFileSync('expectedCalculate.json'));
    // console.log(JSON.stringify(resBody, undefined, 2));
    assert.deepStrictEqual(expectedBody, resBody);
  });
});