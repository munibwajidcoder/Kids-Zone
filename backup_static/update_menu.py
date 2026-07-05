import os
import re

def update_html_files():
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    mobile_btn_pattern = re.compile(r'(?s)<button class="mobile-menu-btn">.*?</button>')
    navbar_pattern = re.compile(r'<nav class="top-navbar">')
    
    new_btn_html = '''<button class="mobile-menu-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </button>'''
    
    for filename in html_files:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove old button(s)
        content = mobile_btn_pattern.sub('', content)
        
        # Add new button inside navbar
        content = navbar_pattern.sub(f'<nav class="top-navbar">\n                {new_btn_html}', content)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")

if __name__ == "__main__":
    update_html_files()
