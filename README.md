# AI Database Schema Creator

## Overview

This project is a web application that allows users to design database schemas interactively with AI assistance. Users describe their database needs, and the system generates a schema that can be viewed, shared, and downloaded.

## Link to live app: [https://keymap-ai-gen-db-schema.vercel.app/](https://keymap-ai-gen-db-schema.vercel.app/)
## Link to a shared project: [https://keymap-ai-gen-db-schema.vercel.app/chat/d868f63e-8001-4f17-a5e3-e16ce24ca318](https://keymap-ai-gen-db-schema.vercel.app/chat/d868f63e-8001-4f17-a5e3-e16ce24ca318)

## Tech Stack

- **Next.js**: Full-stack framework combining React for UI and API route handlers for backend logic.
- **OpenAI**: Generates structured database schemas based on user input.
- **React Flow**: Renders interactive database schema diagrams.
- **@dbml/core**: Converts database schema between DBML and SQL.
- **Zod**: Validates data across frontend and backend.
- **Tailwind & shadcn/ui**: Provides a modern UI design.
- **MongoDB**: Stores user sessions and conversation history.

## Features

### Frontend

- Responsive UI following Figma design with added loading states for better UX.
- Users enter a prompt describing their database, initiating a chat with the AI.
- Schema visualization in an interactive React Flow widget.
- Conversations are saved, allowing users to revisit and share project URLs.
- Users can download schemas as SQL.
- Anonymous login via secure cookies.
- Only project creators can edit shared projects.

### Backend

- Next.js API routes handle AI interactions and database operations.
- Stores user sessions and schema conversations in MongoDB.
- AI receives structured input and maintains conversation history for better context.

## Schema Generation Approach
The AI model generates the schema in the CDBS format based on the conversation with the user. DBML was not used for either rendering the schema on the frontend or as the preferred AI response because it's data structure is bloated with a properties we won't need

Instead of generating DBML directly, a **Custom Database Structure (CDBS)** was created for:

- Efficient AI responses with minimal token usage since CDBS is shorter than DBML, assuming they are representing the same logical information.
- Easier rendering in React Flow.
- Seamless conversion to DBML, then SQL


## AI Integration

- I used OpenAI's structured output generation, ensuring that the AI response conforms to the provided schema—in this case, the custom database structure (CDBS).
- I gave it a system prompt to act as a database design architect and instructed it to ensure that relationships (foreign keys) match the CDBS correctly.
- Whenever a message is sent, all previous messages are included as user/AI-assistant prompts to provide additional context. The most recent schema is also passed to the model for better accuracy.
- The system prompt also instructs the model to be interactive, guiding the user to provide more details until a complete schema is generated.
- AI responses are not streamed because they need to be parsed, and incomplete data could break the React Flow component.

## Running the Project

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables (MongoDB, OpenAI API key) with the `.env.example` file
4. Start the app: `npm run dev`

## Screenshots
![Desktop Homepage](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/desktop-homepage.png)
![Desktop Ongoing Conversation](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/desktop-ongoing-conversation.png)
![Desktop Projects View](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/desktop-projects-view.png)
![Desktop Open Action Dropdown](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/desktop-opened-action-dropdown.png)
![Desktop Copy or Download SQL Schema](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/desktop-download-copy-sql-schema.png)
![Desktop Share Link](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/desktop-share-link.png)
![Mobile Homepage](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/mobile-homepage.png)
![Mobile Ongoing Conversation](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/mobile-ongoing-conversation.png)
![Mobile Projects View](https://github.com/dopewevmond/keymap-ai-gen-db-schema/blob/main/public/screenshots/mobile-projects-view.png)

