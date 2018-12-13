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
        managerStart();
    })

});

function managerStart() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "rawlist",
                message: "Which item ID would you like to purchase?",
                choices: ["View products for sale", "View low inventory", "Add to Inventory", "Add new product"]
            }
        ]).then(function (answer) {
            console.log(answer.product);
            if (answer.product === "View products for sale") {
                console.log("Products!");
                view();
            }

            if (answer.product === "View low inventory") {
                console.log("Inventory!");
                lowInventory();
            }

            if (answer.product == "Add to Inventory") {
                console.log("Add Inventory!");
                addInventory();
            }

            if (answer.product == "Add new product") {
                console.log("add product!");
                addProduct();
            }


        })

}

function view() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.table(results);
        playAgain();
    })
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", function (err, results) {
        if (err) throw err;
        console.table(results)
        playAgain();
    })
}

function addInventory() {
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
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                currentQuant = results[(parseInt(answer.product) - 1)].stock_quantity;

                newQuant = parseInt(answer.quantity)
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: currentQuant += newQuant
                        },
                        {
                            item_id: parseInt(answer.product)
                        }
                    ], function (err, results) {
                        if (err) throw err;
                        console.log("successful update!");
                        playAgain();
                    })
                
            })
        })

}

function addProduct() {
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
            connection.query("SELECT * FROM products", function (err, res) {
                let newID = res.length + 1
                connection.query("INSERT INTO products SET ?",

                    {
                        item_id: newID,
                        product_name: answer.product,
                        department_name: answer.department,
                        price: parseInt(answer.cost),
                        stock_quantity: parseInt(answer.quantity)
                    },
                    function (err, res) {
                        console.log(res.affectedRows + " product inserted!\n");
                        playAgain();
                    })
            })
        })
    }

function playAgain() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "confirm",
                message: "Did you want to do anything else?",
                default: true
            },
        ]).then(function(answer) {
            if (answer.product) {
                managerStart()
            }
            else {
                connection.end()
            }
        })
}