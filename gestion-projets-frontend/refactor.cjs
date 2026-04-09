const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Create missing directories
const dirsToCreate = ['layouts', 'guards', 'utils', 'hooks', 'store', 'routes'];
dirsToCreate.forEach(dir => {
    const dirPath = path.join(srcDir, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// 2. Move files
const filesToMove = [
    { from: 'components/Layout.tsx', to: 'layouts/Layout.tsx' },
    { from: 'components/Sidebar.tsx', to: 'layouts/Sidebar.tsx' },
    { from: 'components/Topbar.tsx', to: 'layouts/Topbar.tsx' },
    { from: 'router/PrivateRoute.tsx', to: 'guards/PrivateRoute.tsx' },
    { from: 'api/axios.ts', to: 'utils/axiosConfig.ts' }
];

filesToMove.forEach(({ from, to }) => {
    const fromPath = path.join(srcDir, from);
    const toPath = path.join(srcDir, to);
    if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
    }
});

// 3. Delete old directories if empty/exist
['api', 'router'].forEach(dir => {
    const dirPath = path.join(srcDir, dir);
    if (fs.existsSync(dirPath)) {
        try { fs.rmSync(dirPath, { recursive: true, force: true }); } catch (e) {}
    }
});

// 4. Update References in all .ts and .tsx files
function walkFiles(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkFiles(filePath, callback);
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
            callback(filePath);
        }
    }
}

walkFiles(srcDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // We do simple string replaces, assuming standard import syntax
    content = content.replace(/['"]\.\/components\/Layout['"]/g, "'./layouts/Layout'");
    content = content.replace(/['"]\.\.\/components\/Layout['"]/g, "'../layouts/Layout'");
    content = content.replace(/['"]\.\/components\/Sidebar['"]/g, "'./layouts/Sidebar'");
    content = content.replace(/['"]\.\.\/components\/Sidebar['"]/g, "'../layouts/Sidebar'");
    content = content.replace(/['"]\.\/components\/Topbar['"]/g, "'./layouts/Topbar'");
    content = content.replace(/['"]\.\.\/components\/Topbar['"]/g, "'../layouts/Topbar'");

    content = content.replace(/['"]\.\/router\/PrivateRoute['"]/g, "'./guards/PrivateRoute'");
    content = content.replace(/['"]\.\.\/router\/PrivateRoute['"]/g, "'../guards/PrivateRoute'");

    content = content.replace(/['"]\.\/api\/axios['"]/g, "'./utils/axiosConfig'");
    content = content.replace(/['"]\.\.\/api\/axios['"]/g, "'../utils/axiosConfig'");
    content = content.replace(/['"]\.\.\/\.\.\/api\/axios['"]/g, "'../../utils/axiosConfig'");

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
});

console.log("Refactoring complete.");
