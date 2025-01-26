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

export function parsePoemStructure(metastring, lines) {
  const structure = {
    id: '',
    anchor: '',
    title: '',
    subtitle: '',
    epigraph: [],
    parts: [],
    metadata: {},
    notes: {}
  };

  let currentPart = null;
  let currentSection = 'header';
  let globalMetadata = {};
  let dedicationLines = [];

  // Parse metastring
  const metastringMatch = metastring.match(/^(.*?)(?:(\s+|^)date=(.+))?$/);
  if (metastringMatch) {
    structure.title = metastringMatch[1].trim();
    if (metastringMatch[3]) {
      structure.metadata.date = metastringMatch[3].trim();
    }
  }

  function applyCurrentPart() {
    structure.parts.push(currentPart);
    if (dedicationLines.length > 0) {
      currentPart.dedication = dedicationLines.join('\n');
      dedicationLines = [];
    }
  }

  function startNewPart(title = '') {
    if (currentPart) {
      applyCurrentPart();
    }
    currentPart = { title: title, content: [], metadata: {} };
  }


  // main part always present
  startNewPart();

  for (const line of lines) {
    const trimmedLine = line.trim();

    switch (currentSection) {
      case 'header':
        if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
          structure.id = trimmedLine.slice(1, -1);
        } else if (trimmedLine.startsWith('# ')) {
          structure.title = trimmedLine.slice(2);
        } else if (trimmedLine.startsWith('## ')) {
          structure.subtitle = trimmedLine.slice(3);
        } else if (trimmedLine.startsWith('### ')) {
          startNewPart(trimmedLine.slice(4));
        } else if (trimmedLine.startsWith('> ')) {
          const epigraphLine = trimmedLine.slice(2).trim();
          if (epigraphLine) {
            structure.epigraph.push(epigraphLine);
          }
        } else if (trimmedLine.startsWith('@')) {
          dedicationLines.push(trimmedLine.slice(1).trim());
        } else if (trimmedLine === '---') {
          currentSection = 'metadata';
        } else if (trimmedLine !== '') {
          currentSection = 'content';
          currentPart.content.push(trimmedLine);
        }
        break;

      case 'metadata':
        if (trimmedLine === '---') {
          currentSection = 'content';
        } else {
          const [key, value] = trimmedLine.split(':').map(s => s.trim());
          if (key && value) {
            if (currentPart) {
              currentPart.metadata[key] = value;
            } else {
              globalMetadata[key] = value;
            }
          }
        }
        break;

      case 'content':
        if (trimmedLine.startsWith('### ')) {
          startNewPart(trimmedLine.slice(4));
        } else if (trimmedLine === '---') {
          currentSection = 'metadata';
        } else if (trimmedLine.startsWith('[!note')) {
          currentSection = 'note';
          const noteId = trimmedLine.slice(7, -1).trim();
          structure.notes[noteId] = [];
        } else if (trimmedLine.startsWith('>')) {
          const epigraphLine = trimmedLine.slice(1).trim();
          if (epigraphLine) {
            structure.epigraph.push(epigraphLine);
          }
        } else {
          currentPart.content.push(trimmedLine);
        }
        break;

      case 'note':
        if (trimmedLine.startsWith('[!note')) {
          const noteId = trimmedLine.slice(7, -1).trim();
          structure.notes[noteId] = [];
        } else if (trimmedLine === '---') {
          currentSection = 'metadata';
        } else {
          const lastNoteId = Object.keys(structure.notes).pop();
          structure.notes[lastNoteId].push(trimmedLine);
        }
        break;
    }
  }

  if (currentPart) {
    applyCurrentPart();
  }

  structure.metadata = { ...globalMetadata, ...structure.metadata };

  // Process parts content
  structure.parts.forEach(part => {
    part.content = processLinesArray(part.content);
  });
  
  // Process notes
  for (const noteId in structure.notes) {
    structure.notes[noteId] = processLinesArray(structure.notes[noteId]);
  }

  // Post-process metadata
  return processMetadata(structure);
}

function processLinesArray(lines) {
  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  let result = [];
  let emptyLineEncountered = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmedLine = lines[i].trim();
    if (trimmedLine === '') {
      if (!emptyLineEncountered && i > 0 && i < lines.length - 1) {
        result.push('');
        emptyLineEncountered = true;
      }
    } else {
      result.push(trimmedLine);
      emptyLineEncountered = false;
    }
  }

  return result;
}

function processMetadata(structure) {
  // Process global metadata
  const processedMetadata = { ...structure.metadata };
  
  // Check for id in global metadata
  if (processedMetadata.id) {
    structure.id = processedMetadata.id;
    delete processedMetadata.id;
  }
  
  // Check for id in parts metadata
  structure.parts.forEach(part => {
    if (part.metadata && part.metadata.id) {
      structure.id = part.metadata.id;
      delete part.metadata.id;
    }
  });
  
  // Initialize id if not found
  if (!structure.id) {
    structure.id = '';
  }

  // Check for anchor in global metadata
  if (processedMetadata.anchor) {
    structure.anchor = processedMetadata.anchor;
    delete processedMetadata.anchor;
  }
  
  // Check for anchor in parts metadata
  structure.parts.forEach(part => {
    if (part.metadata && part.metadata.anchor) {
      structure.anchor = part.metadata.anchor;
      delete part.metadata.anchor;
    }
  });
  
  // Initialize anchor if not found
  if (!structure.anchor) {
    structure.anchor = '';
  }
  
  // Update structure with processed metadata
  structure.metadata = processedMetadata;
  
  return structure;
}

export function renderPoemStructure(structure) {
  const anchorHtml = structure.anchor ? `<a id="${structure.anchor}"></a>` : '';
  
  // Only add id attribute if structure.id exists
  const divId = structure.id ? ` id="poem-${structure.id}"` : '';
  let html = `${anchorHtml}<div class="mdx-poem"${divId}>`;
  
  // Show poem ID in the title if it exists (can be string or number)
  const poemId = structure.id ? 
    `<span class="mdx-poem-id">${structure.id}</span>` : '';
  
  html += `<h3 class="mdx-poem-title">${poemId}${escapeHtml(structure.title) || '* * *'}</h3>`;
  if (structure.subtitle) {
    html += `<h4 class="mdx-poem-subtitle">${escapeHtml(structure.subtitle)}</h4>`;
  }
  if (structure.epigraph && structure.epigraph.length > 0) {
    html += `<blockquote class="mdx-poem-epigraph">${structure.epigraph.map(escapeHtml).join('<br>')}</blockquote>`;
  }

  structure.parts.forEach((part, index) => {
    html += `<div class="mdx-poem-part">`;
    if (part.title) {
      html += `<h5 class="mdx-poem-part-title">${escapeHtml(part.title)}</h5>`;
    }
    if (part.dedication) {
      html += `<p class="mdx-poem-dedication">${escapeHtml(part.dedication).replace(/\n/g, '<br>')}</p>`;
    }
    html += renderStanzas(part.content);
    html += renderMetadata(part.metadata);
    html += `</div>`;
  });

  html += renderMetadata(structure.metadata);
  html += renderNotes(structure.notes);
  html += `</div>`;

  return html;
}

function renderStanzas(content) {
  const stanzas = content.join('\n').split('\n\n');
  return stanzas.map(stanza => 
    `<p class="mdx-poem--stanza">${
      stanza.split('\n')
        .map(line => `<span class="mdx-poem--line">${escapeHtml(line)}</span><br>`)
        .join('')
    }</p>`
  ).join('');
}



function renderMetadata(metadata) {
  if (Object.keys(metadata).length === 0) {
    return '';
  }

  let html = '<div class="mdx-poem-metadata">';

  // Handle date specially
  if (metadata.date) {
    html += `<p class="mdx-poem-date">${escapeHtml(metadata.date)}</p>`;
  }

  // Handle translation information
  if (metadata.translation_message || metadata.translated_by) {
    html += '<div class="translation-info">';
    if (metadata.translation_message) {
      html += `<p>${escapeHtml(metadata.translation_message)}</p>`;
    }
    if (metadata.translated_by) {
      html += `<p>Перевод: ${escapeHtml(metadata.translated_by)}</p>`;
    }
    html += '</div>';
  }

  // Handle other metadata
  for (const [key, value] of Object.entries(metadata)) {
    if (key !== 'date' && key !== 'translation_message' && key !== 'translated_by') {
      html += `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`;
    }
  }

  html += '</div>';
  return html;
}


function renderNotes(notes) {
  if (Object.keys(notes).length === 0) {
    return '';
  }

  let html = '<div class="mdx-poem-notes">';
  html += '<h4>Примечания:</h4><ol class="mdx-poem-notes-list">';
  
  for (const [id, note] of Object.entries(notes)) {
    const noteContent = Array.isArray(note) ? note.join(' ') : note;
    html += `<li id="note-${id}" class="mdx-poem-note" data-note-id="${id}">`;
    html += `<span class="mdx-poem-note-number">${id}</span>`;
    html += `<span class="mdx-poem-note-content">${escapeHtml(noteContent.trim())}</span>`;
    html += '</li>';
  }
  
  html += '</ol></div>';
  return html;
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
