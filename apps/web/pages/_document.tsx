import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html className="m-0 p-0 box-border">
        <Head>
          <meta
            property="og:image"
            content="https://figment.io/wp-content/uploads/2019/08/figment-networks-logo.jpg"
          />
          <meta property="og:url" content="https://learn.figment.io/" />
        </Head>
        <body className="">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
