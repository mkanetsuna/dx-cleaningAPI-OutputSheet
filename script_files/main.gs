function main() {
  const accessToken = GetToken();
  const sheetId = "1YvHj-CY6i64VlK4m7BMCK9cCrBHepYZG-qDec1YnFeo";

  PushToGitHub("https://asia-northeast1-m2m-core.cloudfunctions.net/kanetsuna_gas_push_github");
  //ImportOperationsAPIResponse(accessToken, sheetId);
}

function ImportOperationsAPIResponse(accessToken, sheetId) {
  const searchApiUrl = "https://api-cleaning.m2msystems.cloud/v4/operations/search";
  const countApiUrl = "https://api-cleaning.m2msystems.cloud/v4/operations/count";
  const sheetName = "operations";
  const startDate = "2024-05-19";
  const endDate = "2024-05-19";
  const filter = "normalCleaning";
  const payloadForCount = CreatePayload({startDate}, {endDate},{filter});
  const searchResponse = CallApi(accessToken, countApiUrl, "POST", payloadForCount);
  const fullSizeCount = searchResponse.count;
  Logger.log(fullSizeCount)
  const pageSize = 1000;
  const totalPages = Math.ceil(fullSizeCount / pageSize);
  Logger.log(totalPages)
  
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const currentPayloadForSearch = CreatePayload({startDate}, {endDate}, {filter}, {page:currentPage}, {pageSize});
    const jsonData = CallApi(accessToken, searchApiUrl, "POST", currentPayloadForSearch);
    OutputJsonToSheet(jsonData, sheetId, sheetName);
  }
  //ImportPlacementsAPIResponse(accessToken);
  //ImportCheckinAPIResponse(accessToken);
  //ImportStatusAPIResponse(accessToken);
}



/*function ImportPhotoToursAPIResponse() {
  const accessToken = GetToken();
  const photoToursApiUrl = "https://api-cleaning.m2msystems.cloud/v3/photo_tours/by_company_id/1";
  const sheetId = "1YvHj-CY6i64VlK4m7BMCK9cCrBHepYZG-qDec1YnFeo";
  const sheetName = "photo_tours";
  const jsonData = CallApi(accessToken, photoToursApiUrl, "GET");
  
  OutputJsonToSheet(jsonData, sheetId, sheetName);
}*/



function ImportPlacementsAPIResponse(accessToken, sheetId) {
  const placementsApiUrl = "https://api-cleaning.m2msystems.cloud/v4/placements/find_by_ids";
  const placementIds = GetColumnDataByHeader("placementId", sheetId, "operations");
  const payloadForPlacements = CreatePayload({placementIds});
  const jsonData = CallApi(accessToken, placementsApiUrl, "POST", payloadForPlacements);
  const flatData = jsonData.placements.map(item => FlattenObject(item));
  OutputJsonToSheet(flatData, sheetId, "placements");
}



function ImportStatusAPIResponse(accessToken, sheetId) {
  const statusApiUrl = "https://api-cleaning.m2msystems.cloud/v4/cleaning/status";
  const cleaningIds = GetColumnDataByHeader("id", sheetId, "operations");
  const payloadForStatus = CreatePayload({cleaningIds});
  const jsonData = CallApi(accessToken, statusApiUrl, "POST", payloadForStatus);
  const transformedData = TransformData(jsonData, "cleaningId", "status");
  OutputJsonToSheet(transformedData, sheetId, "status");
}



function ImportCheckinAPIResponse(accessToken, sheetId) {
  const placementsApiUrl = "https://api-cleaning.m2msystems.cloud/v4/cleanings/checkin";
  const cleaningIds = GetColumnDataByHeader("id", sheetId, "operations");
  const payloadForCleanings = CreatePayload({cleaningIds});
  const jsonData = CallApi(accessToken, placementsApiUrl, "POST", payloadForCleanings);
  const transformedData = TransformData(jsonData, "cleaningId", "hasCheckinOnDate");
  OutputJsonToSheet(transformedData, sheetId, "checkin");
}
