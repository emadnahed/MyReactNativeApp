#!/usr/bin/env node

const fs = require('fs-extra');
const sharp = require('sharp');
const path = require('path');

async function setupAndroidIcons() {
  const basePath = path.join(__dirname, '../android/app/src/main/res');
  const sourceIcon = path.join(__dirname, '../assets/appIcon.png');
  
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found at:', sourceIcon);
    return;
  }

  const sizes = [
    { folder: 'mipmap-mdpi', size: 48 },
    { folder: 'mipmap-hdpi', size: 72 },
    { folder: 'mipmap-xhdpi', size: 96 },
    { folder: 'mipmap-xxhdpi', size: 144 },
    { folder: 'mipmap-xxxhdpi', size: 192 }
  ];

  console.log('Setting up Android icons...');

  for (const { folder, size } of sizes) {
    const targetDir = path.join(basePath, folder);
    const targetFile = path.join(targetDir, 'ic_launcher.png');
    
    // Ensure directory exists
    await fs.ensureDir(targetDir);
    
    // Resize and save icon
    await sharp(sourceIcon)
      .resize(size, size)
      .png()
      .toFile(targetFile);
    
    console.log(`✓ Generated ${folder}/ic_launcher.png (${size}x${size})`);
  }
}

async function setupIOSIcons() {
  const basePath = path.join(__dirname, '../ios/MyReactNativeApp/Images.xcassets/AppIcon.appiconset');
  const sourceIcon = path.join(__dirname, '../assets/appIcon.png');
  
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found at:', sourceIcon);
    return;
  }

  // iOS icon sizes required for AppIcon.appiconset
  const iosSizes = [
    { size: 20, scale: 2, filename: 'AppIcon-20x20@2x.png' },
    { size: 20, scale: 3, filename: 'AppIcon-20x20@3x.png' },
    { size: 29, scale: 2, filename: 'AppIcon-29x29@2x.png' },
    { size: 29, scale: 3, filename: 'AppIcon-29x29@3x.png' },
    { size: 40, scale: 2, filename: 'AppIcon-40x40@2x.png' },
    { size: 40, scale: 3, filename: 'AppIcon-40x40@3x.png' },
    { size: 60, scale: 2, filename: 'AppIcon-60x60@2x.png' },
    { size: 60, scale: 3, filename: 'AppIcon-60x60@3x.png' },
    { size: 76, scale: 2, filename: 'AppIcon-76x76@2x.png' },
    { size: 83.5, scale: 2, filename: 'AppIcon-83.5x83.5@2x.png' },
    { size: 1024, scale: 1, filename: 'AppIcon-512@2x.png' }
  ];

  console.log('Setting up iOS icons...');

  // Ensure directory exists
  await fs.ensureDir(basePath);

  for (const { size, scale, filename } of iosSizes) {
    const targetFile = path.join(basePath, filename);
    const actualSize = Math.round(size * scale);
    
    // Resize and save icon
    await sharp(sourceIcon)
      .resize(actualSize, actualSize)
      .png()
      .toFile(targetFile);
    
    console.log(`✓ Generated ${filename} (${actualSize}x${actualSize})`);
  }

  // Create/update Contents.json if it doesn't exist
  const contentsJson = {
    "images": iosSizes.map(({ size, scale, filename }) => ({
      "idiom": "universal",
      "platform": "ios",
      "size": `${size}x${size}`,
      "scale": scale === 1 ? "1x" : scale === 2 ? "2x" : "3x",
      "filename": filename
    })),
    "info": {
      "version": 1,
      "author": "xcode"
    }
  };

  await fs.writeJSON(path.join(basePath, 'Contents.json'), contentsJson, { spaces: 2 });
  console.log('✓ Updated Contents.json');
}

async function setupIcons() {
  console.log('Setting up app icons for iOS and Android...\n');
  
  try {
    await setupAndroidIcons();
    console.log('');
    await setupIOSIcons();
    console.log('\n✓ App icons setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Commit the generated icon files to your repository');
    console.log('2. Clean and rebuild your project:');
    console.log('   yarn clean:android && yarn clean:ios');
    console.log('   yarn android && yarn ios');
  } catch (error) {
    console.error('Error setting up icons:', error);
    process.exit(1);
  }
}

setupIcons();
