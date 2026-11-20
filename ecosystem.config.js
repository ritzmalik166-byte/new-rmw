/** PM2 config for rmw-frontend on port 3002 */
module.exports = {
    apps: [
      {
        name: "rmw-frontend",
        cwd: "/var/www/rmw-frontend",
        // Run Next directly, not through `npm run start`: PM2 measures the memory of
        // the process it starts, so with npm it only ever saw the ~60MB npm wrapper and
        // max_memory_restart never fired, even when next-server had grown past 1.9GB.
        script: "node_modules/next/dist/bin/next",
        args: "start",
        instances: 1,
        exec_mode: "fork",
        node_args: "--max-old-space-size=2048",
        env: {
          NODE_ENV: "production",
          PORT: "3002",
          // Server-side blog API calls go straight to rmw-backend, skipping nginx.
          BLOG_API_ORIGIN: "http://127.0.0.1:3003",
        },
        // Restart cleanly before the heap (capped at 2GB above) is full and GC stalls the site.
        max_memory_restart: "1400M",
        // Safety net: a fresh process every night at 4am (server clock is IST).
        cron_restart: "0 4 * * *",
      },
    ],
  };
