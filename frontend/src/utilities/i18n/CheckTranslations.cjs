const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../../assets/locales');
const languages = fs.readdirSync(localesDir);

// Read JSON file and return parsed content
function readJSONFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Collect file structures for each language
const languageFiles = {};
languages.forEach(lang => {
  const langDir = path.join(localesDir, lang);
  if (fs.lstatSync(langDir).isDirectory()) {
    languageFiles[lang] = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));
  }
});

// Ensure all languages have the same files
const referenceFiles = languageFiles[languages[0]] || [];
const missingFileLanguages = {};

languages.forEach(lang => {
  const missingFiles = referenceFiles.filter(file => !languageFiles[lang].includes(file));
  if (missingFiles.length > 0) {
    missingFileLanguages[lang] = missingFiles;
  }
});

if (Object.keys(missingFileLanguages).length > 0) {
  console.error('Some languages are missing translation files:');
  console.error(missingFileLanguages);
  process.exit(1);
}

// Check for missing keys in each file
const missingKeysReport = {};
referenceFiles.forEach(file => {
  const allKeys = new Set();
  const fileTranslations = {};

  languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, file);
    const jsonContent = readJSONFile(filePath);
    fileTranslations[lang] = jsonContent;
    Object.keys(jsonContent).forEach(key => allKeys.add(key));
  });

  languages.forEach(lang => {
    const missingKeys = [...allKeys].filter(key => !fileTranslations[lang].hasOwnProperty(key));
    if (missingKeys.length > 0) {
      if (!missingKeysReport[file]) missingKeysReport[file] = {};
      missingKeysReport[file][lang] = missingKeys;
    }
  });
});

if (Object.keys(missingKeysReport).length > 0) {
  console.error('Some translation files are missing keys:');
  console.error(missingKeysReport);
  process.exit(1);
} else {
  console.log('All translation files contain the same keys.');
}
