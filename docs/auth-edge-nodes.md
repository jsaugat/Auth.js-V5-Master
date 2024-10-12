# Auth.js and Edge Runtime Challenges

This document explains the challenges of using **Auth.js** (or **next-auth**) in **edge runtimes**—environments where server-side JavaScript runs closer to users on less powerful hardware than traditional cloud servers.

## The Core Issue

Edge runtimes often lack some features provided by Node.js, such as **raw TCP sockets**, which are essential for many database clients like **PostgreSQL**.

## Edge Compatibility of Auth.js

- **Auth.js** is designed to be **edge-compatible**, meaning its core functionality can run on edge runtimes.
- However, issues arise when pairing Auth.js with libraries that rely on Node.js features not supported by edge runtimes, such as database adapters.

## Workaround: API Servers

To address this limitation, developers often use **API servers** that act as intermediaries between the application and the database. These API servers communicate with the database via **HTTP requests**, which edge runtimes support. This avoids the need for raw TCP sockets.

## Split Configuration Solution

A **split configuration** is recommended for using Auth.js in both edge and traditional environments:

- **Edge environment**: A configuration without the database adapter for use in middleware or edge-specific routes.
- **Traditional environment**: A configuration with the database adapter to handle queries where full Node.js features are available.

This setup ensures that **Auth.js** works effectively across different runtime environments.
