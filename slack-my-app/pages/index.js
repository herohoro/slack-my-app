import Head from "next/head";
import styles from "../styles/Home.module.css";

import { getContents, getChannels } from "../lib/spreadsheet";

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
            <div className={styles.scroll}>
              <ul>
                {console.log({ channels })}
                {channels.map((channel) => {
                  return <li key={channel.id}>{channel}</li>;
                })}
              </ul>
            </div>
          </div>
          <div className={styles.main}>
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
                      <div className={styles.textcols}>
                        <p>{content.name}</p>
                        <p>{content.date}</p>
                      </div>
                      <p className={styles.textContent}>{content.content}</p>
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
