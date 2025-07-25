# Promise to Poem Converter

A web application that transforms personal promises into beautiful poems using Gemma 3 AI.

## Features

- Transform personal promises into different poetry styles
- Support for multiple poem styles (Sonnet, Haiku, Limerick, etc.)
- Copy generated poems to clipboard
- Beautiful UI design based on Figma wireframes
- Responsive design with Tailwind CSS

## Design

The application follows a design inspired by Frank and Co's UI style with:

- Soft, elegant color palette with primary color #873053
- Clean typography using Glegoo font for body text
- Rounded input fields with subtle borders
- Consistent spacing and alignment
- Mobile-first responsive design

## Technologies Used

- React with TypeScript
- Vite.js for fast development
- Tailwind CSS for styling
- Gemma 3 AI API for poem generation
- Google Generative AI SDK

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- Gemma 3 API key from Google AI Studio

### Installation

1. Clone the repository:

   ```bash
   git clone https://gitlab.com/leveratedev/proto-poetry-ideation.git
   cd proto-poetry-ideation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Gemma 3 API key:

   ```
   VITE_GEMMA_API_KEY=your_gemma_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Key Setup

This application requires a Gemma 3 API key to work. Follow these steps to set it up:

1. Visit [Google AI Developer Portal](https://ai.google.dev/) and sign up for a Gemma API key
2. Request access to the google/gemma-3-27b-it model
3. Create a file named `.env` in the project root directory
4. Copy the contents from `env.example` to your `.env` file
5. Replace `your_gemma_api_key_here` with your actual Gemma API key
6. Restart the application if it's already running

**Important**: Never commit your `.env` file to version control.

## Running the Application

### Development Mode

This application consists of two parts that need to run simultaneously: the frontend React application and the backend server that handles API calls to Google's AI models.

#### Step 1: Start the Backend Server

1. Open a terminal window in the project root directory and run:

   ```bash
   node server.js
   ```

   This will start the proxy server at http://localhost:3000. You should see a message:

   ```
   Proxy server running at http://localhost:3000
   ```

   Alternatively, you can use the server in the server directory which has more detailed logging:

   ```bash
   cd server
   node server.js
   ```

#### Step 2: Start the Frontend Application

1. Open a new terminal window in the project root directory and run:

   ```bash
   npm run dev
   ```

2. This will start the Vite development server, typically at http://localhost:5173. You can access the application in your browser at this address.

### Production Mode

For production deployment:

1. Build the frontend application:

   ```bash
   npm run build
   ```

   This creates optimized production files in the `dist` directory.

2. To preview the production build locally:

   ```bash
   npm run preview
   ```

3. For actual deployment, you'll need to:
   - Deploy the backend server (server.js) to a Node.js hosting environment
   - Deploy the frontend static files (from the `dist` directory) to a static hosting service
   - Ensure the frontend is configured to connect to your deployed backend URL

## Troubleshooting

- **API Key Issues**: If you encounter errors about the API key, ensure it's correctly set in the .env file and that you have access to the Gemma models.
- **Server Connection Errors**: Make sure the server is running at http://localhost:3000 before using the frontend application.
- **CORS Issues**: If you experience CORS errors, verify that the server is properly configured to allow requests from the frontend domain.

## Development

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Local Development

To run this application locally, you need to:

1. Create a `.env` file in the root directory:

   ```
   # Copy the template
   cp env-example.txt .env

   # Edit the .env file and add your Gemma API key
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Install the concurrently package for running multiple servers:

   ```bash
   npm install --save-dev concurrently
   ```

4. Run both the frontend and backend servers:
   ```bash
   npm run dev:all
   ```

This will start:

- The React development server on port 5173 (http://localhost:5173)
- The Express API server on port 3000 (http://localhost:3000)

You can also run them separately:

- Frontend only: `npm run dev`
- Backend only: `npm run dev:server`

## License

MIT

---

# GitLab Project Information

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/leveratedev/proto-poetry-ideation.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/leveratedev/proto-poetry-ideation/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
