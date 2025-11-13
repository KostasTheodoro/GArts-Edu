#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Image Optimization Script\n');
console.log('⚠️  This script will:');
console.log('   1. Create backups of original files');
console.log('   2. Resize and compress images');
console.log('   3. Show before/after sizes\n');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.log('❌ Sharp not found. Installing...');
  console.log('Run: npm install sharp --save-dev\n');
  process.exit(1);
}

const BACKUP_DIR = 'assets-backup';

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('✅ Created backup directory\n');
}

// Optimization tasks
const tasks = [
  {
    name: 'Progression Level Icons',
    files: [
      'public/images/progression-level/Vertex.png',
      'public/images/progression-level/Edge.png',
      'public/images/progression-level/Face.png',
      'public/images/progression-level/Mesh.png',
    ],
    targetWidth: 300,
    quality: 90,
    format: 'png',
  },
  {
    name: 'CGI Render (convert to JPEG)',
    files: ['assets/images/cgi-render.png'],
    targetWidth: 1920,
    quality: 85,
    format: 'jpeg',
    outputName: 'cgi-render.jpg',
  },
  {
    name: 'Studio Interior Photos',
    files: [
      'assets/images/studio-interior-1.jpg',
      'assets/images/studio-interior-2.jpg',
    ],
    targetWidth: 2000,
    quality: 82,
    format: 'jpeg',
  },
  {
    name: 'About Page Photos',
    files: ['assets/images/about-1.jpg', 'assets/images/about-2.jpg'],
    targetWidth: 2000,
    quality: 82,
    format: 'jpeg',
  },
];

async function optimizeImage(filePath, options) {
  const { targetWidth, quality, format, outputName } = options;
  const fileStats = fs.statSync(filePath);
  const originalSize = fileStats.size;

  // Backup original
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  fs.copyFileSync(filePath, backupPath);

  // Optimize
  const outputPath = outputName
    ? filePath.replace(path.basename(filePath), outputName)
    : filePath;

  await sharp(filePath)
    .resize(targetWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    [format]({ quality })
    .toFile(outputPath + '.tmp');

  // Replace original
  fs.renameSync(outputPath + '.tmp', outputPath);

  const newStats = fs.statSync(outputPath);
  const newSize = newStats.size;
  const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

  return {
    file: fileName,
    before: (originalSize / 1024 / 1024).toFixed(2) + 'MB',
    after: (newSize / 1024 / 1024).toFixed(2) + 'MB',
    reduction: reduction + '%',
  };
}

async function runOptimization() {
  console.log('🚀 Starting optimization...\n');

  let totalBefore = 0;
  let totalAfter = 0;

  for (const task of tasks) {
    console.log(`📦 ${task.name}`);
    console.log('─'.repeat(50));

    for (const file of task.files) {
      if (!fs.existsSync(file)) {
        console.log(`⚠️  ${file} not found, skipping...`);
        continue;
      }

      try {
        const result = await optimizeImage(file, task);
        const beforeMB = parseFloat(result.before);
        const afterMB = parseFloat(result.after);

        totalBefore += beforeMB;
        totalAfter += afterMB;

        console.log(`✅ ${result.file}`);
        console.log(`   ${result.before} → ${result.after} (saved ${result.reduction})`);
      } catch (err) {
        console.log(`❌ Failed to optimize ${file}: ${err.message}`);
      }
    }
    console.log('');
  }

  console.log('═'.repeat(50));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(50));
  console.log(`Total before: ${totalBefore.toFixed(2)}MB`);
  console.log(`Total after:  ${totalAfter.toFixed(2)}MB`);
  console.log(
    `Total saved:  ${(totalBefore - totalAfter).toFixed(2)}MB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`
  );
  console.log(`\n✅ Backups saved in: ${BACKUP_DIR}/`);
  console.log('\n💡 To restore originals: copy files from assets-backup/');
}

runOptimization().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
