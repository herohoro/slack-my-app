import { GoogleApis, google } from "googleapis";

const getSheets = () => {
  const googleapis = new GoogleApis();
  const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const jwt = new googleapis.auth.JWT(
    process.env.GCP_SERVICEACCOUNT_EMAIL,
    undefined,
    (process.env.GCP_SERVICEACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes
  );
  return google.sheets({ version: "v4", auth: jwt });
};

// シート１をチャンネル一覧として取得
export const getChannels = async () => {
  const sheets = getSheets();
  const rangeName = "B2:C";
  const sheetsName = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: rangeName,
  });
  const rows = sheetsName.data.values;
  // console.log(rows);
  if (rows) {
    return rows
      .slice(1)
      .sort()
      .filter((name) => name[1] !== "TRUE" && name[0] !== "")
      .map((row) => {
        return row[0];
      });
  }

  return [];
};

//仮で末尾10件取得して画面遷移を早くさせる
export const getContentByChannel = async (channel) => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  });
  const rows = response.data.values;
  if (rows) {
    return rows.slice(-10).map((row, id) => {
      return {
        id: id + 1,
        date: row[0],
        name: row[1],
        post: row[2],
      };
    });
  }
  return [];
};
//まずはじめの投稿を何かを取得する作戦
// はじめの投稿と取得した10件ターンとで重複があったらreadmoreボタンを非表示にする
export const getFirstPost = async (channel, pageSize = 1) => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  });
  const rows = response.data.values;
  if (rows) {
    return rows.slice(0, pageSize).map((row) => {
      return {
        date: row[0],
        name: row[1],
        post: row[2],
      };
    });
  }

  return [];
};

// 10ずつ取得できる数式を入れたい.....
// useEffectで回数をカウントする？
// -10,-1 → -20,-11 → -30,-21....-10*n,-1-10*(n-1)
// もし残りのはじめの投稿を含んでいなかったら次へ進む
// 仮：今は残り全部を取得するようにしておく
// export const getReadmoreContent = async (channel) => {
//   const sheets = getSheets();
//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.SPREADSHEET_ID,
//     range: channel,
//   });
//   const rows = response.data.values;

//   if (rows) {
//     return rows.slice(0, -11).map((row, id) => {
//       return {
//         id: id + 1,
//         date: row[0],
//         name: row[1],
//         post: row[2],
//       };
//     });
//   }
//   return [];
// };
