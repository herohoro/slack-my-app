import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

import { getChannels } from "../lib/spreadsheet";

export async function getStaticProps() {
  const channels = await getChannels();
  return {
    props: { channels },
    revalidate: 3600,
  };
}

export default function Home({ channels }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spreadsheet CMS</title>
        <meta name="description" content="Next.js Spreadsheet CMS" />
      </Head>
      <main>
        <div className={styles.wrapper}>
          <div className={styles.sidebar}>
            <div className={styles.scroll}>
              <ul>
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
                <p>左のメニューからチャンネルを選んでください</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
