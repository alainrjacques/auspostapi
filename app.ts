import request from 'then-request';

const apiKey = "f892c332-7491-4cb2-ba03-acc6199b4d2d",
  urlPrefix = "digitalapi.auspost.com.au",
  parcelTypesURL = `https://${urlPrefix}/postage/parcel/domestic/size.json`,
  header = {"AUTH-KEY": apiKey};

request('GET', parcelTypesURL, {headers: header}).done(async function(res){
  if(await res.isError()){
    const errorBody = JSON.parse(res.body.toString()).errors[0];
    throw new Error(`Code: ${errorBody.code} - Message : ${errorBody.message}`);
  }
  try {
    const resBody = JSON.parse((await res.getBody()).toString());
    console.log(resBody);
  } catch (e) {
    console.error(e);
  }
});