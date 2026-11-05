"""Validate the standalone site without making network requests."""
from __future__ import annotations

import base64
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.panels = set()
        self.hrefs = []
        self.scripts = []
        self.current_script = None
        self.images = []
        self.title = []
        self.in_title = False
        self.has_viewport = False

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if attrs.get('data-panel'):
            self.panels.add(attrs['data-panel'])
        if tag == 'a' and 'href' in attrs:
            self.hrefs.append(attrs['href'])
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'meta' and attrs.get('name') == 'viewport':
            self.has_viewport = 'width=device-width' in attrs.get('content', '')
        if tag == 'title':
            self.in_title = True
        if tag == 'script' and not attrs.get('src') and attrs.get('type', '') in ('', 'text/javascript', 'module'):
            self.current_script = []

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script' and self.current_script is not None:
            self.scripts.append(''.join(self.current_script))
            self.current_script = None

    def handle_data(self, value):
        if self.in_title:
            self.title.append(value)
        if self.current_script is not None:
            self.current_script.append(value)


def main():
    parser = SiteParser()
    parser.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    duplicates = [key for key, count in Counter(parser.ids).items() if count > 1]
    if duplicates:
        raise SystemExit(f'IDs duplicados: {duplicates}')
    if not ''.join(parser.title).strip() or not parser.has_viewport:
        raise SystemExit('O site precisa de título e viewport responsivo.')
    routes = {key.removeprefix('view-') for key in parser.ids if key.startswith('view-')}
    routes |= parser.panels | {'', 'trilha'}
    for href in parser.hrefs:
        if href.startswith('#/'):
            if href[2:] not in routes:
                raise SystemExit(f'Rota sem destino: {href}')
        elif href.startswith('#'):
            if href[1:] and href[1:] not in parser.ids:
                raise SystemExit(f'Âncora sem destino: {href}')
        elif not urlsplit(href).scheme:
            target = (ROOT / unquote(urlsplit(href).path)).resolve()
            if not target.is_relative_to(ROOT) or not target.exists():
                raise SystemExit(f'Arquivo local inválido: {href}')
    for image in parser.images:
        if 'alt' not in image:
            raise SystemExit('Imagem sem texto alternativo.')
        source = image.get('src', '')
        if source.startswith('data:') and ';base64,' in source:
            base64.b64decode(source.split(',', 1)[1], validate=True)
    for index, script in enumerate(parser.scripts, 1):
        result = subprocess.run(['node', '--check'], input=script, text=True, capture_output=True)
        if result.returncode:
            raise SystemExit(f'JavaScript inválido no bloco {index}:\n{result.stderr}')
    print(f'Site validado: {len(routes)} rotas, {len(parser.images)} imagem(ns), {len(parser.scripts)} script(s).')


if __name__ == '__main__':
    main()
