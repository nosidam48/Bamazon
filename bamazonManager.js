// Variables for npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("console.table");
var chalk = require("chalk");
var log = console.log

// create the mysql connection
var connection = mysql.createConnection({
    host: "localhost",

    // port  used
    port: 8889,

    // username
    user: "root",

    // password
    password: "root",

    // database
    database: "bamazon_customer_DB"
});

// Open the connection
connection.connect(function (err) {
    if (err) throw err;
    // A new query to print our database table to the console
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // use the results of the query to print the results to the console in a table
        console.table(results);
        // Call the start function
        managerStart();
    })

});


// The function to begin the prompt
function managerStart() {
    // Call inquirer.prompt to give the manager choices 
    inquirer
        .prompt([
            {
                name: "product",
                type: "rawlist",
                message: "What would you like to do?",
                choices: ["View products for sale", "View low inventory", "Add to Inventory", "Add new product"]
            }
        ]).then(function (answer) {
            // Log the users choice
            console.log("\n" + chalk.underline.yellow.bold(answer.product) + ":\n");
            // if "View products", run the view function
            if (answer.product === "View products for sale") {
                view();
            }
            // if "View low", run the lowInventory function
            if (answer.product === "View low inventory") {
               lowInventory();
            }
            // if "Add to Inventory", run the addInventory function
            if (answer.product == "Add to Inventory") {
                addInventory();
            }
            // if "Add product", run the addProduct function 
            if (answer.product == "Add new product") {
                addProduct();
            }


        })

}

// A function to view all products
function view() {
    // A query to get the table from our database
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        
        // Use console.table to print the results of the query to the database
        console.table(results);
        // Ask if the user wants to do anything else
        playAgain();
    })
}

// A function to return only items whose inventory is less than 20
function lowInventory() {
    // A query to select only products where stock_quantity < 20
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", function (err, results) {
        if (err) throw err;
        
        console.table(results);
        // Log the results of the query to the console in a table
        
        // Ask if the user wants to do anything else
        playAgain();
    })
}

// A function to add to the inventory of an item and save the result to the database
function addInventory() {
    // Call inquirer.prompt to ask which item ID to add to and how much to add
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Which item ID would you like to add inventory to?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"
            }
        ]).then(function (answer) {
            // A query that selects everythign from products
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                currentItem = results[(parseInt(answer.product) - 1)].product_name;
                // create a variable to hold the current stock_quantity
                currentQuant = results[(parseInt(answer.product) - 1)].stock_quantity;
                // create a variable to hold the quantity the user wants to add
                newQuant = parseInt(answer.quantity)
                // A query that updates the stock quantity of the item in the database
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            // Update stock_quantity by adding the update amount to the original amount
                            stock_quantity: currentQuant += newQuant
                        },
                        {
                            // Save to the row with the item_id of the users input
                            item_id: parseInt(answer.product)
                        }
                    ], function (err, results) {
                        if (err) throw err;
                        // Let the user know the item quantity has been updated
                        log("\n" + chalk.yellow(currentItem) + " quantity successfully updated!\n");
                        // Ask if the user wants to do anything else
                        playAgain();
                    })
                
            })
        })

}

// A function to add a new product to the database
function addProduct() {
    // Call inquirer.prompt to get the new item information
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "What is the product name?"
            },
            {
                name: "department",
                type: "input",
                message: "What department is the product in?"
            },
            {
                name: "cost",
                type: "input",
                message: "How much does it cost?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add to inventory?"
            }
        ]).then(function (answer) {
           
            // A query to select everything from the products table
            connection.query("SELECT * FROM products", function (err, res) {
                // A variable to create a new item_id for the new product by adding one to table.length
                let newID = res.length + 1
                // A query to insert a new item into the products table
                connection.query("INSERT INTO products SET ?",

                    {
                        item_id: newID,
                        product_name: answer.product,
                        department_name: answer.department,
                        price: parseInt(answer.cost),
                        stock_quantity: parseInt(answer.quantity)
                    },
                    function (err, res) {
                        // Log that the product was successfully added
                        console.log("\n" + chalk.yellow(answer.product) + " successfully added!\n");
                        // Ask if the user wants to do anything else
                        playAgain();
                    })
            })
        })
    }

// A function to ask if the user wants to run the program again
function playAgain() {
    // Call inquirer.prompt to 
    inquirer
        .prompt([
            {
                name: "product",
                type: "confirm",
                message: "Did you want to do anything else?",
                default: true
            },
        ]).then(function(answer) {
            // If the answer is true, restart the prompt
            if (answer.product) {
                managerStart()
            }
            else {
                connection.end()
            }
        })
}