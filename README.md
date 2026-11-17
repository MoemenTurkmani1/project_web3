# SportZone — Sports Facility Booking Platform

A PHP and MySQL web-development project for discovering and booking sports facilities. The repository contains browser pages, PHP API endpoints, and administrative/dashboard views.

> **Status:** Student/development project. Not a hosted production booking service. Functionality requires a correctly configured PHP server, MySQL database, and matching schema. No production deployment or end-to-end test is claimed here.

## Project scope

- Browse available facilities and sports, with search/filter interfaces.
- Sign-up and sign-in endpoints.
- Booking form and PHP submission endpoint, including a check for overlapping time slots.
- Facility-management and booking/dashboard endpoints.
- Basic user/owner roles in sign-up handling.

Implementations and screens may differ in completeness; this list is based on the source files, not a verified live deployment.

## Technologies

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP
- **Database:** MySQL / MariaDB
- **Development environment:** a local PHP + MySQL stack such as XAMPP

## Repository layout

```text
api/         PHP endpoints (authentication, bookings, facilities, dashboard)
assets/      Frontend styles and scripts
includes/    Shared website files
pages/       UI screens and some PHP pages
db.php       Development database connection configuration
```

## Local setup

1. Install a PHP/MySQL environment, such as XAMPP, and clone the repository into the web server's document root.
2. Provision the database tables that the PHP scripts expect, including users, facilities, sports and bookings. **This repository does not currently include a verified database migration or SQL schema dump.**
3. Configure the database connection for your *local* environment.
4. Start Apache and MySQL, then open the pages through your local PHP web server (not the `file://` protocol).

**Before deployment:** Do not commit real credentials. Prefer environment-based configuration for database connection details. Review all endpoints for input validation, authorization and error handling; disable development error display in production. Do not deploy this repository unchanged to a public server.

## Current limitations

- The database schema and setup instructions are incomplete, so a clean checkout may not run without additional database preparation.
- Database connection details are configured directly in PHP files in the current version, using local development defaults. These must be replaced for shared or production use.
- Authentication, authorization, booking edge cases, error reporting, and security require an end-to-end review before production deployment.
- A production payment gateway and live reservation availability have not been verified.

## Portfolio purpose

This project demonstrates hands-on learning across frontend interfaces, PHP request handling, relational databases, authentication flows and booking logic. It is shared as a development portfolio project, not a production service.
