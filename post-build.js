
const fs = require('fs');
const path = require('path');

const childFolder = path.join(__dirname, 'dist/browser'); // Update with your child folder path
const parentFolder = path.join(__dirname, 'dist'); // Update with your parent folder path

// Function to move files from child folder to parent folder
const moveFiles = (childDir, parentDir) => {
  fs.readdir(childDir, (err, files) => {
    if (err) {
      return console.error(`Unable to scan directory: ${err}`);
    }

    files.forEach(file => {
      const childFilePath = path.join(childDir, file);
      const parentFilePath = path.join(parentDir, file);

      fs.rename(childFilePath, parentFilePath, (err) => {
        if (err) {
          return console.error(`Unable to move file: ${err}`);
        }
        console.log(`Moved: ${file}`);
      });
    });
  });
};

// Ensure the parent directory exists
if (!fs.existsSync(parentFolder)) {
  fs.mkdirSync(parentFolder, { recursive: true });
}

// Move files
moveFiles(childFolder, parentFolder);
