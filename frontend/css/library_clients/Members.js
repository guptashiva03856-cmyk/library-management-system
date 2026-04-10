console.log("Members.js loaded");

async function getMembers() {
    console.log("getMembers() called");
    try {
        const response = await fetch('http://localhost:8003/members/');
        console.log("fetch status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch members: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Members:", data);
        displayMembers(data);
        return data;
    } catch (err) {
        console.error("getMembers error:", err);
        throw err;
    }
}

function displayMembers(members) {
    const list = document.getElementById('members-list');
    if (!list) {
        console.warn("displayMembers: '#members-list' element not found");
        return;
    }
    list.innerHTML = '';

    if (!Array.isArray(members)) {
        console.warn("displayMembers: expected array, got", members);
        return;
    }

    members.forEach(m => {
        const name = m.Name || m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim() || "Unnamed Member";
        const email = m.Email || m.email || "";
        const id = m.id || m.Id || "";

        const item = document.createElement('li');
        item.textContent = id ? `${name} (id: ${id})` : name;
        if (email) {
            const e = document.createElement('small');
            e.textContent = ` — ${email}`;
            e.style.marginLeft = "8px";
            item.appendChild(e);
        }
        list.appendChild(item);
    });
}

getMembers().catch(()=>{});