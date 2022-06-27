# Time Tracker App

Web app that lets Brown University students track, visualize, and compare how much time they spend on specific classes.

## Installation (old, TODO: refactor/delete)

Note: Need to run npm install --legacy-peer-deps to install all the packages correctly.

Instructions for running:

Cd into the frontend folder, run npm install --legacy-peer-deps, and run npm start to start the project on localhost.
Once you navigate to <http://localhost:3000/> after starting the project, you have to log in with a Brown email account via Google. Make sure your browser isn't synced to a non-Brown account, there is a bug with cookies that will not let you log in even after using a Brown account on such a browser.
Once you log in, feel free to explore the app!

[Link to specification doc](https://docs.google.com/document/d/1-4vN-JAWkxuEgbfgH7grE6NJB9olHplzaCyPqajYEyM/)

## Tech Stack

- Firebase
- Next.js
- React
- Tailwind CSS
- Selenium and Java

## Getting Started (frontend)

Note: make sure you have [**Node.js**](https://nodejs.org/en/) installed.

First, clone the repository:

```bash
git clone https://github.com/Mitchman215/TimeTracker.git
```

Then, install the frontend dependencies:

```bash
cd TimeTracker/frontend
npm install --legacy-peer-deps
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributors

Time Tracker started as a term project for a [software engineering class](http://cs.brown.edu/courses/csci0320/)
at Brown University contributed to by
[Stewart Morris](https://github.com/stew2003),
[Nicky Yarnall](https://github.com/nickyy96),
[Sid Boppana](https://github.com/AskSid),
[Tim DeSimone](https://github.com/TimD123),
[Melvin He](https://github.com/melvinhe),
and [Mitchell Salomon](https://github.com/Mitchman215).

Presently, development has been continued primarily by [Mitchell Salomon](https://github.com/Mitchman215). Any feedback or pull requests are welcomed.

"dependencies": {
      "next": "12.1.6",
      "react": "18.1.0",
      "react-dom": "18.1.0"
    },
    "devDependencies": {
      "@types/node": "17.0.35",
      "@types/react": "18.0.9",
      "@types/react-dom": "18.0.4",
      "eslint": "8.16.0",
      "eslint-config-next": "12.1.6",
      "typescript": "4.6.4"
