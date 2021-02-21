# Edit Resto Menu

A Full Stack Web App for displaying a restaurant's menu as a staticly generated webpage, which also has an authenticated Admin mode allowing to edit said menu.

It uses the delightful [Next.js](https://nextjs.org) for doing the SSG of the frontend and the mighty [NestJS](https://nestjs.com) for the backend. the UI was created using [Chakra UI](https://chakra-ui.com), and test coverage with [Jest](https://jestjs.io) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Installation

1.) clone repository

2.) go into server folder and yarn

```
cd server
yarn
```

3.) still in server folder, generate a .env from example by running:

```
cp example.env .env
```

OPTIONAL: you might want to generate a hash for a password of your own. you can do that by running the jest test (used as a script here) inside server/src/auth/scripts/generatePasswordHash.spec.ts and copy the result that's displayed on the console to your .env (or just go with the default admin password '12345')

4.) run the server

```
yarn run start:dev
```

5.) change to client folder and yarn

```
cd ../client
yarn
```

6.) still in client folder, generate a .env.local file from example by running:

```
cp example.env .env.local
```

7.) run the client

```
yarn run dev
```

## Usage

when the client loads it starts in view mode (just see the menu). There is a Login button in the footer, which then promps for a password matching the hash from the server's .env file. Send the password and you will be in Edit mode!

## Note on Running tests

each package file (for server and for client) have a script to run the relevant test coverage. Do keep in mind that if you are using some IDE extention for jest (such as jest-test-runner for VS code), you will most likely have to configure the root directory for jest in your IDE's section to /client or /server to run singular tests/files with your plugin.

## Note On project structure

The package of the root folder of the project and the config files along with it (eslintrc, huskyrc, prettierrc, etc) are used to enforce coding standards and conventional commit structure on the server and client folder as one united project. This is only for development purpose.

If you simply intend to run the app and have no intention of commiting more code into it you can safely ignore all the files outside /client and /server

## License

http://adampritchard.mit-license.org/
