I a modeling a process that today is 100% manual. Right now I track all of my transactions in a spreadsheet.  I have one spreadsheet per calendar year, and within the spreadsheet, I have separate sheets per account. For example, I have an account for my checking, savings, a tab for my online savings account, and tabs for each credit card. A few times a week I log into each institutions website, and manually enter the transactions into the spreadsheet. This allows me to maintain supervision over all of the transactions. I have been able to unify the model for all accounts.


Let me explain the model within the spreadsheet. These are the columns:

* Account - this is an alphanumeric that by convention is a prefix of the financial institution followed by the last X significant digits of the account number: example: `PNC0906`. Required.

* ID - this is a numeric value with leading zeroes (currently a total of 8 digits), that is monotonically increasing. Each transaction is one greater than the previous. The first transaction will always be `00000001` (or later, if importing data). Required.

* Date - the date the transaction was cleared/posted. Required

* Amount - this is the amount of the transaction, formatted in US dollars, to two decimal places. Required.

* Balance - this is the balance of the account, which is the sum of the previous row's balance and the current row's transaction amount. Formatted in US dollars, to two decimal places. Required.

* Vendor - a simple string description of the vendor for the charge. Required.

* Digits - a numeric value that contains the last X significant digits if there is an associated card (debit, credit), or the last X significant of the account number. I use it to track the card number, because the card number can change over time for the same account. This value is optional, but will most often be present. It may not be present for income/deposits or payments.

* Type - describes the type of the transaction, from an enumerated list. I will provide the enumerated values later. Required.

* Category - allows the user to assign the transaction to a single category. Required. The category could be treated as an enumerated value, but categories can change over time, so this should ultimately come from a user-specific list.

* Subcategory - similar to category; it allows further categorization for more differentiation at reporting time. Optional. Values should either be free form, or from a user specified list.

* Notes - free string. Optional.

* Income - indicates the transaction is income (or possibly a refund). Boolean. Required.

* Fixed - indicates the transaction is a fixed or recurring expense, so the interval is not specified. Boolean. Required.

* Spend - indicates the transaction should count as spending. It's possible
* that a transaction may deduct from the overall amount, but not count as
* spending, such as a payment from a checking account to a credit card.
* Boolean. Required.

These are the attributes for transactions. In addition to transactions, there should be types for Categories and for Accounts. 

The Category type is simple - it's just a simple id/name (string) pair.

For the Account type:
* id - this is the same value used as the Id column in the transaction type, required.
* Name: string. required. 

* Modifier: an enumerated value of "positive" and "negative". This field indicates if the `Balance` transaction column should apply a -1 modifier; this would be a boolean setting. For example, for checking accounts, positive values in the Amount column would be deductions from the Balance column. For credit cards, positive Amount values would be additions to the Balance column. 

