export type Env = {
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  WEBPACK_SERVE?: boolean;
  production?: boolean;
  development?: boolean;
  isMinikube?: boolean;
  CI_URL?: string;
  ENVNAME?: string;
};
