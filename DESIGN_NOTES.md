# Design Notes (max 1 page)

## Architecture choice
- I used a client-server architecture with REST apis mostly beacuse it allowed me to have more control over the applicaion. The frontend is mostly for user interaction and the backend handles most of the heavy lifing like authentication and processing logic.
-

## Data model
- The system has users and assets where a single user can have multiple assets linked to them via a userId assigned when they create the account.

## Edge cases handled
- Empty fields and invalid inputs are handled on the frontend with ui states and error messages.
- Duplicate account creation are handled at the backend using emails that are single use.
Unauthorized access is handled using authentication guards. 

## Risks and mitigations
- Authentication risks were mitigated by redirecting unauthorized that try to access the applicaton by typing on the search bar.

## What I'd do next
- Implent an admin platform.
- Include pagination for when records become more and api requests begin to lag.
