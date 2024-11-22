# The Problem

We're a publishing company that only publishes Abecedaries -- that is, children's books of the form "A is for Apple, B is for Banana, ...". We need a content management system for these books. Books can be layered in a series of "versions." Higher layers override the values of lower layers. Layers need not be complete, but they cannot be empty.

## Requirements

The content management system needs some sort of defined UI, but it doesn't have to be a GUI.  
The content management system needs some sort of durable storage.

### GenerateBook(name: string) -> int

Generate a new Book that is complete and correct, then return its ID. The Book has 26 entries, one for each letter of the English alphabet. You may draw the values from whatever data source you like.

### AddLayer(bookId: int, layerName: string, values: string[]) -> int

Add a new Layer to a book, then return its ID. It always adds the Layer on top of the topmost existing layer. The new layer must contain at least 1 entry and may contain up to 26.

### ListLayers(bookId: int) -> { id: int, name: string }[]

List the IDs and names of all layers for the book, in descending order.

### DisplayBookAtLayer(bookId, n = topmost) -> string[]

Display the book after applying all layers up to and including n.

## Instructions

I recommend spending 1-5 hours on this. There is no hard time limit.  
It is possible to meet all of the requirements using only Postgres. This is an elegant approach, but is not a requirement.  
Return your response as a Git repository or similar. Please do not publish your solution to a public GitHub / Gitlab repo until after we close this role. I will be happy to arrange a file-drop if you like.  
Automate onboarding where possible (e.g. via docker-compose, migrations files, package manager, etc.)  
Include onboarding instructions  
Include at least one test  
Include comments for suggested improvements  
Assume that the product will scale in users, concurrent users, books, layers  
You are welcome to use AI to support your development. If you do, include some documentation about your process for working with AI
