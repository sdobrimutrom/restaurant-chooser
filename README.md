# RestaurantChooser
*A group decision-making app for restaurant selection with veto power and smart filtering*
## Introduce
RestaurantChoose is an app that allows members to efficiently choose a restaurant, combining user preferences, restaurant ratings, and a veto mechanism to reach a final consensus. 
#### Functional features include:
+ Management member and restaurant information.
+ Pre-filter by restaurant Star rating, price, delivery or not and cuisine.
+ Random selection of restaurants that match tastes
+ Reselection of restaurants through the “one-vote” mechanism
## Installation & Operation
1. Node.js 16+
2. Expo CLI
3. Virtual Device

#### Steps
1.  Clone repository
```SHELL
git clone https://github.com/sdobrimutrom/restaurant-chooser.git
cd restaurant-chooser
```
2. Install dependencies
```SHELL
npm install
```
3. Run app
```SHELL
npx expo start
```
+ Run in the [Expo Go App](https://expo.dev/accounts/ericzq/projects/RestaurantChooser/builds/f3bc568f-ec78-4694-8612-f9bddab8a893)

## Core Functions
1. Member management
    + Add people to the People screen of the app
    + Set for each member:
        + First Name
        + Last Name
        + Relationship(e.g. Me,Family,Friend,etc)
2. Restaurant management
    + Add a restaurant to the Restaurants screen:
        + Restaurant name
        + Cuisine(e.g. Chinese, Japanese, vegetarian, etc.)
        + Price range
        + Stars Rating
        + Contact Phone number
        + Address
        + Restaurant Web Site
        + Delivery or not
3. Dining Decision Process
    + Step 1: Filter Configuration
        + Selection of dining members Group
        + Enable Pre-Filter:
            + Preference Matching: Selecting a Cuisine
            + Star filtering: Delineating the range of restaurant ratings
            + Price setting: Selecting price range
            + Delivery service
    + Step 2: System Recommendations
        + Randomly select a restaurant from the list of eligible ones
        + The interface displays the selected restaurant:
            + Name
            + Cuisine
            + Stars Rating
            + Price Rating
    + Step 3: Veto mechanism
        + 1 veto opportunity for each member
        + Veto process:
            + Current selection is rejected → Exclude this restaurant from the list → Re-recommendation
            + No vetoes from all members → final choice is determined
    + Step 4：Post choice Result
        + No restaurant selected.
        + Restaurant Choice Success.
        Display the restaurant information: 
            + Restaurant name
            + Cuisine
            + Price
            + Stars rating
            + Phone number
            + Address
            + Restaurant Web Site
            + Delivery or not

## Data Example
```TYPESCRIPT

People = {
  key: string;
  firstName: string;
  lastName: string;
  Relationship: string[];
}
type Restaurant = {
  key: string;
  name: string;
  cuisine: string[];
  rating: string[];
  price: string[];
  phoneNumber: string;
  website: string;
  delivery: boolean;
  address: string;
};
```