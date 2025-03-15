import path from 'node:path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

const mode = 'development';

const devServer: DevServerConfiguration = {
  open: true,
  host: 'localhost',
  port: 3000,
  historyApiFallback: true,
  hot: true,
};

const config: Configuration = {
  mode,
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new Dotenv({
      path: './.env.local',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      title: 'RideRadar',
    }),
    new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-refresh/babel'],
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: true,
                localIdentName: '[name]_[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      },
    ],
  },
  devServer,
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

export default config;
