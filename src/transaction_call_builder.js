import { CallBuilder } from "./call_builder";

/**
 * Creates a new {@link TransactionCallBuilder} pointed to server defined by serverUrl.
 * Do not create this object directly, use {@link Server#transactions}.
 *
 * @class TransactionCallBuilder
 * @extends CallBuilder
 * @see [All Transactions]
 * @constructor
 * @param {string} serverUrl Horizon server URL.
 */
export class TransactionCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('transactions');
    }

    /**
     * The transaction details endpoint provides information on a single transaction. The transaction hash provided in the hash argument specifies which transaction to load.
     * @see [Transaction Details]
     * @param {string} transactionId Transaction ID
     * @returns {TransactionCallBuilder}
     */
    transaction(transactionId) {
        this.filter.push(['transactions', transactionId]);
        return this;
    }

    /**
     * This endpoint represents all transactions that affected a given account.
     * @see [Transactions for Account]
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {TransactionCallBuilder}
     */
    forAccount(accountId) {
        this.filter.push(['accounts', accountId, 'transactions']);
        return this;
    }

    /**
     * This endpoint represents all transactions in a given ledger.
     * @see [Transactions for Ledger]
     * @param {number|string} sequence Ledger sequence
     * @returns {TransactionCallBuilder}
     */
    forLedger(sequence) {
        if (typeof sequence == 'number') {
            sequence = sequence.toString();
        }
        this.filter.push(['ledgers', sequence, 'transactions']);
        return this;
    }
}
