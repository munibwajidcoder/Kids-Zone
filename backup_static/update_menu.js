const fs = require('fs');
const path = require('path');

const updateHtmlFiles = () => {
    const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
    
    const mobileBtnRegex = /<button class="mobile-menu-btn">[\s\S]*?<\/button>/g;
    const navbarRegex = /<nav class="top-navbar">/g;
    
    const newBtnHtml = `<button class="mobile-menu-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </button>`;
    
    files.forEach(filename => {
        let content = fs.readFileSync(filename, 'utf8');
        
        // Remove old button(s)
        content = content.replace(mobileBtnRegex, '');
        
        // Add new button inside navbar
        content = content.replace(navbarRegex, `<nav class="top-navbar">\n                ${newBtnHtml}`);
        
        fs.writeFileSync(filename, content);
        console.log(`Updated ${filename}`);
    });
};

updateHtmlFiles();
