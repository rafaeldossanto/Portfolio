"""Export only the static files used by the standalone portfolio."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
destination = root / 'dist'
destination.mkdir(exist_ok=True)
shutil.copy2(root / 'index.html', destination / 'index.html')
if (root / 'CNAME').is_file():
    shutil.copy2(root / 'CNAME', destination / 'CNAME')
print(f'Site exportado para {destination}')
