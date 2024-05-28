/**
 * 先に権限をサービスアカウントに与える（dx-878@m2m-core.iam.gserviceaccount.com）
 */
function PushToGitHub() {
  const url="https://asia-northeast1-m2m-core.cloudfunctions.net/kanetsuna_gas_push_github";
  const scriptId = ScriptApp.getScriptId();
  const scriptProperties = PropertiesService.getScriptProperties();
  const githubToken = scriptProperties.getProperty('githubToken');
  const githubRepo =  'mkanetsuna/dx-cleaningAPI-OutputSheet';
  const params = {
    script_id: scriptId,
    github_token: githubToken,
    github_repo: githubRepo
  };
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