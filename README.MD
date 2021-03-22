# Stalk_Market
## Overview
Stalk_Market is a Discord Bot designed to make collaborating on turnip sell and buy prices in the Nintendo Switch game, Animal Crossing. Once added to your server, have each user set their time zone and then start recording!

---

## Commands
All commands for this bot should start with "!" 
- `help`
    - Lists all commands, or details about a specific command.
- `set-tz`
    - Sets your timezone. To find your timezone go to http://kevalbhatt.github.io/timezone-picker/
- `set-visitors`
    - Sets whether or not you want visitors to your island to buy/sell turnips. Setting to `true` will allow other users to view your prices and username.
- `get-buy-price`
    -  Gets the most recent purchase price of you, and any mentioned users. Use `@here` or `@everyone` mentions to fetch for enitre guild.
- `get-sell-price`
    - Gets recorded sell prices of you, and any mentioned users.
- `save-buy-price`
    - Inserts or overwrites the price you bought turnips for. If only a price is provided then the date is assumed to be your current date based on your set timezone. Optional date can be given in `YYYY-MM-DD` format. Prices from previous week will be removed every Monday.
- `save-sell-price`
    - Saves the sell price offered on your island for a given day and period. If only a price is provided then the date and period is assumed to be current time based on your set timezone. Optional date `YYYY-MM-DD` and period `am/pm` can be provided by the user.
- `get-settings`
    - Gets settings of user who initiated command.

---

## Screen Captures
### Help
![Alt text](/resources/help.PNG?raw=true "Help")
### Set Timezone
![Alt text](/resources/set-tz.PNG?raw=true "Set Timezone")
### Set Visitors
![Alt text](/resources/set-visitors.PNG?raw=true "Set Visitors")
### Get Buy Price
![Alt text](/resources/get-buy-price.PNG?raw=true "Get Buy Price")
### Get Sell Price
![Alt text](/resources/get-sell-price-self.PNG?raw=true "Get Sell Price")
### Get Sell Price Everyone
![Alt text](/resources/get-sell-price-everyone.PNG?raw=true "Get Sell Price Everyone")
### Save Buy Price
![Alt text](/resources/save-buy-price.PNG?raw=true "Save Buy Price")
### Save Sell Price
![Alt text](/resources/save-sell-price.PNG?raw=true "Save Sell Price")
### Get Settings
![Alt text](/resources/get-settings.PNG?raw=true "Get Settings")