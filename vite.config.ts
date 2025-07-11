import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default (config: ConfigEnv) => {
  const env = loadEnv(config.mode, process.cwd(), "");

  return defineConfig({
    base: env.VITE_BASE || "/",
    build: {
      outDir: env.VITE_OUT_DIR || "dist",
      sourcemap: true,
    },
    plugins: [react()],
  });
};
