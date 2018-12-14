//variables to require the necessary npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");
const chalk = require('chalk');

//create a new connection to mySQL 
var connection = mysql.createConnection({
  host: "localhost",

  // The port used
  port: 8889,

  // Username
  user: "root",

  // Password
  password: "root",

  // Database to be used
  database: "bamazon_customer_DB"
});

// intialize the connection. If there's no error, display our products table and run the start function
connection.connect(function (err) {
  if (err) throw err;
  // make a query to our database selecting everything from products
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // use console.table to log the results to the console in a nice table
    console.table(results);
    start()
  })

});

// Our function to start the prompts
function start() {
  // Use inquirer to ask the user questions
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "Which item ID would you like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
      }
    ]).then(function(answer) {
      // Make a new database query selecting the item the user chose and returning that row 
      connection.query("SELECT * FROM products WHERE item_id = ?",
        [
          parseInt(answer.product)
        ], function (err, res) {
          
          // if there's an error, stop and show error
          if (err) throw err;
          
          // if the item_id the user chose is defined (if it exists in our table), else log "Pick a valid entry"
          if (res[0] !== undefined) {
          // Create a variable to update the stock_quantity table in our database using the number the user bought
          let newQuant = res[0].stock_quantity -= parseInt(answer.quantity)
          
          // Create a variable to let the user know the total cost of the purchase (price * quantity)
          let totalCost = res[0].price * parseInt(answer.quantity)
          
          // Create a variable to display the product name
          let prodName = res[0].product_name
          
          // Create a variable to display the total sales of the product so far
          let prodSales = parseInt(res[0].product_sales)
          
          // If the quantity in our database is greater than or equal to the user's desired quantity, else log "not enough"
          if (res[0].stock_quantity >= parseInt(answer.quantity)) {
            
            // query the database, set and save the new stock_quantity and the new product sales quantities to the database
            connection.query("UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newQuant,
                  product_sales: prodSales + totalCost
                },
                {
                  item_id: parseInt(answer.product)
                }
              ], function (err, res) {
                if (err) throw (err);
                // log a message to the user with the product name and their total cost
                console.log(chalk.green("Thankyou for your purchase! ") + chalk.underline.bgGreen.black("Your total cost is") + ":" + chalk.yellow(" $" + totalCost));
                console.log("Enjoy your " + chalk.yellow(prodName) + "!");
                //end the connection
                connection.end()
                }
            )
            
          }
           else {
             console.log(chalk.red("We don't have that many! Please adjust your quantity"));
             start();
           } 
        }
        else {
          console.log(chalk.red("Please enter a valid item ID"));
          start()
        }
      }
      )
  
})
}
