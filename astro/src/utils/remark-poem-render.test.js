import { describe, expect, test } from '@jest/globals';
import { renderPoemStructure } from './remark-poem.mjs';

describe('renderPoemStructure', () => {
  test('renders a simple poem structure correctly', () => {
    const structure = {
      id: '123',
      title: 'Simple Poem',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['This is a simple poem', 'With just two lines'],
          metadata: {}
        }
      ],
      metadata: { date: '2023-05-01' },
      notes: {}
    };

    const result = renderPoemStructure(structure);

    expect(result).toBe(
      '<div class="mdx-poem" id="poem-123">' +
      '<h3 class="mdx-poem-title"><span class="mdx-poem-id">123</span>Simple Poem</h3>' +
      '<div class="mdx-poem-part">' +
      '<p class="mdx-poem--stanza">' +
      '<span class="mdx-poem--line">This is a simple poem</span><br>' +
      '<span class="mdx-poem--line">With just two lines</span><br>' +
      '</p>' +
      '</div>' +
      '<div class="mdx-poem-metadata">' +
      '<p class="mdx-poem-date">2023-05-01</p>' +
      '</div>' +
      '</div>'
    );
  });

  test('renders a poem with subtitle, epigraph, and multiple parts', () => {
    const structure = {
      id: '456',
      title: 'Complex Poem',
      subtitle: 'A Subtitle',
      epigraph: ['Epigraph line 1', 'Epigraph line 2'],
      parts: [
        {
          title: 'Part 1',
          content: ['Part 1 line 1', 'Part 1 line 2'],
          metadata: { date: '2023-05-02' }
        },
        {
          title: 'Part 2',
          content: ['Part 2 line 1', 'Part 2 line 2'],
          metadata: {}
        }
      ],
      metadata: { author: 'John Doe' },
      notes: { '1': ['This is a note.'] }
    };

    const result = renderPoemStructure(structure);

    expect(result).toBe(
      '<div class="mdx-poem" id="poem-456">' +
      '<h3 class="mdx-poem-title"><span class="mdx-poem-id">456</span>Complex Poem</h3>' +
      '<h4 class="mdx-poem-subtitle">A Subtitle</h4>' +
      '<blockquote class="mdx-poem-epigraph">Epigraph line 1<br>Epigraph line 2</blockquote>' +
      '<div class="mdx-poem-part">' +
      '<h5 class="mdx-poem-part-title">Part 1</h5>' +
      '<p class="mdx-poem--stanza">' +
      '<span class="mdx-poem--line">Part 1 line 1</span><br>' +
      '<span class="mdx-poem--line">Part 1 line 2</span><br>' +
      '</p>' +
      '<div class="mdx-poem-metadata">' +
      '<p class="mdx-poem-date">2023-05-02</p>' +
      '</div>' +
      '</div>' +
      '<div class="mdx-poem-part">' +
      '<h5 class="mdx-poem-part-title">Part 2</h5>' +
      '<p class="mdx-poem--stanza">' +
      '<span class="mdx-poem--line">Part 2 line 1</span><br>' +
      '<span class="mdx-poem--line">Part 2 line 2</span><br>' +
      '</p>' +
      '</div>' +
      '<div class="mdx-poem-metadata">' +
      '<p><strong>author:</strong> John Doe</p>' +
      '</div>' +
      '<div class="mdx-poem-notes"><h4>Примечания:</h4>' +
      '<ol class="mdx-poem-notes-list">' +
      '<li id="note-1" class="mdx-poem-note" data-note-id="1">' +
      '<span class="mdx-poem-note-number">1</span>' +
      '<span class="mdx-poem-note-content">This is a note.</span>' +
      '</li>' +
      '</ol></div>' +
      '</div>'
    );
  });

  test('renders a poem with dedication and translation information', () => {
    const structure = {
      id: '789',
      title: 'Translated Poem',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['Line 1', 'Line 2'],
          metadata: {},
          dedication: 'To my friend'
        }
      ],
      metadata: {
        date: '2023-05-03',
        translation_message: 'Translated from Russian',
        translated_by: 'Jane Smith'
      },
      notes: {}
    };

    const result = renderPoemStructure(structure);

    expect(result).toBe(
      '<div class="mdx-poem" id="poem-789">' +
      '<h3 class="mdx-poem-title"><span class="mdx-poem-id">789</span>Translated Poem</h3>' +
      '<div class="mdx-poem-part">' +
      '<p class="mdx-poem-dedication">To my friend</p>' +
      '<p class="mdx-poem--stanza">' +
      '<span class="mdx-poem--line">Line 1</span><br>' +
      '<span class="mdx-poem--line">Line 2</span><br>' +
      '</p>' +
      '</div>' +
      '<div class="mdx-poem-metadata">' +
      '<p class="mdx-poem-date">2023-05-03</p>' +
      '<div class="translation-info">' +
      '<p>Translated from Russian</p>' +
      '<p>Перевод: Jane Smith</p>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  });

  test('renders poem with anchor correctly', () => {
    const structure = {
      id: '123',
      anchor: 'my-poem-anchor',
      title: 'Test Poem',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['First line', 'Second line'],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    };

    const result = renderPoemStructure(structure);

    expect(result).toBe(
      '<a id="my-poem-anchor"></a>' +
      '<div class="mdx-poem" id="poem-123">' +
      '<h3 class="mdx-poem-title"><span class="mdx-poem-id">123</span>Test Poem</h3>' +
      '<div class="mdx-poem-part">' +
      '<p class="mdx-poem--stanza">' +
      '<span class="mdx-poem--line">First line</span><br>' +
      '<span class="mdx-poem--line">Second line</span><br>' +
      '</p>' +
      '</div>' +
      '</div>'
    );
  });

  test('renders poem without anchor correctly', () => {
    const structure = {
      id: '123',
      anchor: '',
      title: 'Test Poem',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['First line', 'Second line'],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    };

    const result = renderPoemStructure(structure);

    expect(result).toBe(
      '<div class="mdx-poem" id="poem-123">' +
      '<h3 class="mdx-poem-title"><span class="mdx-poem-id">123</span>Test Poem</h3>' +
      '<div class="mdx-poem-part">' +
      '<p class="mdx-poem--stanza">' +
      '<span class="mdx-poem--line">First line</span><br>' +
      '<span class="mdx-poem--line">Second line</span><br>' +
      '</p>' +
      '</div>' +
      '</div>'
    );
  });

  test('renders poem ID correctly for both numeric and string IDs', () => {
    const numericStructure = {
      id: '42',
      title: 'Test Poem',
      subtitle: '',
      epigraph: [],
      parts: [{
        title: '',
        content: ['A line'],
        metadata: {}
      }],
      metadata: {},
      notes: {}
    };

    const stringStructure = {
      id: 'abc',
      title: 'Test Poem',
      subtitle: '',
      epigraph: [],
      parts: [{
        title: '',
        content: ['A line'],
        metadata: {}
      }],
      metadata: {},
      notes: {}
    };

    const noIdStructure = {
      title: 'Test Poem',
      subtitle: '',
      epigraph: [],
      parts: [{
        title: '',
        content: ['A line'],
        metadata: {}
      }],
      metadata: {},
      notes: {}
    };

    const numericResult = renderPoemStructure(numericStructure);
    const stringResult = renderPoemStructure(stringStructure);
    const noIdResult = renderPoemStructure(noIdStructure);

    expect(numericResult).toContain('id="poem-42"');
    expect(numericResult).toContain('<span class="mdx-poem-id">42</span>');
    
    expect(stringResult).toContain('id="poem-abc"');
    expect(stringResult).toContain('<span class="mdx-poem-id">abc</span>');
    
    expect(noIdResult).not.toContain('id="poem-"');
    expect(noIdResult).not.toContain('class="mdx-poem-id"');
  });

  test('renders poem with epigraph correctly', () => {
    const structure = {
      id: '123',
      title: 'Poem Title',
      subtitle: '',
      epigraph: [
        'This is an epigraph',
        '-- Author Name'
      ],
      parts: [
        {
          title: '',
          content: [
            'First line of poem',
            'Second line of poem'
          ],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    };

    const result = renderPoemStructure(structure);

    expect(result).toBe(
      '<div class="mdx-poem" id="poem-123">' +
      '<h3 class="mdx-poem-title"><span class="mdx-poem-id">123</span>Poem Title</h3>' +
      '<blockquote class="mdx-poem-epigraph">' +
      'This is an epigraph<br>' +
      '-- Author Name' +
      '</blockquote>' +
      '<div class="mdx-poem-part">' +
      '<p class="mdx-poem--stanza">' +
      '<span class="mdx-poem--line">First line of poem</span><br>' +
      '<span class="mdx-poem--line">Second line of poem</span><br>' +
      '</p>' +
      '</div>' +
      '</div>'
    );
  });
});
