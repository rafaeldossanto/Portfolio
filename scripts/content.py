"""Load the portfolio content from content/ and render it into the site files.

The content lives in JSON files so it can be updated without touching HTML or JavaScript.
Every visible text is either a plain string (the same in both languages) or an object
with the two translations side by side: {"pt": "...", "en": "..."}.
"""
from __future__ import annotations

from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content'
LANGS = ('pt', 'en')
GENERATED_JS = ROOT / 'assets' / 'content.js'
BACK = {'pt': '← projetos', 'en': '← projects'}
BACK_FOOTER = {'pt': '← voltar aos projetos', 'en': '← back to projects'}
EXTERNAL = 'target="_blank" rel="noopener noreferrer"'
# Case studies are drawn in the browser; their block types map to the kinds portfolio.js knows.
CASE_STUDY_KINDS = {'paragraphs': 'paragraphs', 'grid': 'grid', 'facts': 'list', 'repos': 'paths'}
CASE_STUDY_FIELDS = {'paragraphs': None, 'grid': 'name', 'facts': 'title', 'repos': 'path'}


class ContentError(Exception):
    pass


# ---------------------------------------------------------------- loading and validation

def load():
    site = _read_json(CONTENT / 'site.json')
    order = site.get('projects', {})
    listed = [*order.get('caseStudies', []), *order.get('pages', [])]
    files = {path.stem for path in (CONTENT / 'projects').glob('*.json')}
    missing = [name for name in listed if name not in files]
    if missing:
        raise ContentError(f'content/site.json cita projetos sem arquivo em content/projects/: {missing}')
    unlisted = sorted(files - set(listed))
    if unlisted:
        raise ContentError(f'Projetos fora de "projects.caseStudies" ou "projects.pages" em content/site.json: {unlisted}')
    for name in order.get('cards', []):
        if name not in order.get('pages', []):
            raise ContentError(f'O cartão "{name}" precisa ser também uma página em "projects.pages".')
    projects = {}
    for name in listed:
        project = _read_json(CONTENT / 'projects' / f'{name}.json')
        where = f'content/projects/{name}.json'
        _check_project(project, name, where)
        projects[name] = project
    keys = [project['slug'] for project in projects.values()]
    if len(set(keys)) != len(keys):
        raise ContentError(f'Há "slug" repetido entre os projetos: {keys}')
    for key, value in site.get('text', {}).items():
        _check_text(value, f'content/site.json → text.{key}')
    return site, projects


def _read_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except FileNotFoundError:
        raise ContentError(f'Arquivo não encontrado: {path.relative_to(ROOT)}') from None
    except json.JSONDecodeError as error:
        raise ContentError(f'JSON inválido em {path.relative_to(ROOT)}, linha {error.lineno}: {error.msg}') from None


def _check_text(value, where):
    if isinstance(value, str):
        if not value.strip():
            raise ContentError(f'Texto vazio em {where}')
        return
    if not isinstance(value, dict) or set(value) != set(LANGS):
        raise ContentError(f'{where} precisa ser um texto ou {{"pt": "...", "en": "..."}}')
    for lang in LANGS:
        if not isinstance(value[lang], str) or not value[lang].strip():
            raise ContentError(f'Falta o texto em "{lang}" em {where}')


def _require(obj, keys, where):
    for key in keys:
        if key not in obj:
            raise ContentError(f'Falta o campo "{key}" em {where}')


BLOCK_FIELDS = {
    'note': ('paragraphs', None),
    'facts': ('items', ('text',)),
    'grid': ('items', ('name', 'text')),
    'stats': ('items', ('value', 'label')),
    'pins': ('items', ('icon', 'label')),
    'repos': ('items', ('path',)),
    'muted': ('html', None),
    'package': ('items', ('name', 'text')),
    'chips': ('items', None),
    'paragraphs': ('items', ('text',)),
}
TEXT_FIELDS = {'title', 'text', 'name', 'meta', 'value', 'label', 'path'}


def _check_project(project, name, where):
    _require(project, ('slug', 'route', 'page', 'title', 'sections'), where)
    if project['route'] != name:
        raise ContentError(f'"route" em {where} precisa ser igual ao nome do arquivo ("{name}").')
    _check_text(project['title'], f'{where} → title')
    if project['page'] == 'full':
        _require(project, ('kicker', 'lead', 'links'), where)
        for field in ('kicker', 'lead', 'colophon'):
            if field in project:
                _check_text(project[field], f'{where} → {field}')
        for index, link in enumerate(project['links']):
            _require(link, ('label', 'href'), f'{where} → links[{index}]')
            _check_text(link['label'], f'{where} → links[{index}].label')
        if 'card' in project:
            card = project['card']
            _require(card, ('when', 'summary', 'chips'), f'{where} → card')
            for field in ('title', 'when', 'summary'):
                if field in card:
                    _check_text(card[field], f'{where} → card.{field}')
            if not (CONTENT / 'previews' / f'{name}.svg').is_file():
                raise ContentError(f'O cartão de {where} precisa da imagem content/previews/{name}.svg')
    elif project['page'] == 'case-study':
        _require(project, ('summary', 'architecture', 'tags', 'repository'), where)
        _check_text(project['summary'], f'{where} → summary')
        _check_text(project['architecture'], f'{where} → architecture')
    else:
        raise ContentError(f'"page" em {where} precisa ser "full" ou "case-study".')
    for index, section in enumerate(project['sections']):
        at = f'{where} → sections[{index}]'
        _require(section, ('title', 'blocks'), at)
        _check_text(section['title'], f'{at}.title')
        if project['page'] == 'case-study':
            if len(section['blocks']) != 1 or section['blocks'][0].get('type') not in CASE_STUDY_KINDS:
                raise ContentError(f'{at}: estudos de caso usam um bloco por seção, do tipo {sorted(CASE_STUDY_KINDS)}.')
        for position, block in enumerate(section['blocks']):
            _check_block(block, f'{at}.blocks[{position}]')


def _check_block(block, where):
    kind = block.get('type')
    if kind not in BLOCK_FIELDS:
        raise ContentError(f'Tipo de bloco desconhecido em {where}: {kind!r}. Use um de {sorted(BLOCK_FIELDS)}.')
    field, item_fields = BLOCK_FIELDS[kind]
    _require(block, (field,), where)
    if kind == 'muted':
        return _check_text(block['html'], f'{where}.html')
    if kind == 'package':
        _check_text(block.get('root', ''), f'{where}.root')
    for index, item in enumerate(block[field]):
        at = f'{where}.{field}[{index}]'
        if item_fields is None:
            _check_text(item, at)
            continue
        _require(item, item_fields, at)
        for key, value in item.items():
            if key in TEXT_FIELDS:
                values = value if isinstance(value, list) else [value]
                for text in values:
                    _check_text(text, f'{at}.{key}')
        if kind == 'pins' and not (CONTENT / 'icons' / f'{item["icon"]}.svg').is_file():
            raise ContentError(f'Ícone inexistente em {at}: content/icons/{item["icon"]}.svg')


# ---------------------------------------------------------------- helpers

def tr(value, lang):
    return value if isinstance(value, str) else value[lang]


def translated(value):
    """True when anything inside value differs between the languages."""
    if isinstance(value, dict):
        return set(value) == set(LANGS) and all(isinstance(value[lang], str) for lang in LANGS) or any(translated(v) for v in value.values())
    if isinstance(value, list):
        return any(translated(v) for v in value)
    return False


def localized(tag, attrs, value, pad):
    """One element when the text is shared, or a pt/en pair toggled by portfolio.js."""
    attrs = f' {attrs}' if attrs else ''
    if isinstance(value, str):
        return f'{pad}<{tag}{attrs}>{value}</{tag}>'
    return (f'{pad}<{tag}{attrs} lang="pt" data-i18n>{value["pt"]}</{tag}>\n'
            f'{pad}<{tag}{attrs} lang="en" data-i18n hidden>{value["en"]}</{tag}>')


def lang_attrs(lang):
    return 'lang="pt" data-i18n' if lang == 'pt' else 'lang="en" data-i18n hidden'


def icon(name):
    return (CONTENT / 'icons' / f'{name}.svg').read_text(encoding='utf-8').strip()


def named(name, meta):
    return name + (f' <span class="old-meta">{meta}</span>' if meta else '')


# ---------------------------------------------------------------- project pages

def render_block(block, lang, pad):
    t = lambda value: tr(value, lang)
    kind = block['type']
    inner = pad + '  '
    if kind == 'note':
        rows = '\n'.join(f'{inner}<p>{t(p)}</p>' for p in block['paragraphs'])
        return f'{pad}<div class="old-note">\n{rows}\n{pad}</div>'
    if kind in ('facts',):
        rows = []
        for item in block['items']:
            lead = f'<b>{t(item["title"])}</b> ' if 'title' in item else ''
            rows.append(f'{inner}<li>{lead}{t(item["text"])}</li>')
        return f'{pad}<ul class="old-facts">\n' + '\n'.join(rows) + f'\n{pad}</ul>'
    if kind == 'grid':
        rows = []
        for item in block['items']:
            texts = item['text'] if isinstance(item['text'], list) else [item['text']]
            body = '\n'.join(f'{inner}  <p>{t(text)}</p>' for text in texts)
            name = named(t(item['name']), t(item['meta']) if 'meta' in item else '')
            rows.append(f'{inner}<div class="old-box">\n{inner}  <div class="old-box-name">{name}</div>\n{body}\n{inner}</div>')
        return f'{pad}<div class="old-grid-2">\n' + '\n'.join(rows) + f'\n{pad}</div>'
    if kind == 'stats':
        rows = '\n'.join(f'{inner}<div class="old-stat"><span class="old-n">{t(item["value"])}</span><span class="old-l">{t(item["label"])}</span></div>' for item in block['items'])
        return f'{pad}<div class="old-stats">\n{rows}\n{pad}</div>'
    if kind == 'pins':
        rows = '\n'.join(f'{inner}<span>\n{inner}  {icon(item["icon"])}\n{inner}  <span>{t(item["label"])}</span>\n{inner}</span>' for item in block['items'])
        return f'{pad}<div class="old-pinlist">\n{rows}\n{pad}</div>'
    if kind == 'repos':
        rows = []
        for item in block['items']:
            what = f'<span class="old-what">{t(item["text"])}</span>' if 'text' in item else ''
            rows.append(f'{inner}<a class="old-repo" href="{escape(item["href"])}" {EXTERNAL}><code>{t(item["path"])}</code> {what}<span class="old-ext">↗</span></a>')
        return f'{pad}<div class="old-repos">\n' + '\n'.join(rows) + f'\n{pad}</div>'
    if kind == 'muted':
        return f'{pad}<p class="old-muted">{t(block["html"])}</p>'
    if kind == 'package':
        rows = '\n'.join(f'{inner}  <div><dt>{t(item["name"])}</dt><dd>{t(item["text"])}</dd></div>' for item in block['items'])
        root = named(t(block['root']), t(block['meta']) if 'meta' in block else '')
        return (f'{pad}<div class="old-pkg">\n{inner}<div class="old-pkg-root">{root}</div>\n'
                f'{inner}<dl class="old-pkg-list">\n{rows}\n{inner}</dl>\n{pad}</div>')
    if kind == 'chips':
        rows = ''.join(f'<span class="old-chip">{t(item)}</span>' for item in block['items'])
        return f'{pad}<div class="old-chips">\n{inner}{rows}\n{pad}</div>'
    if kind == 'paragraphs':
        return '\n'.join(f'{pad}<p>{t(item["text"])}</p>' for item in block['items'])
    raise ContentError(f'Tipo de bloco sem desenho: {kind}')


def render_section(section):
    def body(lang):
        blocks = '\n\n'.join(render_block(block, lang, '    ') for block in section['blocks'])
        return f'    <h3>{tr(section["title"], lang)}</h3>\n{blocks}\n'
    if not translated(section):
        return f'  <div class="old-section">\n{body("pt")}  </div>'
    return '\n'.join(f'  <div class="old-section" {lang_attrs(lang)}>\n{body(lang)}  </div>' for lang in LANGS)


def render_page(project):
    out = [f'<section class="rs-full-project" data-full-project="{project["slug"]}" hidden>',
           localized('a', 'class="old-back" href="#/projetos"', BACK, '  '), '',
           localized('p', 'class="old-kicker"', project['kicker'], '  '),
           localized('h2', 'class="old-proj-title"', project['title'], '  '),
           localized('p', 'class="old-lead"', project['lead'], '  '), '']
    for lang in LANGS:
        links = []
        for link in project['links']:
            classes = 'old-btn old-solid' if link.get('primary') else 'old-btn'
            links.append(f'    <a class="{classes}" href="{escape(link["href"])}" {EXTERNAL}>{tr(link["label"], lang)}</a>')
        out.append(f'  <div class="old-btns" {lang_attrs(lang)}>\n' + '\n'.join(links) + '\n  </div>')
    for section in project['sections']:
        out += ['', render_section(section)]
    if 'colophon' in project:
        rows = [f'    <p class="old-colophon" {lang_attrs(lang)}>{tr(project["colophon"], lang)} '
                f'<a href="#/projetos" class="cursor-interaction">{BACK_FOOTER[lang]}</a></p>' for lang in LANGS]
        out += ['', '  <footer>', *rows, '  </footer>']
    out.append('</section>')
    return '\n'.join(out)


def render_card(project):
    card = project['card']
    preview = (CONTENT / 'previews' / f'{project["route"]}.svg').read_text(encoding='utf-8').strip('\n')
    preview = '\n'.join('    ' + line if line else line for line in preview.split('\n'))
    chips = ''.join(f'<span class="old-chip">{chip}</span>' if isinstance(chip, str) else
                    ''.join(f'<span class="old-chip" {lang_attrs(lang)}>{chip[lang]}</span>' for lang in LANGS)
                    for chip in card['chips'])
    return '\n'.join([
        f'<a class="old-card" href="#/{project["route"]}">',
        '  <div class="old-card-head">',
        '    <div>',
        localized('h3', '', card.get('title', project['title']), '      '),
        localized('span', 'class="old-when"', card['when'], '      '),
        '    </div>',
        '    <span class="old-card-go">→</span>',
        '  </div>',
        localized('p', '', card['summary'], '  '),
        f'  <div class="old-chips">{chips}</div>',
        '  <div class="old-card-preview">',
        preview,
        '  </div>',
        '</a>'])


# ---------------------------------------------------------------- generated files

def render_index(html, site, projects):
    order = site['projects']
    pages = '\n'.join(render_page(projects[name]) for name in order['pages'])
    cards = '\n'.join(render_card(projects[name]) for name in order['cards'])
    html = _replace_region(html, 'pages', pages)
    html = _replace_region(html, 'cards', cards)
    text = site['text']

    def default_copy(match):
        key = match.group(2)
        if key not in text:
            raise ContentError(f'index.html usa data-copy="{key}", que não existe em content/site.json → text')
        return match.group(1) + escape(tr(text[key], 'pt'), quote=False) + match.group(3)
    return re.sub(r'(<[^>]*\bdata-copy="(\w+)"[^>]*>)[^<]*(<)', default_copy, html)


def _replace_region(html, name, body):
    start, end = f'<!-- content:{name} -->', f'<!-- /content:{name} -->'
    pattern = re.compile(re.escape(start) + r'.*?' + re.escape(end), re.S)
    if len(pattern.findall(html)) != 1:
        raise ContentError(f'index.html precisa ter exatamente um par de marcadores {start} … {end}')
    return pattern.sub(lambda _: f'{start}\n{body}\n{end}', html)


def render_js(site, projects):
    data, studies, routes = {}, {}, {}
    for project in projects.values():
        routes[project['slug']] = project['route']
        if project['page'] != 'case-study':
            continue
        data[project['slug']] = {'title': project['title'], 'tags': project['tags'],
                                 **{lang: [tr(project['summary'], lang), tr(project['architecture'], lang)] for lang in LANGS}}
        study = {'repository': project['repository']}
        if 'website' in project:
            study['website'] = project['website']
        for lang in LANGS:
            groups = []
            for section in project['sections']:
                block = section['blocks'][0]
                field = CASE_STUDY_FIELDS[block['type']]
                items = [[tr(item[field], lang) if field else '', tr(item['text'], lang)] for item in block['items']]
                groups.append({'title': tr(section['title'], lang), 'kind': CASE_STUDY_KINDS[block['type']], 'items': items})
            study[lang] = groups
        studies[project['slug']] = study
    text = {lang: {key: tr(value, lang) for key, value in site['text'].items()} for lang in LANGS}
    dump = lambda value: json.dumps(value, ensure_ascii=False, indent=2)
    return ('// Gerado por scripts/build_site.py a partir de content/. Edite os arquivos em content/.\n'
            f'export const projects = {dump(data)};\n\n'
            f'export const caseStudies = {dump(studies)};\n\n'
            f'export const projectRoutes = {dump(routes)};\n\n'
            f'export const text = {dump(text)};\n')


def generate():
    """Return {path: expected content} for every file produced from content/."""
    site, projects = load()
    index = ROOT / 'index.html'
    return {
        index: render_index(index.read_text(encoding='utf-8'), site, projects),
        GENERATED_JS: render_js(site, projects),
    }


def stale_files():
    return [path for path, body in generate().items()
            if not path.is_file() or path.read_text(encoding='utf-8') != body]
