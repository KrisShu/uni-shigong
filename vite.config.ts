import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { loadEnv } from 'vite';
import path from 'node:path';

export default defineConfig(async ({ command, mode }) => {
    // ✅ 此时 command 和 mode 已有正确类型：
    //    command: 'build' | 'serve'
    //    mode: string

    console.log('command, mode -> ', command, mode);

    const { UNI_PLATFORM } = process.env;
    console.log('UNI_PLATFORM -> ', UNI_PLATFORM);

    const env = loadEnv(mode, path.resolve(process.cwd(), 'env'));
    const { VITE_SERVER_BASEURL, VITE_DELETE_CONSOLE, VITE_SHOW_SOURCEMAP } = env;
    console.log('环境变量 env -> ', env);

    return {
        envDir: './env',
        plugins: [uni()],
        resolve: {
            alias: {
                // '@': path.join(process.cwd(), './src'),
                '@': path.resolve(__dirname, './src'),
            },
        },
    };
});
