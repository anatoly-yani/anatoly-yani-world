import re
from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor
from pelican import signals

class PoeticExtension(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(PoemPreprocessor(md), 'poem', 50)

class PoemPreprocessor(Preprocessor):
#    POEM_START_RE = re.compile(r"```poem(?P<style>Italic)?\s*(?P<title>[^=\n]+?)(?=\s+\w+=|\s*$)\s*(?P<params>(?:[\w]+=[\w\s.]+\s*)*)")
    POEM_START_RE = re.compile(r"```poem(?P<style>Italic)?\s*(?:(?P<title>[^=\n]+?)(?=\s+\w+=|\s*$))?\s*(?P<params>(?:[\w]+=[\w\s.]+\s*)*)$")


    POEM_END_RE = re.compile(r"```")

    def run(self, lines):
        new_lines = []
        inside_poem = False
        poem_lines = []
        poem_style = ""
        poem_title = ""
        poem_date = ""

        for line in lines:
            if not inside_poem:
                start_match = self.POEM_START_RE.match(line)
                if start_match:
                    inside_poem = True
                    poem_style = " italic" if start_match.group('style') else ""
                    poem_title = start_match.group('title') or ""
                    params = start_match.group('params')
                    if params:
                        param_dict = dict(param.split('=') for param in params.strip().split())
                        if not poem_title:
                            poem_title = param_dict.get('title', '').strip()
                           
                        poem_date = param_dict.get('date', '').strip()
                    else:
                        poem_date = ""
                        poem_title = ""
                        poem_style = ""

                    poem_title = poem_title.strip()
                    poem_lines = []
                else:
                    new_lines.append(line)
            else:
                if self.POEM_END_RE.match(line):
                    inside_poem = False
                    params = None
                    new_lines.append(self.format_poem(poem_lines, poem_style, poem_title, poem_date))

                else:
                    poem_lines.append(line)

        if inside_poem:
            # Handle unclosed poem block
            new_lines.append(self.format_poem(poem_lines, poem_style, poem_title, poem_date))
            poem_date = ""
            poem_title = ""
            poem_style = ""

        return new_lines

    def format_poem(self, lines, style, title, date):
        html_lines = []
        stanzas = []
        current_stanza = []
    
        # First, separate the lines into stanzas
        for line in lines:
            if line.strip():
                current_stanza.append(f'<span class="mdx-poem--line">{self.escape(line.strip())}</span><br>')
            elif current_stanza:
                stanzas.append(current_stanza)
                current_stanza = []
        if current_stanza:
            stanzas.append(current_stanza)
    
        # Now generate the HTML
        html_lines.append(f'<div class="mdx-poem{style}">')
        if title:
            html_lines.append(f'<h3 class="mdx-poem-title">{self.escape(title)}</h3>')

        
        # Add a class based on the number of stanzas
        stanza_class = 'single-stanza' if len(stanzas) == 1 else 'multi-stanza'
        html_lines.append(f'<div class="mdx-poem-stanzas {stanza_class}">')
        
        for stanza in stanzas:
            html_lines.append(f'<p class="mdx-poem--stanza">{"".join(stanza)}</p>')

        if date:
            html_lines.append(f'<p class="mdx-poem-date">{self.escape(date)}</p>')
        
        html_lines.append('</div>')
        html_lines.append('</div>')
        return f'<!-- raw html -->\n{"".join(html_lines)}\n<!-- end raw html -->'
    
    def escape(self, text):
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

def add_poetic_extension(pelican):
    """Add the Poetic extension to the list of Markdown extensions."""
    pelican.settings['MARKDOWN'].setdefault('extensions', []).append(PoeticExtension())

def register():
    """Plugin registration."""
    signals.initialized.connect(add_poetic_extension)
