# Mayank's Portfolio Site

A React + Vite project with an interactive video background and rocket animation.

## Features

- **Video Background**: Uses `earth.mp4` as a paused background video
- **Rocket Animation**: `rocket.png` smoothly flies upward when "Go" button is clicked
- **Interactive Elements**: 
  - "Mayank's Portfolio" text at top-left
  - "Go" button below the text
  - Video plays for 1 second when button is clicked
- **Smooth Transitions**: Bright fade-in effect followed by final image display

## Required Assets

Make sure these files are in the `public` directory:
- `earth.mp4` - Background video
- `rocket.png` - Rocket image for animation
- `new.svg` - Final image shown after transitions

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`)

## How It Works

1. **Initial State**: Video is paused, rocket is at bottom center, text and button are visible
2. **Button Click**: 
   - Video plays for 1 second
   - Rocket animates upward smoothly
   - Bright overlay fades in
   - Final image replaces everything

## Project Structure

- `src/App.tsx` - Main component with all logic
- `src/app.css` - Styling and animations
- `src/index.css` - Global styles
- `public/` - Static assets (video, images)

## Technologies Used

- Vite (build tool)
- Preact (React-like library)
- CSS3 animations
- HTML5 video