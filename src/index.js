require('es6-promise').polyfill();

// ess-sdk classes to expose
export * from "./errors";
export {Config} from "./config";
export {Server} from "./server";
export {FederationServer, FEDERATION_RESPONSE_MAX_SIZE} from "./federation_server";
export {EssTomlResolver, ESS_TOML_MAX_SIZE} from "./ess_toml_resolver";

// expose classes and functions from ess-base
export * from "./ess-base";

export default module.exports;
