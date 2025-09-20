import type { NextPage } from "next";
import Head from "next/head";
import styles from "../views/home/styles.module.css";
import Link from "next/link";

const NotFound: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1624] text-white flex flex-col">
      <Head>
        <title>404 – Page Not Found | SoulMinter</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-xl w-full text-center py-12">
          <h1 className={`${styles.title} mb-4`}>404 – Page Not Found</h1>
          <p className="text-lg text-gray-300 mb-6">
            Oops! The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="block mt-2 text-lg text-gray-300 mb-6">
            This could be because:
            <ul className="list-disc list-inside text-left text-gray-400 mt-2">
              <li>The link is outdated or mistyped</li>
              <li>The page was removed or renamed</li>
              <li>You followed a broken or expired bookmark</li>
            </ul>
          </div>
          <div className="block mt-4 text-lg text-gray-300 mb-6">
            If you believe this is an error, please contact support or try searching from the homepage.
          </div>
          <Link href="/" legacyBehavior>
            <a className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity">
              Go to Homepage
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound; 