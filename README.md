# Homer Software Take-Home Assignment
## Scenario

Great news! We've just signed up a new client, Los Pollos Hermanos, and they want us to handle all of their deliveries across 14 different locations. But there's a catch: they use an ordering platform that we don't yet integrate with and they won't let us start service until we do. They've given us their login information and a URL to login at and are leaving the rest for us to figure out.

Username: `gfring`  
Password: `ilovefriedchicken`  
URL: https://los-pollos-hermanos.herokuapp.com

Like all of our integrations, we want to extract as much information about the orders as possible. Some of the questions we need to answer are:

* Is the order scheduled for pickup or delivery?
* When is the order expected?
* When was the order placed?
* Who is the order for?
* If this is a delivery order, where is it being delivered to?
* How much did the order cost?
* Did the customer leave a tip? If so, how much?
* Is the order already paid for? If so, how?
* What items are included in the order?

Using the language and libraries of your choosing (*bonus points for using Ruby, JavaScript or Go*), build a program that extracts order details from the Los Pollos Hermanos ordering platform and saves it in a structured format. If you want, you can use our API documentation as a guide for which attributes are most important. Make any assumptions that you need to make. Keep in mind that this program will need to run continuously to keep up with orders as they're placed.

To get started, just fork this repo. When you're ready to submit, open a pull request with your changes.

The specs for this integration are intentionally vague because we want to see what types of assumptions you make, how you think through the problem and ultimately arrive at a solution. With that said, coding is a collaborative process, so if you have any questions feel free to reach out to: robert@homerlogistics.com
