import axios from 'axios';
import URI from 'urijs';
import isString from "lodash/isString";
import pick from "lodash/pick";
import {Config} from "./config";
import {Account, StrKey} from './ess-base';
import {BadResponseError} from './errors';
import {EssTomlResolver} from "./ess_toml_resolver";

// FEDERATION_RESPONSE_MAX_SIZE is the maximum size of response from a federation server
export const FEDERATION_RESPONSE_MAX_SIZE = 100 * 1024;

/**
 * FederationServer handles a network connection to a
 * [federation server]
 * instance and exposes an interface for requests to that instance.
 * @constructor
 * @param {string} serverURL The federation server URL (ex. `https://acme.com/federation`).
 * @param {string} domain Domain this server represents
 * @param {object} [opts]
 * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments! You can also use {@link Config} class to set this globally.
 * @param {number} [opts.timeout] - Allow a timeout, default: 0. Allows user to avoid nasty lag due to TOML resolve issue. You can also use {@link Config} class to set this globally.
 */
export class FederationServer {
  constructor(serverURL, domain, opts = {}) {
    // TODO `domain` regexp
    this.serverURL = URI(serverURL);
    this.domain = domain;

    let allowHttp = Config.isAllowHttp();
    if (typeof opts.allowHttp !== 'undefined') {
        allowHttp = opts.allowHttp;
    }

    this.timeout = Config.getTimeout();
    if (typeof opts.timeout === 'number') {
      this.timeout = opts.timeout;
    } 

    if (this.serverURL.protocol() != 'https' && !allowHttp) {
      throw new Error('Cannot connect to insecure federation server');
    }
  }

  /**
   * This method is a helper method for handling user inputs that contain `destination` value.
   * It accepts two types of values:
   *
   * * For ess address (ex. `bob*ess.org`) it splits Ess address and then tries to find information about
   * federation server in `ess.toml` file for a given domain. It returns a `Promise` which resolves if federation
   * server exists and user has been found and rejects in all other cases.
   * * For Account ID (ex. `GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS`) it returns a `Promise` which
   * resolves if Account ID is valid and rejects in all other cases. Please note that this method does not check
   * if the account actually exists in a ledger.
   *
   * Example:
   * ```js
   * EssSdk.FederationServer.resolve('bob*Ess.org')
   *  .then(federationRecord => {
   *    // {
   *    //   account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS',
   *    //   memo_type: 'id',
   *    //   memo: 100
   *    // }
   *  });
   * ```
   * It returns a `Promise` that will resolve to a JSON object with following fields:
   * * `account_id` - Account ID of the destination,
   * * `memo_type` (optional) - Memo type that needs to be attached to a transaction,
   * * `memo` (optional) - Memo value that needs to be attached to a transaction.
   *
   * The Promise will reject in case of any errors.
   *
   * @param {string} value Ess Address (ex. `bob*ess.org`)
   * @param {object} [opts]
   * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
   * @param {number} [opts.timeout] - Allow a timeout, default: 0. Allows user to avoid nasty lag due to TOML resolve issue.
   * @returns {Promise}
   */
  static resolve(value, opts = {}) {
    // Check if `value` is in account ID format
    if (value.indexOf('*') < 0) {
      if (!StrKey.isValidEd25519PublicKey(value)) {
        return Promise.reject(new Error('Invalid Account ID'));
      } else {
        return Promise.resolve({account_id: value});
      }
    } else {
      let addressParts = value.split('*');
      let [,domain] = addressParts;

      if (addressParts.length != 2 || !domain) {
        return Promise.reject(new Error('Invalid Ess address'));
      }
      return FederationServer.createForDomain(domain, opts)
        .then(federationServer => federationServer.resolveAddress(value));
    }
  }

  /**
   * Creates a `FederationServer` instance based on information from [ess.toml]file for a given domain.
   * Returns a `Promise` that resolves to a `FederationServer` object. If `ess.toml` file does not exist for a given domain or it does not contain information about a federation server Promise will reject.
   * ```js
   * EssSdk.FederationServer.createForDomain('acme.com')
   *   .then(federationServer => {
   *     // federationServer.resolveAddress('bob').then(...)
   *   })
   *   .catch(error => {
   *     // ess.toml does not exist or it does not contain information about federation server.
   *   });
   * ```
   * @param {string} domain Domain to get federation server for
   * @param {object} [opts]
   * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
   * @param {number} [opts.timeout] - Allow a timeout, default: 0. Allows user to avoid nasty lag due to TOML resolve issue.
   * @returns {Promise}
   */
  static createForDomain(domain, opts = {}) {
    return EssTomlResolver.resolve(domain, opts)
      .then(tomlObject => {
        if (!tomlObject.FEDERATION_SERVER) {
          return Promise.reject(new Error('ess.toml does not contain FEDERATION_SERVER field'));
        }
        return new FederationServer(tomlObject.FEDERATION_SERVER, domain, opts);
      });
  }

  /**
   * Returns a Promise that resolves to federation record if the user was found for a given Ess address.
   * @param {string} address Ess address (ex. `bob*ess.org`). If `FederationServer` was instantiated with `domain` param only username (ex. `bob`) can be passed.
   * @returns {Promise}
   */
  resolveAddress(address) {
    if (address.indexOf('*') < 0) {
      if (!this.domain) {
        return Promise.reject(new Error('Unknown domain. Make sure `address` contains a domain (ex. `bob*ess.org`) or pass `domain` parameter when instantiating the server object.'));
      }
      address = `${address}*${this.domain}`;
    }
    let url = this.serverURL.query({type: 'name', q: address});
    return this._sendRequest(url);
  }

  /**
   * Returns a Promise that resolves to federation record if the user was found for a given account ID.
   * @param {string} accountId Account ID (ex. `GBYNR2QJXLBCBTRN44MRORCMI4YO7FZPFBCNOKTOBCAAFC7KC3LNPRYS`)
   * @returns {Promise}
   */
  resolveAccountId(accountId) {
    let url = this.serverURL.query({type: 'id', q: accountId});
    return this._sendRequest(url);
  }

  /**
   * Returns a Promise that resolves to federation record if the sender of the transaction was found for a given transaction ID.
   * @param {string} transactionId Transaction ID (ex. `3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889`)
   * @returns {Promise}
   */
  resolveTransactionId(transactionId) {
    let url = this.serverURL.query({type: 'txid', q: transactionId});
    return this._sendRequest(url);
  }

  _sendRequest(url) {
    let timeout = this.timeout;

    return axios.get(url.toString(), {maxContentLength: FEDERATION_RESPONSE_MAX_SIZE, timeout})
      .then(response => {
        if (typeof response.data.memo != "undefined" && typeof response.data.memo != 'string') {
          throw new Error("memo value should be of type string");
        }
        return response.data;
      })
      .catch(response => {
        if (response instanceof Error) {
          if (response.message.match(/^maxContentLength size/)) {
            throw new Error(`federation response exceeds allowed size of ${FEDERATION_RESPONSE_MAX_SIZE}`);
          } else {
            return Promise.reject(response);
          }
        } else {
          return Promise.reject(new BadResponseError(`Server query failed. Server responded: ${response.status} ${response.statusText}`, response.data));
        }
      });
  }
}
