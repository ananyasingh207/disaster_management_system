# Disaster Management System

## Description

The Disaster Management System is a role-based web application designed to support efficient coordination and response during emergency and disaster situations. The platform enables citizens to report incidents and send SOS alerts, volunteers to manage assigned rescue tasks, and administrators to oversee incident handling, SOS management, and emergency communications through a centralized control panel.

The system emphasizes real-time incident tracking, location-based SOS handling, and structured communication across all user roles.

---

## Features

- Role-based access for Citizens, Volunteers, and Administrators  
- Incident reporting and real-time status tracking  
- Volunteer assignment, acceptance, and completion workflow  
- Global SOS functionality accessible without user authentication  
- Browser-based geolocation capture for SOS alerts  
- Google Maps integration for location-based directions  
- Admin-controlled SOS lifecycle management (active, completed, false alarm)  
- Emergency alert broadcasting to citizen and volunteer dashboards  
- Administrative remarks, internal notes, and user communication tools  

---

## Tech Stack

- **Frontend:** React, JavaScript, HTML, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **APIs and Integrations:**  
  - Browser Geolocation API  
  - Google Maps API  
- **Architecture:** RESTful APIs, role-based access control  

---

## System Architecture

- **Frontend:** Dynamic role-based dashboards with real-time UI updates  
- **Backend:** REST APIs handling incidents, SOS requests, volunteer assignments, and alerts  
- **Database:** MongoDB collections for users, incidents, SOS records, and alerts  
- **Location Services:** Real-time coordinate capture and mapping using Google Maps  

---

## Core Functionalities

### Citizen
- Submit incident reports  
- Track incident status  
- Send SOS alerts without account login  
- View emergency broadcasts  

### Volunteer
- View and accept assigned incidents  
- Mark incidents as completed  
- Access completed incident history  
- Receive emergency alerts  

### Administrator
- Review and assign reported incidents  
- Manage SOS alerts with live location data  
- Mark SOS as completed or false alarms  
- Broadcast emergency alerts  
- Add remarks, internal notes, and communicate with users  

---

## Outcome

- Improved coordination between citizens, volunteers, and administrators  
- Faster SOS response through live location tracking  
- Structured role-based workflows for disaster management  
- Scalable foundation for real-world emergency response systems  

---

## Repository
https://github.com/ananyasingh207/disaster_management_system

