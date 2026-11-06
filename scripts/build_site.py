"""Export only public static files used by the portfolio."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
destination = root / 'dist'
destination.mkdir(exist_ok=True)
shutil.copy2(root / 'index.html', destination / 'index.html')
shutil.copy2(root / '404.html', destination / '404.html')
shutil.copytree(root / 'assets', destination / 'assets', dirs_exist_ok=True)
if (root / 'CNAME').is_file():
    shutil.copy2(root / 'CNAME', destination / 'CNAME')
print(f'Site exportado para {destination}')
