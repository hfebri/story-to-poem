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
   git clone <repository-url>
   cd story-to-poem
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

## Development

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## License

MIT
