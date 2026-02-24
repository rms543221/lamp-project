# lamp-project

This project utilizes a standard LAMP stack(linux, Apache, MySQL, PHP) to create a minimal contact manager app.

This repository lives on a digital ocean Linux Droplet, where an Apache web server serves the files and the website can be accessed via : https://miniapp4331.com

The MySQL database stores user information, as well as contact information associated with each user. 

These tables are queried by our REST APIs - we have 6 endpoints that access our MySQL database and query wthe browser requests.

We have encrypted our website to use HTTPS.

We also use a minimal CI/CD pipeline to validate html, php, and javascript code quality.
