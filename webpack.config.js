// Requerimos el modulo de path y el html-webpack-plugin que instalamos
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const { config } = require('./src/server/config');

const entry = ['./src/frontend/index.js'];

if (config.dev) {
    entry.push(
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true'
    );
}

// Creamos un modulo que vamos a exportar con la siguiente configuración
module.exports = {
    entry, // Iniciamos por la entrada del proyecto
    mode: config.dev ? 'development' : 'production',
    output: {
        // Definimos donde vamos a guardar los archivos resultantes después de hacer el build
        // __dirname hace referencia al directorio actual y dist es una nueva carpeta que crearemos
        path: path.resolve(__dirname, 'src/server/public'),
        filename: config.dev ? 'assets/bundle.js' : 'assets/bundle-[hash].js', // El nombre del archivo resultante.
        publicPath: '/'
    },
    resolve: {
        // Resuelve las extensiones que vamos a utilizar
        extensions: ['.js', '.jsx']
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: 'async',
            name: true,
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    reuseExistingChunk: true,
                    priority: 1,
                    filename: config.dev
                        ? 'assets/vendor.js'
                        : 'assets/vendor-[hash].js',
                    enforce: true,
                    test(module, chunks) {
                        const name = module.nameForCondition && module.nameForCondition();
                        return chunks.some(chunk => chunk.name !== 'vendors' && /[\\/]node_modules[\\/]/.test(name));
                    }
                }
            }
        }
    },
    // Modulo de reglas necesarias
    module: {
        rules: [
            {
                // Expresión regular para todos los archivos .js o .jsx
                test: /\.(js|jsx)$/,
                // Excluimos los de la carpeta /node_modules/
                exclude: /node_modules/,
                // Usamos el babel-loader que habiamos instalado.
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|gif|jpg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[hash].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    // Se añaden los plugins que usaremos
    plugins: [
        // Creamos una nueva instancia del plugin importado
        new MiniCssExtractPlugin({
            filename: config.dev
                ? 'assets/[name].css'
                : 'assets/[name]-[hash].css'
        }),
        config.dev ? new webpack.HotModuleReplacementPlugin() : () => {},
        config.dev
            ? () => {}
            : new CompressionWebpackPlugin({
                  test: /\.(js|css)$/,
                  filename: '[path].gz'
              }),
        config.dev ? () => {} : new ManifestPlugin()
    ]
};
