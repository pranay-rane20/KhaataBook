const express = require('express'); // Import Express framework
const app = express(); // Initialize the Express app
const path = require("path"); // Import Path module for handling file paths
const fs = require("fs"); // Import File System module for file operations

// Ensure `hisaab` directory exists
const hisaabDir = path.join(__dirname, 'hisaab'); // Define the path to the `hisaab` directory
if (!fs.existsSync(hisaabDir)) {
    // Create the directory if it doesn't exist
    fs.mkdirSync(hisaabDir);
}

// Set the view engine to EJS for rendering dynamic HTML
app.set('view engine', 'ejs');

// Serve static files from the `public` folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route: Display all files in the `hisaab` directory on the home page
app.get("/", (req, res) => {
    fs.readdir(hisaabDir, (err, files) => {
        if (err) return res.status(500).send(err); // Handle errors if the directory cannot be read
        res.render("index", { files }); // Render `index` view with the list of files
    });
});

// Route: Render a form for creating a new file
app.get("/create", (req, res) => {
    res.render("create"); // Render the `create` view
});

// Route: Create a new file with the current date as its name
app.post("/createhisaab", (req, res) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0"); // Format day
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Format month
    const year = now.getFullYear(); // Get year
    const date = `${day}-${month}-${year}.txt`; // Generate file name

    const sanitizedContent = req.body.content || ""; // Use default empty string if content is missing
    fs.writeFile(path.join(hisaabDir, date), sanitizedContent, (err) => {
        if (err) return res.status(500).send(err); // Handle file creation errors
        res.redirect("/"); // Redirect to the home page after creating the file
    });
});

// Route: Render a form to edit a specific file
app.get("/edit/:filename", (req, res) => {
    const filename = path.basename(req.params.filename); // Sanitize filename to prevent directory traversal
    fs.readFile(path.join(hisaabDir, filename), 'utf8', (err, filedata) => {
        if (err) return res.status(500).send(err); // Handle file reading errors
        res.render("edit", { filedata, filename }); // Render `edit` view with file data and name
    });
});

// Route: Update the content of an existing file
app.post("/update/:filename", (req, res) => {
    const filename = path.basename(req.params.filename); // Sanitize filename
    const sanitizedContent = req.body.content || ""; // Sanitize content
    fs.writeFile(path.join(hisaabDir, filename), sanitizedContent, (err) => {
        if (err) return res.status(500).send(err); // Handle file writing errors
        res.redirect("/"); // Redirect to the home page after updating the file
    });
});

// Route: View the content of a specific file
app.get("/hisaab/:filename", (req, res) => {
    const filename = path.basename(req.params.filename); // Sanitize filename
    fs.readFile(path.join(hisaabDir, filename), 'utf8', (err, filedata) => {
        if (err) return res.status(500).send(err); // Handle file reading errors
        res.render("hisaab", { filedata, filename }); // Render `hisaab` view with file data
    });
});

// Route: Delete a specific file
app.get("/delete/:filename", (req, res) => {
    const filename = path.basename(req.params.filename); // Sanitize filename
    fs.unlink(path.join(hisaabDir, filename), (err) => {
        if (err) return res.status(500).send(err); // Handle file deletion errors
        res.redirect("/"); // Redirect to the home page after deleting the file
    });
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000"); // Log server start message
});
