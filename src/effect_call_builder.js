import {CallBuilder} from "./call_builder";

/**
 * Creates a new {@link EffectCallBuilder} pointed to server defined by serverUrl.
 * Do not create this object directly, use {@link Server#effects}.
 *
 * @class EffectCallBuilder
 * @extends CallBuilder
 * @[All Effects]
 * @constructor
 * @param {string} serverUrl Horizon server URL.
 */
export class EffectCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('effects');
    }

    /**
     * This endpoint represents all effects that changed a given account. It will return relevant effects from the creation of the account to the current ledger.
     * @[Effects for Account]
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {EffectCallBuilder}
     */
    forAccount(accountId) {
        this.filter.push(['accounts', accountId, 'effects']);
        return this;
    }

    /**
     * Effects are the specific ways that the ledger was changed by any operation.
     *
     * This endpoint represents all effects that occurred in the given ledger.
     * @[Effects for Ledger]
     * @param {number|string} sequence Ledger sequence
     * @returns {EffectCallBuilder}
     */
    forLedger(sequence) {
        if (typeof sequence == 'number') {
            sequence = sequence.toString();
        }
        this.filter.push(['ledgers', sequence, 'effects']);
        return this;
    }

    /**
     * This endpoint represents all effects that occurred as a result of a given transaction.
     * @[Effects for Transaction]
     * @param {string} transactionId Transaction ID
     * @returns {EffectCallBuilder}
     */
    forTransaction(transactionId) {
        this.filter.push(['transactions', transactionId, 'effects']);
        return this;
    }

    /**
     * This endpoint represents all effects that occurred as a result of a given operation.
     * @[Effects for Operation]
     * @param {number} operationId Operation ID
     * @returns {EffectCallBuilder}
     */
    forOperation(operationId) {
        this.filter.push(['operations', operationId, 'effects']);
        return this;
    }
}
