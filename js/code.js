const urlBase = "https://miniapp4331.com/API";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let contactMap = {};

//login existing user
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

//register new user to DB
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

//cookies!
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

//lose cookies, move to login page
function doLogout() {
    userId=0; firstName=""; lastName="";
    document.cookie="firstName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href="index.html";
}

//add contact to DB
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
        if(this.readyState===4 && this.status === 200) {
            //success
            document.getElementById("contactAddResult").innerHTML="Contact added";

            //close accordion
            toggleAccordion("addContactAccordion", document.getElementById("toggleAddBtn"));

            //refresh list
            searchContacts();
        }
    };
    xhr.send(JSON.stringify(tmp));
}


function searchContacts()
{
	let srch = document.getElementById("searchInput").value;
	document.getElementById("contactSearchResult").innerHTML = "";

    //if nothing is typed, skip API
    if(srch === "") {
        return;
    }
	
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
                    contactMap[c.ID] = c;
                    contactList += `
                        <div class="contact-row">
                            <div class="contact-info">
                                <span class="contact-name">${c.FirstName} ${c.LastName}</span>
                                <span class="contact-details">${c.Phone} | ${c.Email}</span>
                            </div>

                            <div class="contact-actions">
                                <button class="circle-btn" onclick="showEdit(${c.ID}, this)">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="circle-btn" onclick="deleteContact(${c.ID})">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <div id="editAccordion-${c.ID}" class="accordion hidden"></div>
                    `;
                });
            }
				document.getElementById("contactSearchResult").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

//will insert values into edit contact accordion
function showEdit(id) {
    //grab contact info
    const contact = contactMap[id];
    const acc = document.getElementById(`editAccordion-${id}`);

    //close any open accordions
    if (!acc.classList.contains("hidden")) {
        acc.classList.add("hidden");
        return;
    }

    //load contact data into fields
    acc.innerHTML = `
        <input id="editFirst-${id}" value="${contact.FirstName}">
        <input id="editLast-${id}" value="${contact.LastName}">
        <input id="editPhone-${id}" value="${contact.Phone}">
        <input id="editEmail-${id}" value="${contact.Email}">
        <button class="action-btn" onclick="saveEdit(${id})">Save</button>
    `;

    acc.classList.remove("hidden");
}

//update contacts
function editContact(id) {
    let first = document.getElementById(`editFirst-${id}`).value.trim();
    let last  = document.getElementById(`editLast-${id}`).value.trim();
    let phone = document.getElementById(`editPhone-${id}`).value.trim();
    let email = document.getElementById(`editEmail-${id}`).value.trim();

    //ensure that each field is filled in
    if (!first || !last || !phone || !email) {
        alert("All fields are required.");
        return;
    }

    let tmp = { id, firstName: first, lastName: last, phone, email, userId };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `${urlBase}/UpdateContact.${extension}`, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //close accordion
            document.getElementById(`editAccordion-${id}`).classList.add("hidden");
            
            if(lastSearch !== "") {
                searchContacts(); // refresh ONLY if user searched
            }
        }
    };

    xhr.send(JSON.stringify(tmp));
}


//delete contacts
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

//will toggle add/edit accordions
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






