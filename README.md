# Abecederies CMS

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/erikologic/react-dynamic-template-demo)  
_Note: use 4 cores!_

A simple CMS demo project:

```
We're a publishing company that only publishes Abecedaries -- that is, children's books of the form "A is for Apple, B is for Banana, ...".  
We need a content management system for these books.  
Books can be layered in a series of "versions."  
Higher layers override the values of lower layers.  
Layers need not be complete, but they cannot be empty.
```

## Stack

-   **NextJs**: to quickly build a web app and a REST API
-   **Prisma + Postgres**: to store the data, with Prisma providing a nice ORM (type safety, migration, sanitisation, etc.)
-   **DevContainer/Codespace**: to provide an easy-to-set-up and sandboxed development environment
-   **Jest/Playwright**: to test the project

## Onboarding

This project uses DevContainer.  
To work on the project, you can use VSCode + Docker (local) or Github Codespaces (cloud).

### DevContainer (local)

DevContainer is a VSCode extension that allows you to run a container with all the project dependencies.  
This is useful to avoid installing all the dependencies on your machine and sandboxing the project from your machine, avoiding dependency conflicts and security issues.

-   Install VSCode and Docker
-   Open this project with VSCode
-   VSCode should recommend you install the DevContainer extension.  
     If not, install it manually.
-   VSCode will ask you to open the project in a container. If it doesn’t, reload the window or find the option in the command palette: `CMD/CTRL + SHIFT + P` -> `Remote-Containers: Reopen in Container.`
-   All the dependencies will be installed, and the project will launch the dev server, unit tests, and the e2e tests runner.  
     _This might take a while the first time._

_Sometimes I noticed some issues when restarting too fast._  
_Make sure to close VSC, wait few secs for the containers to shutdown, and then start again._

### Github Codespaces (cloud)

Github Codespaces is a cloud-based development environment that allows you to work on the project from the browser or VSC without installing anything on your machine.  
This provides for the ultimate sandbox experience, and the ability to contribute into the project from everywhere.

-   Push the repository to GitHub
-   Create a Codespace by following [this guide](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository) or editing this link with the correct OWNER / PROJECT value:

```
https://github.com/codespaces/new/$OWNER/$PROJECT?skip_quickstart=true&machine=standardLinux32gb
```

_Be sure to select a 4+ vCPU machine!_

-   All the dependencies will be installed, and the project will launch the dev server, unit tests, and the e2e tests runner
    _This might take a while._

_Codespaces might not launch the e2e tests runner automatically._  
_In that case, from the terminal panel, open the "Browser test UI" task and click on the http://0.0.0.0:PORT link._

### Manual setup

If you prefer to set up the project manually, you can follow these steps:

-   Install NodeJs
-   Install PostgreSQL - expose the DB connection string as `DATABASE_URL` in the environment
-   Install Playwright dependencies: `npx playwright install-deps`
-   Run the setup script: `./setup.sh`

Then:

-   Run the dev server: `npm run dev`
-   Run the tests: `npm test`
-   Run the e2e tests: `npm run test:e2e:ui`

## Design

The project provides three ways to interact with the CMS:

### Internal library

`src/cms/cms.ts`  
A library to interact with the CMS intended for internal use.  
The library is tested in integration with a local PostgreSQL database.

### REST API

`src/app/api/*`  
A REST API written in NextJs is designed to offer a public interface to interact with the CMS library.  
The endpoints expect an "Authorization" header with a valid token, which will provide details of the user.  
This could be integrated with a system like [Auth0 M2M tokens](https://auth0.com/blog/using-m2m-authorization/), using temporary session tokens for CLI or other type of clients.  
The endpoints are tested indirectly from the E2E browser tests.

### Web App

`src/app/*`  
A NextJs app that provides a GUI to interact with the CMS library through the REST API.  
The app happy path is tested with Playwright.

## Scaling up considerations

My previous manager has a handy architectural quality mnemonic: [MUSTAPO](https://www.codefiend.co.uk/mustapo-architecture-qualities-list/).

### Modifiability

The project badly needs a CI/CD to guarantee that we can deploy our changes safely in production anytime.  
GitHub Actions would be good enough, e.g.:

-   [Run tests](https://github.com/erikologic/nextjs13-template-vercel/blob/main/.github/workflows/playwright.yml)
-   [Deploy to Vercel](https://github.com/erikologic/nextjs13-template-vercel/blob/main/.github/workflows/deploy_vercel.yml)

The project is designed from the ground up to be well-testable and, therefore, easy to maintain and extend.

If the product evolves, the domain is likely to be extensive, and it should be split into more meaningful subdomains (with or without the proper architectural boundaries).

### Usability

Currently, the system lacks a production environment, so it is only usable locally.  
Vercel should be easy to set up, including providing a serverless solution to run NextJs and PostgreSQL in the cloud.

The system is designed to be pretty usable by different classes of users:

-   internal, with the library
-   external machines and humans, with the REST API
-   external humans, with the Web App

The system is not designed to support teams/organisations, which is a feature that should be prioritised.

Also, at some scale we should expect multiple users operating on the same books, and therefore things like locking and optimistic concurrency should be taken into consideration.  
For example, we would only allow appending layers against a specific last layer id, and if we understand that the layer has been updated in the meantime, we would reject the operation.
The Web App should be revisited as well to support real time updates, or at least a polling mechanism.

The Web App is tested with Playwright using implicit attributes whenever possible, which should help support different type of browser users.  
More could be done, e.g. testing with tools like Axe.

The Web App is also designed with a mobile-first approach, so it should be easy to use on a small device.

Also, although functional, the Web App could be more visually appealing.  
Plus, dark mode!

The REST API could offer some specifications, e.g., OpenAPI, to help consumers understand how to interact.

We could create a CLI client to allow easier consumption for users who prefer the terminal.

Last but not least, rate control - _I am not sure if it is a usability thing!_  
The system is not designed to support rate control, which should be another priority.

### Security

Auth is missing, and it should be the top priority.  
Auth0 should be an easy drop-in solution for the REST API and the Web App.  
NextAuth could be a cheaper alternative, but it might be time-consuming to integrate with SSO providers.

The Web App lacks CSP directives.  
XSS is not possible because the Web App cookie is HttpOnly.

Validation of the REST API is poor, and it should be improved.  
Prisma should prevent SQL injection anyway.

Vercel provides DDOS attack protection.  
If we move to other clouds, this should be revalued.

### Testability

As mentioned above, the project is designed to be testable from the ground up.  
Not all paths are covered, but this is good enough for the scope of this demo.

### Availability

I suggest using serverless technologies for as long as possible to guarantee several 9s of uptime under various loads with minimal engineering effort.

### Performance

Serverless should provide enough scalability for the server.  
We should consider moving into AWS in the long term, perhaps deploying on ECS.

For the database, we could gradually improve scalability by:

-   query optimisation: e.g. the displayBookAtLayer query ATM fetches all the layers contents for a particular book and aggregates server side - this could be optimised with a query that performs the aggregation inside the DB,
-   vertical scaling,
-   horizontal scaling: I am not sure if Vercel would support that, perhaps it would require migrating into Supabase or AWS RDS,
-   sharding: e.g. perhaps the data is well suited to be partitioned at customer/organisation

### Observability

Vercel provides some logging and metrics.  
We are flying blind regarding client-side errors and alarming in general.  
I suggest adding Sentry or a similar error reporting on both the client and server side ASAP.

In the long term, I had a good experience with OpenTelemetry and HoneyComb and would suggest using it to:

-   collect telemetries from servers and clients
-   create dashboards to show the health of the system, but also to understand the usage patterns and monitor the performance
-   create alerts to be notified when something goes wrong

HoneyComb is particularly good at creating aggregation from "fat granular events" and moving quickly between "the forest and the trees", e.g.:

-   create a time series showing the resource consumption (e.g. duration ms) between the various customers
-   clicking on the time series would allow us to break apart further the details of that aggregation, e.g. which endpoint was the most consuming
-   from there, we could enter into a detailed trace to explore which calls were particularly costly, including across a multi-layered system

## AI & I

I used ChatGPT to clarify the requirements a bit, asking perhaps to rephrase some sentences.  
I also quickly discussed technology choices to understand solutions, but went corroborating with the actual documentation.  
I use Copilot extensively in my coding sessions, mostly as a smart code completion tool, but also from time to time to solve low/mid-maybe complexity problems.

My approach with LLMs is to use them as a surrogate pair/team member whom to bounce ideas and get feedback, but also sometimes for clarifying and summarising informations.  
I'm aware of hallucination and their limitations in reasoning, so I try to use them for their best capabilities: summarisation and interpolation.
