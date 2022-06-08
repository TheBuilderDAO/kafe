import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { NextSeo } from 'next-seo';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <NextSeo
            defaultTitle='Kafé by Builder DAO'
            titleTemplate='%s | Kafé by Builder DAO'
          />
        </Head>
        <body className="">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
