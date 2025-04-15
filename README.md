# English Text Corrector

## Project Description

English Text Corrector is a web application that automatically corrects English text while preserving the original style. It provides detailed educational commentary that explains errors and offers insights into common mistakes. Users can choose between formal or natural correction styles, and if unsatisfied with a correction, request a regeneration of the result. The application also maintains a history of corrections and supports secure user registration and login.

## Tech Stack

- **Frontend:**
  - Next.js 15 (with App Router)
  - React 19
  - TypeScript 5
  - Tailwind CSS 4
- **Backend:**
  - Supabase for PostgreSQL, Backend-as-a-Service, and built-in authentication
- **AI Integration:**
  - Openrouter.ai for connecting to various AI models (e.g., OpenAI, Anthropic, Google, etc.)
- **CI/CD & Hosting:**
  - GitHub Actions for CI/CD pipelines
  - DigitalOcean for hosting via Docker

## Getting Started Locally

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd /path/to/project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Ensure you are using the Node.js version specified in the `.nvmrc` file.
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Available Scripts

- **`npm run dev`**: Starts the Next.js development server using Turbopack.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Runs ESLint to check for code quality and adherence to guidelines.

## Project Scope

The English Text Corrector application includes:

- Automatic text correction for English input, limited to 2000 characters.
- Detailed, context-aware educational commentary explaining detected errors.
- Options to select correction style (formal or natural) on each correction, with the ability to set a default style in the user profile.
- A feature to regenerate corrections if the initial result is unsatisfactory.
- Automatic saving and management of correction history, allowing users to review or delete previous corrections.
- Secure user registration and login to manage personal correction histories and profile settings.

## Project Status

This project is currently in its Minimum Viable Product (MVP) stage, focusing exclusively on the web application.

## License

This project is licensed under the MIT License.