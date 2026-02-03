const urlBase = "http://143.198.6.35/API";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

// ---------------- LOGIN ----------------
function doLogin() {
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login, password};
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `${urlBase}/Login.${extension}`, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if(this.readyState === 4) {
            let resp = JSON.parse(this.responseText);
            if(resp.id > 0) {
                userId = resp.id;
                firstName = resp.firstName;
                lastName = resp.lastName;
                saveCookie();
                window.location.href = "contacts.html";
            } else {
                document.getElementById("loginResult").innerHTML = "Invalid credentials";
            }
        }
    };
    xhr.send(JSON.stringify(tmp));
}

// ---------------- REGISTER ----------------
function doRegister() {
    let firstNameReg = document.getElementById("regFirstName").value;
    let lastNameReg = document.getElementById("regLastName").value;
    let loginReg = document.getElementById("regLogin").value;
    let passwordReg = document.getElementById("regPassword").value;

    let tmp = {firstName:firstNameReg, lastName:lastNameReg, login:loginReg, password:passwordReg};
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `${urlBase}/Register.${extension}`, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if(this.readyState === 4) {
            let resp = JSON.parse(this.responseText);
            if(resp.id > 0) window.location.href = "index.html";
            else document.getElementById("registerResult").innerHTML = "Registration failed";
        }
    };
    xhr.send(JSON.stringify(tmp));
}

// ---------------- COOKIE ----------------
function saveCookie() {
    let date = new Date();
    date.setTime(date.getTime() + 20*60*1000);
    document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

function readCookie() {
    let data = document.cookie.split(",");
    userId = -1;
    data.forEach(d => {
        let [k,v] = d.trim().split("=");
        if(k=="firstName") firstName=v;
        if(k=="lastName") lastName=v;
        if(k=="userId") userId=parseInt(v);
    });
    if(userId<0) window.location.href="index.html";
}

// ---------------- LOGOUT ----------------
function doLogout() {
    userId=0; firstName=""; lastName="";
    document.cookie="firstName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href="index.html";
}

// ---------------- CREATE ----------------
function addContact() {
    let first=document.getElementById("firstName").value;
    let last=document.getElementById("lastName").value;
    let phone=document.getElementById("phone").value;
    let email=document.getElementById("email").value;

    let tmp={firstName:first,lastName:last,phone, email, userId};
    let xhr=new XMLHttpRequest();
    xhr.open("POST", `${urlBase}/AddContact.${extension}`, true);
    xhr.setRequestHeader("Content-type","application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if(this.readyState===4) {
            document.getElementById("contactAddResult").innerHTML="Contact added";
            searchContacts(); // refresh list
        }
    };
    xhr.send(JSON.stringify(tmp));
}

// ---------------- READ ----------------
function searchContacts() {
    let srch = document.getElementById("searchText").value.trim();

    // Do nothing if user hasn't entered a name
    if (srch === "") {
        document.getElementById("contactSearchResult").innerHTML = "";
        lastSearch = "";
        return;
    }

    lastSearch = srch;

    let tmp = { search: srch, userId };
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `${urlBase}/SearchContacts.${extension}`, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            let resp = JSON.parse(this.responseText);
            let listHtml = "";

            if (!resp.results || resp.results.length === 0) {
                listHtml = "No contacts found.";
            } else {
                resp.results.forEach(c => {
                    listHtml += `
                        ${c.FirstName} ${c.LastName} | ${c.Phone} | ${c.Email}
                        <button onclick="editContact(${c.ID})">Edit</button>
                        <button onclick="deleteContact(${c.ID})">Delete</button><br>
                    `;
                });
            }

            document.getElementById("contactSearchResult").innerHTML = listHtml;
        }
    };

    xhr.send(JSON.stringify(tmp));
}


// ---------------- UPDATE ----------------
function editContact(id) {
    let first = prompt("Enter first name:");
    let last  = prompt("Enter last name:");
    let phone = prompt("Enter phone:");
    let email = prompt("Enter email:");

    if (first && last && phone && email) {
        let tmp = { id, firstName: first, lastName: last, phone, email, userId };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", `${urlBase}/UpdateContact.${extension}`, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && lastSearch !== "") {
                searchContacts(); // refresh ONLY if user searched
            }
        };

        xhr.send(JSON.stringify(tmp));
    }
}


// ---------------- DELETE ----------------
function deleteContact(id) {
    if (confirm("Delete this contact?")) {
        let tmp = { id, userId };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `${urlBase}/DeleteContact.${extension}`, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && lastSearch !== "") {
                searchContacts(); // refresh ONLY if user searched
            }
        };

        xhr.send(JSON.stringify(tmp));
    }
}

//contacts page add accordion
function toggleAddAccordion() {
    const accordion = document.getElementById("addContactAccordion");
    const btn = document.getElementById("toggleAddBtn");

    const isHidden = accordion.classList.contains("hidden");

    if (isHidden) {
        accordion.classList.remove("hidden");
        btn.textContent = "−";
    } else {
        closeAddAccordion();
    }
}

function closeAddAccordion() {
    document.getElementById("addContactAccordion").classList.add("hidden");
    document.getElementById("toggleAddBtn").textContent = "+";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phone").value = "";
}



