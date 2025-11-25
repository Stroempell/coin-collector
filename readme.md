# Coin collector project

## Features
This project is specifically tailored for users that collect 2 euro coins.  
Users can do the following, and navigate to those pages with a bottom tab bar:

### Home screen
- Added statistics on the home page

### Countries screen
- View all countries (incl. EU) and see how many coins you have per country.
  - Search for specific countries with the search bar (EU is always active)
  - **Swipe down to refresh the page**
- View coins from a specific country (or all, if clicked on EU)
  - See year, country, picture and amount per coin
  - Go back with the device back button, or with the header
  - Sort by year (high to low, low to high)
  - Filter by year (choose one or more years)
  - **Swipe down to refresh the page**

- Click on a coin to see more information. 
  - Edit the quality of your owned coin. (Is it in a bad state, exceptional,...). 
  - You can also add and remove how many coins of this type you own. 
  - You can save or cancel changes
  - You can make the image bigger if you press on it (and smaller if you press again).
  - You can add a custom picture for each coin (and reset it afterwards)
  - Go back with the device back button, or with the header (or cancel)
- All coins that you don't own, are grayed out. If you own at least one coin of a specific type, they get colored in.  

### Map screen
- Added interactive map for all euro countries
  - Countries with no coins are in gray
  - Countries start at light blue and become more 


### Video showcase
- [Video version 0.1 - download if on github](./demo/v01.mp4)
- [Video version 0.2 - download if on github](./demo/v02.mp4)
- [Video version 0.3 - download if on github](./demo/v03.mp4)
- [Video version 0.4 - download if on github](./demo/v04.mp4)
- [Video version 0.5 - download if on github](./demo/v05.mp4).  Note: this is only for features added in v0.5. also look at v0.4.


## Upcoming features
- **Offline functionality: cache images - library: react-native-fast-image**
- "Favorite" coins - similar to wishlist 

## Technologies/libraries used
- React
- React native
- React native paper
- React native safe area context
- React navigation (both bottom-tabs and stack)
- React native picker
- React native element dropdown
- Expo image picker
- React native svg
- React native svg pan zoom
- SQLite
- RESTful API (Back-end is made with java spring boot - see github repo below)

## Note
The [API](https://github.com/Stroempell/coin-api) used for this app was also made by myself. Currently, it's only used for local use. When all data is in the database, it will be available to the internet. 

