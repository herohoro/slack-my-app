import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

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
        <title>Spreadsheet CMS</title>
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
                {/* {console.log({ channels })} */}
                {channels.map((channel, id) => {
                  return (
                    <li key={id}>
                      <Link
                        href="/channel/[channel]"
                        as={`/channel/${channel}`}
                        passHref
                      >
                        <a>{channel}</a>
                      </Link>

                      {console.log(id + "::" + channel)}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.header}># 000_皆さんへ</div>
            <div className={styles.scroll}>
              <div>
                {contents.map((post) => {
                  return (
                    <div className={styles.post}>
                      <div className={styles.textcols}>
                        <p>{post.name}</p>
                        <p>{post.date}</p>
                      </div>
                      <p className={styles.textContent}>{post.post}</p>
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
