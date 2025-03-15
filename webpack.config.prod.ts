import path from 'node:path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration, DefinePlugin } from 'webpack';

const mode = 'production';

const config: Configuration = {
  mode,
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new DefinePlugin({
      'process.env.HSL_API_SUBSCRIPTION_TOKEN': JSON.stringify(
        process.env.HSL_API_SUBSCRIPTION_TOKEN,
      ),
      'process.env.HSL_MQTT_HOST': JSON.stringify(process.env.HSL_MQTT_HOST),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      title: 'RideRadar',
    }),
    new MiniCssExtractPlugin(),
  ],
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
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
  devtool: false,
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

export default config;
