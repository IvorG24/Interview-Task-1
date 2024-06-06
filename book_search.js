const readline = require("readline");

const BASE_URL =
  "https://ejditq67mwuzeuwrlp5fs3egwu0yhkjz.lambda-url.us-east-2.on.aws/api"; // Base URL of the API or it is better to put it in a .env file for security issue

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to fetch book information based on title
async function getBookInfo(title) {
  try {
    const response = await fetch(`${BASE_URL}/books/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Return the data received from the API
  } catch (error) {
    console.error("Error fetching book information:", error.message); // Error handling
    return null;
  }
}

// Function to fetch author information based on author ID
async function getAuthorInfo(authorId) {
  try {
    const response = await fetch(`${BASE_URL}/authors/${authorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Return the data received from the API
  } catch (error) {
    console.error(`Error fetching author with ID ${authorId}:`, error.message); // Error handling
    return null;
  }
}

// Function to fetch book details and display them
async function fetchBookDetails(title) {
  const bookInfo = await getBookInfo(title); // Fetch book information using the provided title
  if (!bookInfo) {
    console.log("\nBook could not be found.\n"); // If bookInfo is null, log a message indicating the book could not be found
    return;
  }

  // Prepare formattedBookInfo object with title, description, and an empty array for authors
  const formattedBookInfo = {
    title: bookInfo.title,
    description: bookInfo.description,
    authors: [],
  };

  // Fetch and format author information
  const authorPromises = bookInfo.authors.map(async (authorId) => {
    const authorInfo = await getAuthorInfo(authorId); // Fetch author information for each author ID in bookInfo.authors
    if (authorInfo) {
      // If authorInfo is available, construct fullName with firstName, middleInitial (if available), and lastName
      const fullName = `${authorInfo.firstName} ${
        authorInfo.middleInitial ? authorInfo.middleInitial + " " : ""
      }${authorInfo.lastName}`;
      formattedBookInfo.authors.push({
        fullname: fullName, // Push formatted author fullname and middlename if available information into formattedBookInfo.authors array
      });
    } else {
      //Error handling author cannot be found
      formattedBookInfo.authors.push({
        fullname: `Author with ID ${authorId} not found`,
      });
    }
  });

  // Wait for all authorPromises to resolve
  await Promise.all(authorPromises);

  // Display formatted book information as JSON
  console.log("Book Information:");
  console.log(JSON.stringify(formattedBookInfo, null, 2));
}

// Function to prompt user for input and handle book details fetching
function promptUser() {
  rl.question('Enter the book title (or "exit" to quit): ', async (title) => {
    if (title.toLowerCase() === "exit") {
      rl.close(); // If user inputs "exit", then the promp will exit
      return;
    }
    await fetchBookDetails(title); // Call fetchBookDetails with the provided title
    promptUser(); // Prompt user again for input
  });
}
// Start the interaction by prompting the user for input
promptUser();
