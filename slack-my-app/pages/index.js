import Head from "next/head";
import styles from "../styles/Home.module.css";

import { getContents } from "../lib/spreadsheet";

export async function getStaticProps() {
  const contents = await getContents();
  return {
    props: { contents },
    revalidate: 3600,
  };
}

export default function Home({ contents }) {
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
      </main>
    </div>
  );
}
