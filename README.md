
# 改良版
サンプルコードをコピペして作成したGoogleスプレッドシートから閲覧用に用意したスプレッドシートを無くしてwebアプリにしたものです。  
GASやスプレッドシートに関する詳しい解説は過去に投稿した「[【テンプレ有】Googleスプレッドシート・GASを使って投稿履歴を簡単に移行しよう_slackフリープランでも大丈夫](https://qiita.com/mineral_30/items/f229162ab36459a5ecae)」を参照ください。

# 準備
slackのデータをGASを使ってGoogleスプレッドシートへ転記します。  
  
【手順】  
1. Googleドライブに作業用フォルダを作成
2. 「Slacklog」という名前のGASを作成し、本リポジトリのset-upディレクトリにある【コード.gs】のコードをコピペ
3. 93行目あたりにあるトークン・フォルダIDを入力
3. コードgsを実行しslackのデータを取得したスプレッドシートを生成
4. 生成したスプレッドシートを開き、拡張機能からGASを開き、本リポジトリのset-upディレクトリにある【もくじ.gs】のコードをコピペ
5. シート1のB2セルをアクティブにしてからもくじ.gsを実行

# 導入
Googleスプレッドシートの内容を取得してslackっぽくNext.jsで表示します。

以下の環境変数を登録してください。
- GCP_SERVICEACCOUNT_EMAIL
- GCP_SERVICEACCOUNT_PRIVATE_KEY
- SPREADSHEET_ID

※ SPREADSHEET_IDは準備の段階で登録したフォルダIDと同じ内容です

### GCPの設定で参考になる記事
- [Google API を調べてみる](https://www.fundely.co.jp/blog/tech/2020/02/19/180051/)
- [Google API のサービスアカウントで認証するための JSON / P12 キーを取得する](https://www.ipentec.com/document/software-google-cloud-platform-get-service-account-key)
