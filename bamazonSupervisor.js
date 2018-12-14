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
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        console.table(results);
        managerStart();
    })

});



function supervisorStart() {
    inquirer
    .prompt([
        {
            name: "product",
            type: "rawlist",
            message: "Which item ID would you like to purchase?",
            choices: ["View product sales by department", "Create New Department"]
        }
    ]).then(function(answer) {
        if(answer.product === "View product sales by department") {
            
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                console.table(results);
                managerStart();
            })
        