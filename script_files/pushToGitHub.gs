function PushToGitHub() {
  const url="https://asia-northeast1-m2m-core.cloudfunctions.net/kanetsuna_gas_push_github";
  const scriptId = ScriptApp.getScriptId();
  const params = {
    script_id: scriptId
  };//h
  const sendUrl = url + '?' + CreateQueryString(params);
  UrlFetchApp.fetch(sendUrl, {
    method: 'get'
  });
}



function CreateQueryString(params) {
  return Object.keys(params)
    .map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    })
    .join('&');
}