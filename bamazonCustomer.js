var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_customer_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    console.table(results);
    start()
  })

});

function start() {

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

      connection.query("SELECT * FROM products WHERE item_id = ?",
        [
          parseInt(answer.product)
        ], function (err, res) {
          if (err) throw err;
          
          if (res[0] !== undefined) {
          
          let newQuant = res[0].stock_quantity -= parseInt(answer.quantity)
          
          let totalCost = res[0].price * parseInt(answer.quantity)
          let prodName = res[0].product_name
          if (res[0].stock_quantity >= parseInt(answer.quantity)) {
            connection.query("UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newQuant
                },
                {
                  item_id: parseInt(answer.product)
                }
              ], function (err, res) {
                if (err) throw (err);
                console.log("Thankyou for your purchase! Your total cost is: $" + totalCost);
                console.log("Enjoy your " + prodName + "!");
                connection.end()
                }
            )
          }
           else {
             console.log("We don't have that many! Please adjust your quantity");
             start();
           } 
        }
        else {
          console.log("Please enter a valid item ID");
          start()
        }
      }
      )
  
})
}
