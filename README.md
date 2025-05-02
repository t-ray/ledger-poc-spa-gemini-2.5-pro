# Ledger

This application is a simple attempt at emulating a manual process I use today to track transactions across my various accounts. It is intended to be a playground and learning opportunity for myself, both to jump into front end development, as well as exploring the capabilities of AI / Agentic tools. For anyone interested in the background / see [ths post](https://dev.to/thutch1976/the-application-candidate-personal-ledger-1bp3). It is a SPA implemented in React, and is intended to be run from the desktop/developer's workstation.

Since this is mostly for personal use, it uses US based formatting (dates, monetary amounts) and there are no plans to support any i18n or customization, nor any plans for mobile friendly views.

## Initial Version
The initial version of this code was generated from Gemini 2.5 Pro, as I have documented [here](https://dev.to/thutch1976/letting-ai-build-my-frontend-a-tale-of-two-chatbots-8no). The stack is React with Vite, the standard react router, browser local storage for persistence, and it uses Material for the styling.

### Workspace Setup & Execution
Assuming you have a working node environment (I'm unsure on specific version requirements), it should be as easy as:
```shell
npm install
npm run dev
```
And the page should nominally be available locally on [port 5137](http://localhost:5173/).

## Data Model & Workflow
The basic data model is described in the [data model prompt document](https://github.com/t-ray/ledger-poc-spa-gemini-2.5-pro/blob/main/prompts/domain-model.md). At a very high level, there are three entities: Accounts, Categories, and Transactions. Since the application emulates a manual process incorporating a spreadsheet, the application will favor fast data entry and keyboard use.