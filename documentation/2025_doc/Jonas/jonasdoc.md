# Git Documentation

## Repository Overview

This repository contains the frontend and backend implementation of the **evalXAI platform**.  
It allows users to submit explainability challenges, upload datasets, and evaluate models using scoring metrics such as **EMD** and **IMA**.

---

## My Work on the Project

### Week 1–2 (16.04 – 27.04)
- Joined the first team meeting and communication tools (e.g. WhatsApp)
- Set up the local development environment using **Docker**, including **PostgreSQL**, **Django**, and **npm**
- Performed database migration and verified project runs locally
- Explored project structure and collaborated on distributing initial tasks
- Added a **GitHub ticket template** to enforce consistent issue tracking in the Kanban board

---

### Week 3 (28.04 – 04.05)
- Created and configured a **DevContainer** for VS Code to simplify setup and debugging
- Made the container build more reliable and faster for development
- Assisted other team members whose systems struggled to build the large container due to memory/CPU constraints

---

### Week 4 (05.05 – 11.05)
- Fixed platform-specific issues with DevContainer builds on lower-resource machines
- Investigated problems with heavy packages like `torch` and `tensorflow` in the container
- Documented alternative setups to ensure everyone could work efficiently

---

### Week 5 (12.05 – 18.05)
- Implemented **sortable leaderboard functionality** in a dedicated feature branch
- Added sorting logic for scores and dates, integrated it into the UI
- Wrote tests and manually debugged rendering issues with table updates

---

### Week 6 (19.05 – 25.05)
- Assisted with reviewing frontend consistency and data flows between components
- Participated in mid-project refactoring discussions for better state handling (e.g. loading states, error fallback)
- Improved error feedback for invalid challenge submissions
- Learned about Django’s form validation system and its extension in REST APIs

---

### Week 7 (26.05 – 01.06)
- Helped improve UX for first-time users, including clearer labels and field validation
- Suggested minor frontend tweaks to clarify submission status for datasets and models
- Studied how Nextjs context and props were used across components and proposed local simplifications

---

### Week 8 (02.06 – 08.06)
- Collaborated on improving the onboarding process: what users see after login or registration
- Tested and gave feedback on submitted challenges for edge-case data inputs
- Began exploration of a lightweight admin approval system (requirements & data model changes)

---

### Week 9 (09.06 – 15.06)
- Studied other open-source Django admin flows and token management to inform our implementation
- Identified a potential CSRF/token bug early during admin prototyping
- Continued planning of a backend-safe way to handle user approval without breaking existing auth logic

---

### Week 10 (16.06 – 22.06)
- Joined team discussions to realign milestones and prioritize completion over complexity
- Researched approaches for simple temporary authentication mechanisms
- Learned how Django’s middleware stack processes CSRF and sessions

---

### Week 11–13 (23.06 – 13.07)
- Designed and implemented an **Admin Approval System**:
  - New users are now marked as unapproved upon registration
  - Admins can log in via a lightweight hardcoded prompt (`username: admin`, `password: admin`)
  - An "Approve All" button sets all `is_approved=false` users to `true`
- Implemented backend logic:
  - New API endpoint (`POST /api/admin/approve-all/`) to batch-approve users
  - Frontend logic loads all unapproved users and displays them
- Encountered major **CSRF token issues** on the admin page, especially with redirects after login
- Due to instability, the feature is currently **not merged into `main`**, but somehow functional in a dev branch

---

## Notes

- My main contributions were in:
  - **Development tooling** (DevContainer, Docker, reproducible environments)
  - **Frontend features** (leaderboard sorting, user-facing flow improvements)
  - **Backend integration** (admin approval system, API design)
- I constantly prioritized **developer experience** and **usability** to improve the platform from both angles
- Collaborated closely with other team members and helped with setup and debugging across machines

---

## Final Thoughts

This internship taught me how to work on a **complex full-stack application**, from initial setup and containerization to API development and frontend logic.  
I learned about:
- Using Docker and DevContainers in collaborative teams
- Navigating large Django projects with custom models and REST APIs
- Building developer-friendly workflows and UI improvements
- Handling tricky issues like **CSRF tokens**, **session logic**, and **admin flows** in production-like environments

Even when some features weren’t merged into `main`, I left fully working implementations and contributed to team-wide discussions about architecture, testing, and UX improvements.
