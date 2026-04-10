console.log("Authors.js loaded");

async function getAuthors() {
    console.log("getAuthors() called");
    try {
        const response = await fetch('http://localhost:8002/authors/');
        console.log("fetch status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch authors: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Authors:", data);
        displayAuthors(data);
        return data;
    } catch (err) {
        console.error("getAuthors error:", err);
        throw err;
    }
}

function displayAuthors(authors) {
    const list = document.getElementById('authors-list');
    if (!list) {
        console.warn("displayAuthors: '#authors-list' element not found");
        return;
    }
    list.innerHTML = '';

    if (!Array.isArray(authors)) {
        console.warn("displayAuthors: expected array, got", authors);
        return;
    }

    authors.forEach(a => {
        const name = a.Name || a.name || a.fullName || "Unnamed Author";
        const bio = a.Bio || a.bio || a.description || "";
        const id = a.id || a.Id || "";

        const item = document.createElement('li');
        item.textContent = id ? `${name} (id: ${id})` : name;
        if (bio) {
            const p = document.createElement('p');
            p.textContent = bio;
            p.style.margin = "4px 0 8px 0";
            item.appendChild(p);
        }
        list.appendChild(item);
    });
}

getAuthors().catch(()=>{});