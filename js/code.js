const urlBase = "http://143.198.6.35/API";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

//main login
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

//register users
function doRegister()
{
    let firstNameReg = document.getElementById("regFirstName").value;
    let lastNameReg = document.getElementById("regLastName").value;
    let loginReg = document.getElementById("regLogin").value;
    let passwordReg = document.getElementById("regPassword").value;
	
	document.getElementById("registerResult").innerHTML = "";

	let tmp = {firstName:firstNameReg, lastName:lastNameReg, login:loginReg, password:passwordReg};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("registerResult").innerHTML = "Registration Failed";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	window.location.href = "index.html";
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

//adds contacts to database
function addContact()
{
    let first=document.getElementById("firstName").value;
    let last=document.getElementById("lastName").value;
    let phone=document.getElementById("phone").value;

	let tmp={firstName:first,lastName:last,phone, userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                searchContacts(); // refresh list
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

//searches for contacts
function searchContacts()
{
	let srch = document.getElementById("searchText").value;

    // if user hasn't entered name, don't display any
    if (srch === "") {
        document.getElementById("contactSearchResult").innerHTML = "";
        lastSearch = "";
        return;
    }
	
	lastSearch = srch;

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
                let resp = JSON.parse(this.responseText);
                let listHtml = "";

                if (!resp.results || resp.results.length === 0) {
                    listHtml = "No contacts found.";
                } 
                else {
                    //edit & delete options
                    resp.results.forEach(c => {
                        listHtml += `
                            ${c.FirstName} ${c.LastName} | ${c.Phone}
                            <button onclick="editContact(${c.ID})">Edit</button>
                            <button onclick="deleteContact(${c.ID})">Delete</button><br>
                        `;
                    });
                }
                document.getElementById("contactSearchResult").innerHTML = listHtml;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

//edit specific contact
function editContact(id) {
    let first = prompt("Enter first name:");
    let last  = prompt("Enter last name:");
    let phone = prompt("Enter phone:");

    if (first && last && phone) {
        let tmp = { id, firstName: first, lastName: last, phone, userId };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", `${urlBase}/UpdateContact.${extension}`, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status == 200 && lastSearch !== "") {
                searchContacts(); // refresh ONLY if user searched
            }
        };

        xhr.send(JSON.stringify(tmp));
    }
}

//delete specific contact
function deleteContact(id) {
    if (confirm("Are you sure you want to delete this contact?")) {
        let tmp = { id, userId };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `${urlBase}/DeleteContact.${extension}`, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status == 200 && lastSearch !== "") {
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



