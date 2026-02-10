const urlBase = "https://miniapp4331.com/API";
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
/*function searchContacts() {
    let input = document.getElementById("searchInput");
    if (!input) return; //exit on null error

    let srch = input.value.trim();

    //if no name, have no results
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
}*/


function searchContacts()
{
	let srch = document.getElementById("searchInput").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
            if (!jsonObject.results || jsonObject.results.length === 0) {
                contactList = "No contacts found.";
            } else {
                jsonObject.results.forEach(c => {
                    contactList += `
                        ${c.FirstName} ${c.LastName} | ${c.Phone} | ${c.Email}
                        <button onclick="showEdit(${c.ID})">Edit</button>
                        <button onclick="deleteContact(${c.ID})">Delete</button><br>
                        
                        <div id="editAccordion-${c.ID}" class="accordion hidden"></div>
                    `;
                });
            }
				document.getElementsById("contactSearchResult").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
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
    if (confirm("Are you sure you want to delete this contact?")) {
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
/*function toggleAddAccordion() {
    const accordion = document.getElementById("addContactAccordion");
    const btn = document.getElementById("toggleAddBtn");

    const isHidden = accordion.classList.contains("hidden");

    if (isHidden) {
        accordion.classList.remove("hidden");
        btn.textContent = "-";
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
    document.getElementById("email").value = "";
}*/

function toggleAccordion(accordionId, buttonEl = null) {
    const target = document.getElementById(accordionId);
    if (!target) return;

    const isOpening = target.classList.contains("hidden");

    //close every open accordion
    document.querySelectorAll(".accordion").forEach(acc => {
        acc.classList.add("hidden");
        //reset values 
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        if (buttonEl) buttonEl.textContent = "+";
    });

    //open accordion
    if (isOpening) {
        target.classList.remove("hidden");
        //for add button, change text to -
        if (buttonEl) buttonEl.textContent = "-";
    }

}

//will insert values into edit contact accordion
function showEdit(contactId, btn) {
    const accId = `editAccordion-${contactId}`;
    const acc = document.getElementById(accId);

    //close accordions if already open
    if (!acc.classList.contains("hidden")) {
        toggleAccordion(accId);
        return;
    }

    //load contact data
    acc.innerHTML = `
        <input id="editFirst-${contactId}" placeholder="First Name">
        <input id="editLast-${contactId}" placeholder="Last Name">
        <input id="editPhone-${contactId}" placeholder="Phone">
        <input id="editEmail-${contactId}" placeholder="Email">
        <button onclick="editContact(${contactId})">Save</button>
    `;

    toggleAccordion(accId, btn);
}





