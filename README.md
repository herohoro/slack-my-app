slackフリープランで90日以降に見れなくなってしまう過去の投稿を見返すためのアプリ

<img width="1230" alt="スクリーンショット 2022-07-30 4 40 14" src="https://user-images.githubusercontent.com/24947347/181832576-ad59d2c7-62fd-43e6-8e5d-5eefa2704801.png">

# 改良版

サンプルコードをコピペして作成した Google スプレッドシートから閲覧用に用意したスプレッドシートを無くして web アプリにしたものです。  
GAS やスプレッドシートに関する詳しい解説は過去に投稿した「[【テンプレ有】Google スプレッドシート・GAS を使って投稿履歴を簡単に移行しよう\_slack フリープランでも大丈夫](https://qiita.com/mineral_30/items/f229162ab36459a5ecae)」を参照ください。

# 準備

slack のデータを GAS を使って Google スプレッドシートへ転記します。

【手順】

1. Google ドライブに作業用フォルダを作成
2. 「Slacklog」という名前の GAS を作成し、本リポジトリの set-up ディレクトリにある【コード.gs】のコードをコピペ
3. 93 行目あたりにあるトークン・フォルダ ID を入力
4. コード gs を実行し slack のデータを取得したスプレッドシートを生成
5. 生成したスプレッドシートを開き、拡張機能から GAS を開き、本リポジトリの set-up ディレクトリにある【もくじ.gs】のコードをコピペ
6. シート 1 の B2 セルをアクティブにしてからもくじ.gs を実行

<img width="812" alt="スクリーンショット 2022-07-30 3 55 05" src="https://user-images.githubusercontent.com/24947347/181832601-a42ef765-f8f3-4424-bad2-b5325664fdc2.png">

# 導入

Google スプレッドシートの内容を取得して slack っぽく Next.js で表示します。
⭐ 　生成したスプレッドシートの閲覧権限に GCP_SERVICEACCOUNT_EMAIL を設定  
[詳細解説](https://qiita.com/suzuki_sh/items/7de6a93a87fa21e3e773)

以下の環境変数をサーバーに登録してください。

- GCP_SERVICEACCOUNT_EMAIL
- GCP_SERVICEACCOUNT_PRIVATE_KEY
- SPREADSHEET_ID

※ SPREADSHEET_ID は生成したスプレッドシートのパスの【/d/⭐⭐/edit】の【⭐】部分

### GCP の設定で参考になる記事

- [Google API を調べてみる](https://www.fundely.co.jp/blog/tech/2020/02/19/180051/)
- [Google API のサービスアカウントで認証するための JSON / P12 キーを取得する](https://www.ipentec.com/document/software-google-cloud-platform-get-service-account-key)
