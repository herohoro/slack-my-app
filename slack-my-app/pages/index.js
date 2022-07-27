import Head from "next/head";
import styles from "../styles/Home.module.css";

import { getContents, getChannels } from "../lib/spreadsheet";
import emoji from "../lib/emoji_unicode.json";

export async function getStaticProps() {
  const contents = await getContents();
  const channels = await getChannels();
  return {
    props: { contents, channels },
    revalidate: 3600,
  };
}

export default function Home({ contents, channels }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js Spreadsheet CMS</title>
        <meta name="description" content="Next.js Spreadsheet CMS" />
        {/* <script>
          if (typeof window === "object")
          {window.addEventListener("DOMContentLoaded", () => {
            let target = document.getElementById("scrollInner");
            target.scrollIntoView(false);
          })}
        </script> */}
      </Head>

      <main>
        <div className={styles.wrapper}>
          <div className={styles.sidebar}>
            {/* <ul> */}
            {/* 値が空でなければliタグにしたい.... */}
            <div className={styles.scroll}>
              {console.log({ channels })}
              {channels.map((channel) => {
                return <p>{channel}</p>;
              })}
              {/* </ul> */}
            </div>
          </div>
          <div className={styles.main}>
            {console.log(emoji["100"])}
            <p>{typeof emoji["100"]}</p>
            <p>{emoji["five"]}</p>

            <p>&#x1F4AF;</p>
            <div>&#x1F641;:slightly_frowning_face</div>

            <div className={styles.header}>チャンネル名</div>
            <div className={styles.scroll}>
              {/* {const target = document.getElementById('scroll-inner');
          target.scrollIntoView(false);
} */}
              {/* <div id="scrollInner"> */}
              <div>
                {contents.map((content) => {
                  return (
                    <div>
                      <p>{content.date}</p>
                      <h3>{content.name}</h3>
                      <p>{content.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
