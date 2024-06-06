# Command Line Book Search Application

## Overview

This is a command line application that interfaces with an existing API to search for books by title and fetch author information. The application prompts the user for a book title, searches the API for matching books, and if found, retrieves and displays the book's details along with the authors' information.

## Requirements

1. Prompt the user for a string input.
2. Ping the `/books/search` endpoint with the string as the title value.
3. If the book is found:
   a. Ping the `/authors/:authorId` endpoint for each author ID of the book.
   b. Retrieve the names of each author.
4. Display the book title, description, and the full name and middle initial of the authors.
   a. If the book could not be found, indicate that the book could not be found.
5. Ask the user for input again and repeat indefinitely.

