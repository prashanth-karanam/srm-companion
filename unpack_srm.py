import urllib.request
import re

def unpack_dean_edwards(js):
    pattern = r"\}\('(.*)',\s*(\d+),\s*(\d+),\s*'([^']+)'\.split\('\|'\)"
    match = re.search(pattern, js, re.DOTALL)
    if not match:
        pattern2 = r"\}\(\s*['\"](.*?)['\"]\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*['\"](.*?)['\"]\.split\('\|'\)"
        match = re.search(pattern2, js, re.DOTALL)
        if not match:
            return 'Could not match packer pattern'
    p, a, c, k_str = match.groups()
    a = int(a)
    c = int(c)
    k = k_str.split('|')

    digs = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    def repl(m):
        word = m.group(0)
        val = 0
        for ch in word:
            if ch in digs:
                val = val * a + digs.index(ch)
            else:
                return word
        if val < len(k) and k[val]:
            return k[val]
        return word

    res = re.sub(r'\b\w+\b', repl, p)
    return res

for path in ['guardloginbottom.js', 'secure2.js', 'guardlogin.js']:
    url = f'https://sp.srmist.edu.in/srmiststudentportal/resources/js/{path}'
    try:
        txt = urllib.request.urlopen(url).read().decode('utf-8', errors='ignore')
        print(f'=== UNPACKED {path} ===')
        unp = unpack_dean_edwards(txt)
        print(unp[:1200])
        print('\n' + '='*50 + '\n')
    except Exception as e:
        print(f'Error: {e}')
