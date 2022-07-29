// 元の解説記事：https://qiita.com/okNirvy/items/d1a2f4918cff8e63dcac
// *****　必ずシート1のB2セルをアクティブにしてから実行してください
function PutLinks() {
  // スプレッドシート内の全シートとスプレッドシートのID
  var sheets = SpreadsheetApp.getActive().getSheets();
  var ssId = SpreadsheetApp.getActive().getId();

  // ハイパーリンク文字列の配列
  var linkList = [[]];

  for (var i = 0; i < sheets.length; i++) {
    // シートのIDと名前
    var sheetId = sheets[i].getSheetId();
    var sheetName = sheets[i].getSheetName();

    // シートのURLからハイパーリンク文字列を組み立て
    var url =
      "https://docs.google.com/spreadsheets/d/" + ssId + "/edit#gid=" + sheetId;
    var link = ['=HYPERLINK("' + url + '","' + sheetName + '")'];

    // ハイパーリンク文字列を配列に格納
    linkList[i] = link;
  }

  // 選択中のセルにハイパーリンク文字列を入れる
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  var range = sheet.getRange(
    cell.getRow(),
    cell.getColumn(),
    linkList.length,
    1
  );
  range.setValues(linkList);
}
