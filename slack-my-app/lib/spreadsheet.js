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

// チャンネル名を変数にしてそこから内容を取得する
export const getContentByChannel = async (channel) => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  });
  const rows = response.data.values;
  if (rows) {
    return rows.slice(1).map((row) => {
      return {
        date: row[0],
        name: row[1],
        post: row[2],
      };
    });
  }
  return [];
};

// topページはいつも「000_皆さんへ」のチャンネル
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
        post: row[2],
      };
    });
  }
  return [];
};
