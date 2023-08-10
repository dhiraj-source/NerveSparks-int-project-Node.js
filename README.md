# NerveSparks-int-project
It's an buy and sell of vehicle between user and dealership. aggregation pipeline included for for desire documents from user as well as dealership api-end-point.
# Full Description :
Database Schema:
https://dbdiagram.io/d/64a1c7e102bd1c4a5e5fc28c

Requirements:

1. Implement admin, user and dealership authentication using JWT(Json Web Token ).

2. Implement a mechanism to invalidate JWT to facilitate logout and password change.

3. Create REST endpoints for user :

a. To view all cars
b. To view all cars in a dealership
c. To view dealerships with a certain car
d. To view all vehicles owned by user
e. To view the dealerships within a certain range based on user location(use maps api)
f. To view all deals on a certain car
g. To view all deals from a certain dealership
h. To allow user to buy a car after a deal is made

4. Create REST endpoints for dealership :

a. To view all cars.
b. To view all cars sold by dealership
c. To add cars to dealership
d. To view deals provided by dealership
e. To add deals to dealership
f. To view all vehicles dealership has sold
g. To add new vehicle to the list of sold vehicles after a deal is made

5. Post requests should be able to handle multipart/form-data

6. Implement asynchronous error handling using promises for all API endpoints. Handle and respond to any errors gracefully.

7. Use ES6 compatible code i.e. use ES modules for import rather than common js import, use promises instead of callbacks etc.

8. Use faker js to create dummy data.

9. Provide basic api documentation for your code.

10. You are not allowed to use the Mongoose library for this assignment.

11. Host your database on https://www.mongodb.com/atlas/database
