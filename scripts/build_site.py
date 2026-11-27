"""Generate the site from content/ and export only the public static files.

    python scripts/build_site.py           gera index.html e assets/content.js e exporta dist/
    python scripts/build_site.py --check   só confere se os arquivos gerados estão em dia
"""
from pathlib import Path
import shutil
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content import ROOT, ContentError, generate, stale_files  # noqa: E402


def main():
    try:
        if '--check' in sys.argv[1:]:
            stale = stale_files()
            if stale:
                names = ', '.join(str(path.relative_to(ROOT)) for path in stale)
                raise SystemExit(f'Arquivos desatualizados em relação a content/: {names}. Rode: python scripts/build_site.py')
            print('Conteúdo gerado em dia com content/.')
            return
        for path, body in generate().items():
            if not path.is_file() or path.read_text(encoding='utf-8') != body:
                path.write_text(body, encoding='utf-8', newline='\n')
                print(f'Gerado {path.relative_to(ROOT)}')
    except ContentError as error:
        raise SystemExit(f'Erro no conteúdo: {error}') from None
    destination = ROOT / 'dist'
    destination.mkdir(exist_ok=True)
    shutil.copy2(ROOT / 'index.html', destination / 'index.html')
    shutil.copy2(ROOT / '404.html', destination / '404.html')
    shutil.copytree(ROOT / 'assets', destination / 'assets', dirs_exist_ok=True)
    if (ROOT / 'CNAME').is_file():
        shutil.copy2(ROOT / 'CNAME', destination / 'CNAME')
    print(f'Site exportado para {destination}')


if __name__ == '__main__':
    main()
