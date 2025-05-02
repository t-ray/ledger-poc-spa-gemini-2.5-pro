## Background
All transactions for an account are listed in a table/grid. This grid will function just like a spreadsheet. This page will only show transactions for a single account at a time; there should be a drop down above the table to list all accounts, and default to the first account. If there are no accounts, the transactions will be empty.

## Table layout
The table will have the following columns labels, in order, mapped to their datasource:
* Account -> transacton.accountId
* Id -> transaction.displayId
* Date -> transaction.date
* Amount -> transaction.amount
* Balance -> cumulative total of all prior transactions for the account
* Vendor -> transaction.vendor
* Digits -> transaction.digits
* Type -> transaction.type
* Category -> Category dereferenced by transaction.categoryId
* Subcategory -> transaction.subCategory
* Notes -> transaction.notes
* Income -> transaction.isIncome
* Fixed -> transaction.isFixed
* Spend -> transaction.isSpend

## Formatting & Field Requirements
* Account: read only. 
* Id: read only. Formatted with leading 0's, up to 8 digits
* Date: Editable. Required. formatted as mm/dd/yyyy, for display. When editing, no formatting is applied.
* Amount: Editable. Required. formatted as money, to two decimal places, for display. When editing, no formatting is applied. For display, include the $ symbol. Allow negative values.
** negative values should be surrounded by Parenthesis ()
** For zero values, use double dashes
* Balance: read only. Formatted as money, to two decimal places. For display, include the $ symbol
** negative values should be surrounded by Parenthesis ()
** For zero values, use double dashes
* Vendor: editable. Required. 
* Digits: editable. Optional.
* Type: editable. required. Rendered as a dropdown. Default to first Type.
* Category: editable. required. Rendered as a dropdown. Default to first Category.
* Subcategory: editable. Optional. 
* Notes: editable. Optional.
* Income: editable. Required. Rendered as checkbox. Default as unchecked.
* Fixed: editable. Required. Rendered as checkbox. Default as unchecked.
* Spend: editable. Required. Rendered as checkbox. Default as unchecked.

## Common Formatting Requirements
All fields will have zero overflow; if content goes beyond container bounds, content is truncated. Full cell value should be visible when mouse hovering over the cell.

## Row Rendering
* The table will show all transactions for the parent account, ordered by transaction.displayId
* cells will have a light thun border. The cell with the focus shall have a blue border, slightly thicker. 
* After all existing transaction rows are rendered, there should be a placeholder row at the bottom to allow for new transaction entry. This New Row should have all empty values, until a cell is entered, then use the appropriate default value for that field.

## Cell validation:
* Date: must be a valid date. Cannot be in the future. Cannot be before a prior transaction. 
* Amount: positive or negative value. 
* Vendor: not empty.

## New row functionality
When entering the New Row, the following default values should be used:
* Date - the last transaction's date
* display id - one greater than the last transaction display id
* Balance: the running balance of the account (sum of all transaction amounts)

## Navigation
* This is a spreadsheet, so typical spreadsheet navigation should be used
* tab moves to the next field on the same row. Tabbing beyond the end of the row should cycle to the first field.
* shift tab moves to the previous field on the same row. Reverse tabbing before the first cell should cycle to the last cell of the row.
* When entering a cell, cell should become editable (except for readonly cells), populated with value from transaction. 
* When exiting a cell that is being edited (by clicking, or pressing enter, or tab, or arrows) validate the cell, and store value in transaction.
* Left / Right arrow keys should move focus to next / previous cell.
* Up arrow should move focus to prior row, if any.
* Down arrow should move focus to next row, if any.
* Enter key should accept edited and validated value for current cell, but remain on current row.
** If pressing enter on New Row and all fields pass validation, the new row should be added as a new transaction for the account. The transaction row should be added to the table, with the New Transaction row being rendered after it.
* Checkboxes should inverse state with the press of the Spacebar key.
* In cells that have dropdowns, if in edit mode, the Down arrow should display the contents of the drop down.
* Pressing Escape should exit the edit mode (if active), and discard any edits to that cell.

## Other
The "New Row" should always be visible. The user should not need to press a + button to add a new row. And it should have a constant height, the same as all rows. 