//integrate with your fastapi backend
console.log("Books.js loaded");

async function getBooks() {
    console.log("getBooks() called");
    try {
        const response = await fetch('http://localhost:8001/books/');
        console.log("fetch status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Books:", data);
        displayBooks(data);
        return data;
    } catch (err) {
        console.error("getBooks error:", err);
        throw err;
    }
}

function displayBooks(books) {
    const booksList = document.getElementById('books-list');
    if (!booksList) {
        console.warn("displayBooks: '#books-list' element not found");
        return;
    }
    booksList.innerHTML = ''; // clear previous content

    if (!Array.isArray(books)) {
        console.warn("displayBooks: expected array, got", books);
        return;
    }

    books.forEach(element => {
        const title = element.Title || element.title || "Untitled";
        const author = element.Author || element.author || "Unknown";
        const year = element.Year || element.year || "";
        const genre = element.Genre || element.genre || "";

        const listItem = document.createElement('li');
        listItem.textContent = `${title} by ${author}${year ? ` (${year})` : ''}${genre ? ` - Genre: ${genre}` : ''}`;
        booksList.appendChild(listItem);
    });
}

getBooks().catch(()=>{});
