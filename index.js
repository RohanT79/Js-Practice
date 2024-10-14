const express = require("express")
const fs = require("fs")

const app = express()
app.use(express.json()) // middleware used to parse the file

const logger = (req, res, next) => {
    console.log("middle1")
    const startTime = new Date().getTime()
    console.log(startTime, "start time")
    next()
    const endTime = new Date().getTime()
    console.log(endTime, "end time")
    console.log("after next")
    const diff = endTime - startTime
    console.log("diff--->>", diff)
}

const authMidleware = (req, res, next) => {
    const query = req.query
    if (query.user === "admin") {
        console.log("middle")
        next()
    }
    else {
        res.send("entry restricted")
    }
}

// app.use(logger)

app.use(authMidleware)

// app.use((req,res,next)=>{
//     console.log("middleWare")
//     next()
//     console.log("after next")
// })

app.get("/", (req, res) => {
    res.send("HOME PAGE")
})

app.get("/data", (req, res) => {
    const dataStream = fs.createReadStream("./data.json", "utf-8")  // creates the chunks of file so server is not loaded
    dataStream.pipe(res)  //  transfer this chunks by using pipe 
    console.log("data")
})

app.post("/addData", (req, res) => {
    res.send("data is added")
})

app.get("/getProducts", (req, res) => {
    const data = fs.readFileSync("./data.json", "utf-8")
    res.send(data)
})

app.post("/addProducts", (req, res) => {
    const data = fs.readFileSync("./data.json", "utf-8")  // Reac complete file
    const parse_data = JSON.parse(data) // parse the data to send to server or post to server
    parse_data.products.push(req.body)  // add the data to products array
    fs.writeFileSync("./data.json", JSON.stringify(parse_data))  // while add data to file it needs to be stringify 
    res.send("data added")
})

app.put("/updateProducts/:id", (req, res) => {
    const data = fs.readFileSync("./data.json", "utf-8");
    const parse_data = JSON.parse(data);

    const prod_id = parseInt(req.params.id); // Extract product ID from URL
    console.log(prod_id, "id")
    // Use findIndex to get the index of the product
    const prod_index = parse_data.products.findIndex((itm) => itm.id === prod_id);
    console.log(prod_index, "index")
    // Check if the product exists
    if (prod_index !== -1) {
        // Update the product at the found index
        parse_data.products[prod_index] = { ...parse_data.products[prod_index], ...req.body };

        // Write the entire object back to the file (not just the products array)
        fs.writeFileSync("./data.json", JSON.stringify(parse_data, null, 2)); // Formatting for readability

        res.send("Product updated successfully");
    } else {
        res.status(404).send("Product not found");
    }
});

app.patch("/updateProducts/:id", (req, res) => {
    const data = fs.readFileSync("./data.json", "utf-8");
    const parse_data = JSON.parse(data);

    const prod_id = parseInt(req.params.id); // Extract product ID from URL
    console.log(prod_id, "id")
    // Use findIndex to get the index of the product
    const prod_index = parse_data.products.findIndex((itm) => itm.id === prod_id);
    console.log(prod_index, "index")
    // Check if the product exists
    if (prod_index !== -1) {
        // Update the product at the found index
        parse_data.products[prod_index] = { ...parse_data.products[prod_index], ...req.body };

        // Write the entire object back to the file (not just the products array)
        fs.writeFileSync("./data.json", JSON.stringify(parse_data, null, 2)); // Formatting for readability

        res.send("Product updated successfully");
    } else {
        res.status(404).send("Product not found");
    }
});


app.delete("/removeProduct/:id", (req, res) => {
    const data = fs.readFileSync("./data.json", "utf-8")
    const parse_data = JSON.parse(data)
    const prod_id = parseInt(req.params.id)
    console.log(prod_id, "id")
    const productExists = parse_data.products?.some(itm => itm.id === prod_id);
    console.log(productExists, "productExists")

    // const removed_prod = parse_data.products.filter((itm)=>itm.id === prod_id)
    // console.log(removed_prod,"removed")

    if (productExists) {
        const all_prod = parse_data.products.filter((itm) => itm.id !== prod_id);
        console.log(all_prod, "all_prod")
        fs.writeFileSync("./data.json", JSON.stringify(all_prod))
        res.send("Product deleted successfully");
    }
    else {
        res.send("error deleting the product")
    }


})



app.listen(8080, () => {
    console.log("server started")
})