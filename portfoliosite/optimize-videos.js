#!/usr/bin/env node

/**
 * Video Optimization Script
 * This script provides commands to optimize videos for web delivery
 * 
 * Prerequisites:
 * - Install FFmpeg: https://ffmpeg.org/download.html
 * - Run: npm install -g @ffmpeg-installer/ffmpeg
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// Video optimization settings
const videoSettings = {
  // High quality for main videos
  high: {
    crf: 23,
    preset: 'medium',
    maxrate: '2M',
    bufsize: '4M'
  },
  // Medium quality for background videos
  medium: {
    crf: 28,
    preset: 'fast',
    maxrate: '1M',
    bufsize: '2M'
  },
  // Low quality for transition videos
  low: {
    crf: 32,
    preset: 'ultrafast',
    maxrate: '500k',
    bufsize: '1M'
  }
};

function optimizeVideo(inputPath, outputPath, quality = 'medium') {
  const settings = videoSettings[quality];
  
  const command = `ffmpeg -i "${inputPath}" -c:v libx264 -crf ${settings.crf} -preset ${settings.preset} -maxrate ${settings.maxrate} -bufsize ${settings.bufsize} -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;
  
  console.log(`Optimizing ${inputPath} with ${quality} quality...`);
  console.log(`Command: ${command}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Optimized: ${outputPath}`);
    
    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`📊 Size reduction: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(optimizedSize / 1024 / 1024).toFixed(1)}MB (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

function createWebMVersion(inputPath, outputPath) {
  const command = `ffmpeg -i "${inputPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -movflags +faststart "${outputPath}"`;
  
  console.log(`Creating WebM version: ${outputPath}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ WebM created: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error creating WebM ${outputPath}:`, error.message);
  }
}

function optimizeAllVideos() {
  const videos = [
    { input: 'Intro.mp4', quality: 'high' },
    { input: 'space1.mp4', quality: 'medium' },
    { input: 'Transition.mp4', quality: 'low' }
  ];
  
  console.log('🎬 Starting video optimization...\n');
  
  videos.forEach(({ input, quality }) => {
    const inputPath = path.join(publicDir, input);
    const outputPath = path.join(publicDir, input.replace('.mp4', '_optimized.mp4'));
    const webmPath = path.join(publicDir, input.replace('.mp4', '.webm'));
    
    if (fs.existsSync(inputPath)) {
      // Create optimized MP4
      optimizeVideo(inputPath, outputPath, quality);
      
      // Create WebM version for better compression
      createWebMVersion(inputPath, webmPath);
      
      console.log(''); // Empty line for readability
    } else {
      console.log(`⚠️  Video not found: ${inputPath}`);
    }
  });
  
  console.log('🎉 Video optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Update your video sources to use the optimized versions');
  console.log('2. Add WebM as a fallback for better browser support');
  console.log('3. Consider using a CDN for video delivery');
}

// Run optimization if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeAllVideos();
}

export { optimizeVideo, createWebMVersion, optimizeAllVideos };
