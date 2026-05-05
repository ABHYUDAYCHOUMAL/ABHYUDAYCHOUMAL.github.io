/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_FORMSPREE_ID: string;
  readonly VITE_GA_ID: string;
  readonly VITE_RPM_AVATAR_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
