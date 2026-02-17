# lamp-project

This project utilizes a standard LAMP stack(linux, Apache, MySQL, PHP) to create a contact manager app.

This repository lives on a digital ocean Linux Droplet, where an Apache web server serves the files and the website can be accessed via : https://miniapp4331.com

The MySQL database stores user information, as well as contact information associated with each user. 

These tables are queried by our REST API's - we have 6 endpoints that function as our API.
We have encrypted with certbot and use HTTPS.

We also use a minimal CI/CD pipeline to validate html, css, and code quality.
