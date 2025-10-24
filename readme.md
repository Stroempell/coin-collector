# Coin collector project

## Features
This project is specifically tailored for users that collect 2 euro coins.  
Users can do the following, and navigate to those pages with a bottom tab bar:

### Home screen
Nothing yet

### Coins screen
- View all coins available from the API. On the front page, the country, name, year and image is visible. Underneath, the amount of coins you own is visible.
- Click on a coin to see more information. Also, edit the quality of your owned coin. (Is it in a bad state, exceptional,...). You can also add and remove how many coins of this type you own. 
- All coins that you don't own, are grayed out. If you own at least one coin of a specific type, they get colored in.  
  
-- Temporary --  
- Buttons that refresh the coins (read: refresh from the API. This also happens every time the screen is rendered.)
- Reset the database. To receive coins again from the API, click the "Refresh coins" button.
- Check database (outputs SQLite database to console)

### Video showcase
[Video version 0.1](./demo/v01.mp4)

## Upcoming features
- See coins per year / country
- Sort coins per year / country
- Overview of how many coins you own out of all types
- 

## Technologies used
- React
- React native
- React native paper
- React native safe area context
- React navigation (both bottom-tabs and stack)
- React native picker
- SQLite
- RESTful API

## Note
The [API](https://github.com/Stroempell/coin-api) used for this app was also made by myself. Currently, it's only used for local use. When all data is in the database, it will be available to the internet. 

