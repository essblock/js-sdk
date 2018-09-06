import {CallBuilder} from "./call_builder";

export class PaymentCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link PaymentCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#payments}.
     * @[All Payments]
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('payments');
    }

    /**
     * This endpoint responds with a collection of Payment operations where the given account was either the sender or receiver.
     * @[Payments for Account]
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {PaymentCallBuilder}
     */
    forAccount(accountId) {
        this.filter.push(['accounts', accountId, 'payments']);
        return this;
    }

    /**
     * This endpoint represents all payment operations that are part of a valid transactions in a given ledger.
     * @[Payments for Ledger]
     * @param {number|string} sequence Ledger sequence
     * @returns {PaymentCallBuilder}
     */
    forLedger(sequence) {
        if (typeof sequence == 'number') {
            sequence = sequence.toString();
        }
        this.filter.push(['ledgers', sequence, 'payments']);
        return this;
    }

    /**
     * This endpoint represents all payment operations that are part of a given transaction.
     * @[Payments for Transaction]
     * @param {string} transactionId Transaction ID
     * @returns {PaymentCallBuilder}
     */
    forTransaction(transactionId) {
        this.filter.push(['transactions', transactionId, 'payments']);
        return this;
    }
}
