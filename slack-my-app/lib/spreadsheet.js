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
// 【予定】シートを複数取得できるようにする
export const getContents = async () => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "000_皆さんへ",
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
