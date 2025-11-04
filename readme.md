# Coin collector project

## Features
This project is specifically tailored for users that collect 2 euro coins.  
Users can do the following, and navigate to those pages with a bottom tab bar:

### Home screen
Nothing yet

### Countries screen
- View all countries (incl. EU) and see how many coins you have per country.
  - **Search for specific countries with the search bar** (EU is always active)
- View coins from a specific country (or all, if clicked on EU)
  - See year, country, picture and amount per coin
  - Go back with the device back button, or with the header
  - **Sort by year (high to low, low to high)**
  - **Filter by year (choose one or more years)**
- Click on a coin to see more information. 
  - Edit the quality of your owned coin. (Is it in a bad state, exceptional,...). 
  - You can also add and remove how many coins of this type you own. 
  - You can save or cancel changes
  - Added textbox for full name - was cut off before
  - Page is now scrollable
  - Go back with the device back button, or with the header (or cancel)
- All coins that you don't own, are grayed out. If you own at least one coin of a specific type, they get colored in.  
  
~~-- Temporary --~~
- ~~Buttons that refresh the coins (read: refresh from the API. This also happens every time the screen is rendered.)~~
- ~~Reset the database. To receive coins again from the API, click the "Refresh coins" button.~~
- ~~Check database (outputs SQLite database to console)~~

### Video showcase
- [Video version 0.1 - download if on github](./demo/v01.mp4)
- [Video version 0.2 - download if on github](./demo/v02.mp4)
- [Video version 0.3 - download if on github](./demo/v03.mp4)


## Upcoming features
- ~~Sort coins per year~~ -> implemented in v0.3
- Offline functionality: cache images - library: react-native-fast-image
- "Favorite" coins - similar to wishlist 
- ~~Search for coins/countries~~ -> implemented in v0.3
- Picture of your coin

## Technologies used
- React
- React native
- React native paper
- React native safe area context
- React navigation (both bottom-tabs and stack)
- React native picker
- React native element dropdown
- SQLite
- RESTful API (Back-end is made with java spring boot - see github repo below)

## Note
The [API](https://github.com/Stroempell/coin-api) used for this app was also made by myself. Currently, it's only used for local use. When all data is in the database, it will be available to the internet. 

