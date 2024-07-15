AUTHOR = 'Анатолий Яни'
SITENAME = 'На струнах трепетных гуслей'
SITETAGLINE = 'Мир поэзии Анатолия Яни'
SITEURL = ""

PATH = "content"

TIMEZONE = 'Europe/Kyiv'

DEFAULT_LANG = 'ru'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (
    ("Pelican", "https://getpelican.com/"),
    ("Python.org", "https://www.python.org/"),
    ("Jinja2", "https://palletsprojects.com/p/jinja/"),
    ("You can modify those links in your config file", "#"),
)

# Social widget
SOCIAL = (
    ('Twitter', 'http://twitter.com/username'),
    ('Facebook', 'http://facebook.com/username'),
)


DEFAULT_PAGINATION = 50

THEME = 'themes/yani-theme'
STATIC_PATHS = ['images', 'css', 'quotes.json']

MENUITEMS = (
    ('О поэте', '/about.html'),
    ('Стихи', '/category/poems.html'),
    ('Переводы', '/category/translations.html'),
)

CATEGORY_TRANSLATIONS = {
    'translations': 'Переводы',
    'poems': 'Стихи',
}

PAGE_URL = '{slug}.html'
PAGE_SAVE_AS = '{slug}.html'
ARTICLE_URL = '{category}/{slug}.html'
ARTICLE_SAVE_AS = '{category}/{slug}.html'
ARTICLE_PATHS = ['poems', 'translations']

AUTOBIOGRAPHY_EXCERPT = """
Многие факты моей бьющей петергофскими фонтанами биографии по разным причинам остаются как бы в непроглядном тумане. Но всё, что я ещё в состоянии вспомнить, попробую излить. Лаконично, сжато, конспективно.
"""
CREATIVE_PROCESS_EXCERPT = """Для Анатолия Яни творческий процесс был "звенящей бессонницей" - неугомонным, неустанным стремлением запечатлеть чувства и впечатления в поэтической форме. "Я пишу стихи так, как другие дышат воздухом", - говорил он. Его душа была "роддомом стихометафор", а сам он - "главным акушером" в этом удивительном мире поэзии."""

# Это настройка автоматически создает slug из имени файла
SLUGIFY_SOURCE = 'basename'


DISPLAY_CATEGORIES_ON_MENU = True

PLUGIN_PATHS = ['./plugins', ]
PLUGINS = ['i18n_subsites', 'pelican_poetic']
JINJA_ENVIRONMENT = {
    'extensions': ['jinja2.ext.i18n'],
}

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.extra': {},
    },
}

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True
