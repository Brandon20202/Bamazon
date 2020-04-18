var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "bluv2010",

    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    console.log("Displaying available items for sale...\n----------------------------------------------");
    for (var i = 0; i < results.length; i++) {
        console.log("ID: " + results[i].item_id + "\nItem Name: " + results[i].product_name + "\nPrice: $" + results[i].price);
        console.log("----------------------------------------------")
    }
    inquirer.prompt([{
        type: 'input',
        name: 'product',
        message: 'What is the ID of the product you would like to purchase?'
    }]).then(function (res) {
        if (res.product > results.length || res.product <= 0) {
            console.log("Error: Invalid ID.")
        }
        else {
            inquirer.prompt([{
                type: 'input',
                name: 'quantity',
                message: 'How many ' + results[res.product - 1].product_name + "s would you like to purchase?"
            }]).then(function (ans) {
                if (ans.quantity > results[res.product - 1].stock_quantity) {
                    console.log("Error: Insufficient quantity. There are currently only " + results[res.product - 1].stock_quantity + " " + results[res.product - 1].product_name + "s in stock.\nCanceling Order.");
                }
                else if (ans.quantity <= 0) {
                    console.log("Error: Invalid quantity.\nCanceling Order.")
                }
                else {
                    var query = "UPDATE products SET stock_quantity = stock_quantity -? WHERE item_id =?"
                    connection.query(query, [ans.quantity, results[res.product - 1].item_id], function (err, res) {
                        if (error) throw error;
                        console.log("Database Successfully updated");
                    });
                    var total = ans.quantity * results[res.product - 1].price;
                    console.log("Your total comes out to $" + total + ".");
                }
            });
        }
    });
});
