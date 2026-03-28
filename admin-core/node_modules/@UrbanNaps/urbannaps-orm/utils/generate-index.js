const fs = require('fs-extra');
const readdirp = require('readdirp');

const directoryPath = './src'; // Replace with your directory path
const indexPath = `${directoryPath}/index.ts`;
const exportedStatements = [`import 'reflect-metadata';`, ''];

fs.removeSync(indexPath);

// Recursive directory scanning using readdirp
readdirp(directoryPath, { root: directoryPath, fileFilter: ['*.ts'], directoryFilter: ['!.git', '!node_modules', '!migration'] })
  .on('data', (entry) => {
    // For each TypeScript file, generate an export statement
    const exportStatement = `export * from './${entry.path.replace('.ts', '')}';`;

    exportedStatements.push(exportStatement);

    // Append export statements to the index.ts file

  })
  .on('end', () => {
    fs.writeFileSync(indexPath, exportedStatements.join('\n'));
    console.log(`Generated ${indexPath}`);
  });