import {CallBuilder} from "./call_builder";

/**
 * Creates a new {@link OperationCallBuilder} pointed to server defined by serverUrl.
 * Do not create this object directly, use {@link Server#operations}.
 *
 * @ [All Operations]
 * @class OperationCallBuilder
 * @constructor
 * @extends CallBuilder
 * @param {string} serverUrl Horizon server URL.
 */
export class OperationCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('operations');
    }

    /**
     * The operation details endpoint provides information on a single operation. The operation ID provided in the id
     * argument specifies which operation to load.
     * @ [Operation Details]
     * @param {number} operationId Operation ID
     * @returns {OperationCallBuilder}
     */
    operation(operationId) {
        this.filter.push(['operations', operationId]);
        return this;
    }

    /**
     * This endpoint represents all operations that were included in valid transactions that affected a particular account.
     * @ [Operations for Account]
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {OperationCallBuilder}
     */
    forAccount(accountId) {
        this.filter.push(['accounts', accountId, 'operations']);
        return this;
    }

    /**
     * This endpoint returns all operations that occurred in a given ledger.
     *
     * @[Operations for Ledger]
     * @param {number|string} sequence Ledger sequence
     * @returns {OperationCallBuilder}
     */
    forLedger(sequence) {
        if (typeof sequence == 'number') {
            sequence = sequence.toString();
        }
        this.filter.push(['ledgers', sequence, 'operations']);
        return this;
    }

    /**
     * This endpoint represents all operations that are part of a given transaction.
     * @[Operations for Transaction]
     * @param {string} transactionId Transaction ID
     * @returns {OperationCallBuilder}
     */
    forTransaction(transactionId) {
        this.filter.push(['transactions', transactionId, 'operations']);
        return this;
    }
}
