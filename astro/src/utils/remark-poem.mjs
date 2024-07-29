import { visit } from 'unist-util-visit';

function remarkPoem() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang === 'poem') {
        const meta = parseMeta(node.meta || '');
        const lines = node.value.split('\n');

        const style = meta.italic ? ' italic' : '';
        const title = meta.title || '* * *';
        const date = meta.date || '';

        // Process poem lines
        const stanzas = lines
          .join('\n')
          .split('\n\n')
          .map(stanza => 
            stanza.split('\n')
              .map(line => `<span class="mdx-poem--line">${escapeHtml(line.trim())}</span><br>`)
              .join('')
          );

        const stanzaClass = stanzas.length === 1 ? 'single-stanza' : 'multi-stanza';

        const html = `
<div class="mdx-poem${style}">
  <h3 class="mdx-poem-title">${escapeHtml(title)}</h3>
  <div class="mdx-poem-stanzas ${stanzaClass}">
    ${stanzas.map(stanza => `<p class="mdx-poem--stanza">${stanza}</p>`).join('')}

    ${date ? `<p class="mdx-poem-date">${escapeHtml(date)}</p>` : ''}
  </div>
</div>`;

        node.type = 'html';
        node.value = html;
      }
    });
  };
}

function parseMeta(metastring) {
  const meta = {};
  const dateMatch = metastring.match(/date=(\S+)/);
  
  if (dateMatch) {
    meta.date = dateMatch[1];
    metastring = metastring.replace(dateMatch[0], '').trim();
  }

  if (metastring.toLowerCase().includes('italic')) {
    meta.italic = true;
    metastring = metastring.replace(/italic/i, '').trim();
  }

  meta.title = metastring || '* * *';

  return meta;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default remarkPoem;
/*
import { visit } from 'unist-util-visit';

function remarkPoem() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang === 'poem') {
console.log(node.lang)
        const metastring = node.meta || '';
        const lines = node.value.split('\n');

        // Parse meta information
        const meta = parseMeta(metastring);
        const style = meta.italic ? ' italic' : '';
        const title = meta.title || '* * *';
        const date = meta.date || '';

        // Process poem lines
        const stanzas = lines
          .join('\n')
          .split('\n\n')
          .map(stanza => 
            stanza.split('\n')
              .map(line => `<span class="mdx-poem--line">${escapeHtml(line.trim())}</span><br>`)
              .join('')
          );

        const stanzaClass = stanzas.length === 1 ? 'single-stanza' : 'multi-stanza';

        const html = `
<div class="mdx-poem${style}">
  <h3 class="mdx-poem-title">${escapeHtml(title)}</h3>
  <div class="mdx-poem-stanzas ${stanzaClass}">
    ${stanzas.map(stanza => `<p class="mdx-poem--stanza">${stanza}</p>`).join('')}
  </div>
  ${date ? `<p class="mdx-poem-date">${escapeHtml(date)}</p>` : ''}
</div>`;

        node.type = 'html';
        node.value = html;
      }
    });
  };
}

function parseMeta(metastring) {
  const meta = {};
  const parts = metastring.split(/\s+/);

  console.log(parts);
  
  parts.forEach(part => {
    if (part.toLowerCase() === 'italic') {
      meta.italic = true;
    } else if (part.includes('=')) {
      const [key, value] = part.split('=');
      meta[key.toLowerCase()] = value.replace(/^["']|["']$/g, '');
    } else if (!meta.title) {
      meta.title = part;
    }
  });

  return meta;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default remarkPoem;
*/
/*
import { visit } from 'unist-util-visit';

function remarkPoem() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang === 'poem') {
        const [firstLine, ...rest] = node.value.split('\n');
        const match = firstLine.match(/^(?:(?<title>[^=\n]+?)(?=\s+\w+=|\s*$))?\s*(?<params>(?:[\w]+=[\w\s.]+\s*)*)$/);
        
        const title = match?.groups?.title?.trim() || '* * *';
        const params = match?.groups?.params;
        const paramDict = Object.fromEntries(
          (params?.match(/(\w+)=([^\s]+)/g) || []).map(p => p.split('='))
        );
        
        const style = firstLine.includes('Italic') ? ' italic' : '';
        const date = paramDict.date || '';

        const stanzas = rest.join('\n').split('\n\n').map(stanza => 
          stanza.split('\n').map(line => 
            `<span class="mdx-poem--line">${escapeHtml(line.trim())}</span><br>`
          ).join('')
        );

        const stanzaClass = stanzas.length === 1 ? 'single-stanza' : 'multi-stanza';

        const html = `
<div class="mdx-poem${style}">
  <h3 class="mdx-poem-title">${escapeHtml(title)}</h3>
  <div class="mdx-poem-stanzas ${stanzaClass}">
    ${stanzas.map(stanza => `<p class="mdx-poem--stanza">${stanza}</p>`).join('')}
  </div>
  ${date ? `<p class="mdx-poem-date">${escapeHtml(date)}</p>` : ''}
</div>`;

        node.type = 'html';
        node.value = html;
      }
    });
  };
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default remarkPoem;
*/
