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
// 本当はシート名自体を取得したい....
export const getChannels = async () => {
  const sheets = getSheets();
  const rangeName = "A2:B";
  const sheetsName = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: rangeName,
  });
  const rows = sheetsName.data.values;
  if (rows) {
    return rows
      .slice(1)
      .sort()
      .map((row) => {
        return row[1];
      });
  }

  return [];
};
// for文でチャンネル名を一気に取得したい

// 【予定】シートを複数取得できるようにする
export const getContents = async () => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    // rangeの値を配列sheets名で回すのかも....
    range: "000_皆さんへ",
    // range: "020_zoom報告",
  });
  const rows = response.data.values;
  if (rows) {
    return rows.slice(1).map((row) => {
      return {
        // title: row[1],
        date: row[0],
        name: row[1],
        content: row[2],
      };
    });
  }
  return [];
};
