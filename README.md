# dx-cleaningAPI-OutputSheet

このプロジェクトは、Google Apps Scriptを使用して、m2m cleaningAPIからデータを取得し、Google Spreadsheetsに出力するスクリプトです。

## main.gs

### 主要関数

1. `main()`
  - 各APIからデータを取得し、スプレッドシートに出力

2. `ImportOperationsAPIResponse(accessToken, sheetId)`
  - operationAPIからデータを取得し、operationsシートに出力

3. `ImportPlacementsAPIResponse(accessToken, sheetId)`
  - placementAPIからデータを取得し、placementsシートに出力

4. `ImportStatusAPIResponse(accessToken, sheetId)` 
  - statusAPIからデータを取得し、statusシートに出力

5. `ImportCheckinAPIResponse(accessToken, sheetId)`
  - checkinAPIからデータを取得し、checkinシートに出力

## subroutine.gs

### 補助関数

1. `CreatePayload(...args)`
  - APIリクエストのペイロードを作成

2. `TransformData(data, keyName1, keyName2)`
  - APIレスポンスのデータを変換

3. `FlattenObject(obj, parent = '', res = {})`
  - ネストされたオブジェクトをフラット化

4. `OutputJsonToSheet(jsonData, sheetId, sheetName)`
  - JSONデータをスプレッドシートに出力

5. `CallApi(accessToken, apiUrl, method, payload=null)`
  - APIにリクエストを送信し、レスポンスを取得

6. `GetToken()`
  - m2m cleaningAPIアクセストークンを取得

7. `GetColumnDataByHeader(searchString, sheetId, sheetName)`
  - 指定されたヘッダーのカラムデータを取得

## pushToGitHub.gs

### GitHub連携関数

1. `PushToGitHub(url="https://asia-northeast1-m2m-core.cloudfunctions.net/kanetsuna_gas_push_github")`
  - スクリプトをGitHubにプッシュ

2. `CreateQueryString(params)`
  - URLクエリパラメータを作成
