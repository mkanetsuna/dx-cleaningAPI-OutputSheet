/**
 * 関数リスト:
 * CreatePayload(...args): 与えられた引数からペイロードオブジェクトを作成
 * 
 * TransformCheckinData(data)
 * 
 * TransformCleaningStatus(jsonData)
 * 
 * OutputJsonToSheet(jsonData, sheetId, sheetName): 指定されたGoogleシートにJSONデータを出力
 * 
 * CallApi(accessToken, apiUrl, method, payload): 指定されたパラメータでAPIを呼び出し、JSONレスポンスを返す
 * 
 * GetToken(): 保存されたプロパティからまたはログインリクエストを介してアクセストークンを取得
 * 
 * GetColumnDataByHeader(): 指定した文字列と一致したカラムの全データを取得
 */



function CreatePayload(...args) {
  var payload = {};
  args.forEach(function(arg) {
    for (var key in arg) {
      if (arg.hasOwnProperty(key)) {
        payload[key] = arg[key];
      }
    }
  });
  return payload;
}



function TransformData(data, keyName1, keyName2) {
  var transformedData = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var newObject = {};
      newObject[keyName1] = key;
      newObject[keyName2] = data[key];
      transformedData.push(newObject);
    }
  }
  return transformedData;
}



function FlattenObject(obj, parent = '', res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + '.' + key : key;
    if (typeof obj[key] == 'object' && obj[key] !== null) {
      FlattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}



function OutputJsonToSheet(jsonData, sheetId, sheetName) {
  // スプレッドシートを取得
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  
  // 指定されたシートを取得
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  // シートが存在しない場合はエラーをスロー
  if (!sheet) {
    throw new Error('Sheet with name ' + sheetName + ' does not exist in the spreadsheet.');
  }

  // シートの内容をクリア
  sheet.clear();

  // JSONデータのキーを取得（列ヘッダー用）
  var keys = Object.keys(jsonData[0]);

  // シートにヘッダーを書き込む
  for (var i = 0; i < keys.length; i++) {
    sheet.getRange(1, i + 1).setValue(keys[i]);
  }

  // シートにデータを書き込む
  for (var row = 0; row < jsonData.length; row++) {
    for (var col = 0; col < keys.length; col++) {
      sheet.getRange(row + 2, col + 1).setValue(jsonData[row][keys[col]]);
    }
  }
}



function CallApi(accessToken, apiUrl, method, payload=null) {
  // リクエストヘッダーの設定
  var headers = {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json'
  };
  
  // オプションの設定
  var options = {
    'method': method,
    'headers': headers
  };

  // ペイロードがある場合、オプションに含める
  if (payload) {
    options.payload = JSON.stringify(payload);
  }
  
  // リクエストを送信し、レスポンスを取得
  var response = UrlFetchApp.fetch(apiUrl, options);
  
  // レスポンスをJSON形式で返す
  return JSON.parse(response.getContentText());
}



function GetToken() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const storedAccessToken = scriptProperties.getProperty('accessToken');
  const storedExpiresAt = scriptProperties.getProperty('expiresAt');

  if (storedAccessToken && storedExpiresAt) {
    const currentTime = Math.floor(Date.now() / 1000); // 現在のUnixエポック時間を取得
    if (currentTime < storedExpiresAt)
      return storedAccessToken; // 既存のトークンを返す
  }

  const email = scriptProperties.getProperty('email');
  const password = scriptProperties.getProperty('password');
  const loginUrl = "https://api.m2msystems.cloud/login";
  const payload = {
    'email': email,
    'password': password
  };
  
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(loginUrl, options);
    if (response.getResponseCode() == 200) {
      const jsonResponse = JSON.parse(response.getContentText());
      const accessToken = jsonResponse.accessToken;
      const expiresAt = Math.floor(jsonResponse.expiresAt / 1000); // ミリ秒から秒に変換

      // トークンと有効期限をスクリプトプロパティに保存
      scriptProperties.setProperty('accessToken', accessToken);
      scriptProperties.setProperty('expiresAt', expiresAt);

      return accessToken; // 新しいトークンを返す
    } else {
      Logger.log('トークンの取得に失敗しました。ステータスコード：' + response.getResponseCode());
      return null;
    }
  } catch (error) {
    Logger.log('トークン取得時にエラーが発生しました: ' + error.toString());
    return null;
  }
}



function GetColumnDataByHeader(searchString, sheetId, sheetName) {
  // スプレッドシートとシートを取得
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  // シートが存在しない場合はnullを返す
  if (!sheet) {
    return null;
  }
  
  // 1行目のデータを取得
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 文字列Aが存在するカラムを探す
  var columnIndex = headers.indexOf(searchString);
  
  // 文字列Aが見つからない場合はnullを返す
  if (columnIndex === -1) {
    return null;
  }
  
  // カラムの全データを取得
  var columnData = sheet.getRange(2, columnIndex + 1, sheet.getLastRow() - 1, 1).getValues();
  
  // リスト形式に変換
  var dataList = columnData.map(function(row) {
    return row[0];
  });
  return dataList;
}




