# Outdoor Road TT Prediction Tool

## Client

[Create React App](https://create-react-app.dev/) was used to create the intitial client. It is a tool that creates starter page and sets up the build system. Take a look at [Getting Started](https://create-react-app.dev/docs/getting-started) to understand the folder structure and how it works.

### Dev dependencies
- NPM v14 or higher

Full instructions on installing and running NPM are in the [wiki](https://github.cs.adelaide.edu.au/a1225127/CYCOUT3/wiki/How-to-setup-the-client).


## Backend

### PostgreSQL
[PostgreSQL](https://www.postgresql.org/) was used to create the database for user information. The instructions on how to setup PostgreSQL can be found [here](https://www.postgresql.org/download/)

Once PostgreSQL is installed and running to load the database use:
```psql cycout3 < cycout3Database.sql```

To backup any changes to the database use:
```pg_dump cycout3 > cycout3Database.sql```
