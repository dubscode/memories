# Webdevathon

## **Core Stack**

### Framework

- **Next.js**

### AI Integration

- **Amazon Bedrock** + **Vercel AI SDK** for planning and coding advice, with context stored for future use.

### Authentication

- **Clerk** for user authentication.

### Database

- **Neon DB** task tracking, user stack setup, and context storage.

### Media Storage

- **Tigris Data** for storing images and videos.

### Deployment

- **Fly.io** for hosting.

### UI Library

- **ShadcnUI** for components.

### Image Moderation

- **Amazon Rekognition** for PII and image moderation.

## Data Models

Our application uses the following data models to represent various entities and their relationships:

### Users

- Represents individual users of the application
- Stores basic user information like email, name, and profile image
- Connected to:
  - Challenges (as organizers)
  - Teams (as members and team leads)
  - Submissions
  - Tasks (as assignees)
  - Notes (as authors)
  - File Storage (for user-specific files)

### Challenges

- Represents hackathon events or coding challenges
- Includes details like name, description, start and end dates
- Connected to:
  - Users (organizers)
  - Teams
  - Stages
  - Events
  - Resources
  - Tags (many-to-many)
  - Submissions

### Teams

- Represents groups of users participating in a challenge
- Includes team name, role, and join date
- Connected to:
  - Challenges
  - Users (members and team lead)
  - Submissions
  - Tasks
  - Notes
  - File Storage (for team-specific files)

### Stages

- Represents different phases or milestones within a challenge
- Includes name, description, duration, and order
- Connected to:
  - Challenges
  - Tasks
  - Notes

### Tasks

- Represents specific activities or to-dos within a stage
- Includes details like name, status, estimate, due date
- Connected to:
  - Stages
  - Teams
  - Users (assignees)

### Submissions

- Represents project submissions for challenges
- Includes details like title, description, repository link
- Connected to:
  - Challenges
  - Teams
  - Users (individual submissions)
  - Tags (many-to-many)

### Tags

- Represents labels or categories for challenges and submissions
- Includes name and description
- Connected to:
  - Challenges (many-to-many)
  - Submissions (many-to-many)

### Events

- Represents specific events within a challenge (e.g., workshops, presentations)
- Includes name, description, start and end dates
- Connected to:
  - Challenges

### Resources

- Represents additional materials or links related to a challenge
- Includes title, URL, type, and description
- Connected to:
  - Challenges

### Notes

- Represents text notes or comments
- Can be associated with challenges, stages, or teams
- Connected to:
  - Challenges
  - Stages
  - Teams
  - Users (authors)

### File Storage

- Represents files uploaded to the system
- Can be associated with challenges, teams, or users
- Connected to:
  - Challenges
  - Teams
  - Users

These models form the backbone of our application, allowing for a flexible and comprehensive representation of hackathons, teams, and all related activities and resources.
