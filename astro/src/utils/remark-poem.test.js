import { describe, expect, test } from '@jest/globals';
import { parsePoemStructure } from './remark-poem.mjs';

describe('parsePoemStructure', () => {
  // Test for basic poem structure (PMF Spec 2.1, 2.2, 2.3)
  test('parses a simple poem correctly', () => {
    const metastring = 'Simple Poem date=2023-05-01';
    const lines = [
      '[123]',
      'This is a simple poem',
      'With just two lines'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '123',
      anchor: '',
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
    });
  });

  // Test for full poem structure (PMF Spec 2.1-2.4, 3.1-3.6, 4.1-4.7)
  test('parses a poem with full structure correctly', () => {
    const metastring = 'Full Structure Poem date=2023-05-02';
    const lines = [
      '[456]',
      '# Main Title',
      '## Subtitle',
      '> Epigraph line 1',
      '> Epigraph line 2',
      '@ Dedication line 1',
      '@ Dedication line 2',
      '',
      'First stanza line 1',
      'First stanza line 2',
      '',
      'Second stanza line 1',
      'Second stanza line 2',
      '---',
      'author: Jane Doe',
      'language: English',
      '---',
      '[!note 1]',
      'This is a note.',
      '',
      '[!note 2]',
      'This is another note.'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '456',
      anchor: '',
      title: 'Main Title',
      subtitle: 'Subtitle',
      epigraph: ['Epigraph line 1', 'Epigraph line 2'],
      parts: [
        {
          title: '',
          content: [
            'First stanza line 1',
            'First stanza line 2',
            '',
            'Second stanza line 1',
            'Second stanza line 2'
          ],
          metadata: {
            author: 'Jane Doe',
            language: 'English'
          },
          dedication: 'Dedication line 1\nDedication line 2'
        }
      ],
      metadata: { date: '2023-05-02' },
      notes: {
        '1': ['This is a note.'],
        '2': ['This is another note.']
      }
    });
  });

  // Test for multi-part poems (PMF Spec 6.1-6.9)
  test('parses a multi-part poem correctly', () => {
    const metastring = 'Multi-Part Poem';
    const lines = [
      '[789]',
      '# Poem Cycle',
      '## A collection of poems',
      '',
      '### Part 1',
      '',
      'Part 1 content',
      '---',
      'date: 2023-05-03',
      '---',
      '### Part 2',
      'Part 2 content',
      '---',
      'date: 2023-05-04',
      '---'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '789',
      anchor: '',
      title: 'Poem Cycle',
      subtitle: 'A collection of poems',
      epigraph: [],
      parts: [
        {
          title: '',
          content: [],
          metadata: {}
        },
        {
          title: 'Part 1',
          content: ['Part 1 content'],
          metadata: { date: '2023-05-03' }
        },
        {
          title: 'Part 2',
          content: ['Part 2 content'],
          metadata: { date: '2023-05-04' }
        }
      ],
      metadata: {},
      notes: {}
    });
  });

  // Test for poems without metadata (PMF Spec 4.1, 4.2)
  test('handles poems with no metadata correctly', () => {
    const metastring = 'No Metadata Poem';
    const lines = [
      '[101]',
      '# Just a Title',
      'Line 1',
      'Line 2'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '101',
      anchor: '',
      title: 'Just a Title',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['Line 1', 'Line 2'],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    });
  });

  // Test for poems with translation (PMF Spec 7.1)
  test('parses a poem with translation correctly', () => {
    const metastring = 'Translated Poem';
    const lines = [
      '[202]',
      '# Original Title',
      '## Original Subtitle',
      '### Original Version',
      'Original content',
      '---',
      'type: original',
      'language: French',
      '---',
      '### Translated Version',
      'Translated content',
      '---',
      'type: translation',
      'language: English',
      'translator: John Smith',
      '---'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '202',
      anchor: '',
      title: 'Original Title',
      subtitle: 'Original Subtitle',
      epigraph: [],
      parts: [
        {
          content: [],
          metadata: {},
          title: '',
        },
        {
          title: 'Original Version',
          content: ['Original content'],
          metadata: { language: 'French', type: 'original' }
        },
        {
          title: 'Translated Version',
          content: ['Translated content'],
          metadata: {
            language: 'English',
            translator: 'John Smith',
            type: 'translation'
          }
        }
      ],
      metadata: {},
      notes: {}
    });
  });


  // Test for poems with multiple epigraphs (PMF Spec 3.1)
  test('handles multiple epigraphs correctly', () => {
    const metastring = 'Multiple Epigraphs Poem';
    const lines = [
      '[303]',
      '# Poem with Multiple Epigraphs',
      '> First epigraph',
      '> -- Author 1',
      '> Second epigraph',
      '> -- Author 2',
      '',
      'Poem content here'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '303',
      anchor: '',
      title: 'Poem with Multiple Epigraphs',
      subtitle: '',
      epigraph: ['First epigraph', '-- Author 1', 'Second epigraph', '-- Author 2'],
      parts: [
        {
          title: '',
          content: ['Poem content here'],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    });
  });

  // Test for poems with multiple dedications (PMF Spec 3.2)
  test('handles multiple dedications correctly', () => {
    const metastring = 'Multiple Dedications Poem';
    const lines = [
      '[404]',
      '# Poem with Multiple Dedications',
      '@ To my family',
      '@ And to my friends',
      '',
      'Poem content here'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '404',
      anchor: '',
      title: 'Poem with Multiple Dedications',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['Poem content here'],
          metadata: {},
          dedication: 'To my family\nAnd to my friends'
        }
      ],
      metadata: {},
      notes: {}
    });
  });

    // Test for poems with complex stanza structure (PMF Spec 3.4)
    test('preserves complex stanza structure', () => {
      const metastring = 'Complex Stanza Poem';
      const lines = [
        '[505]',
        '# Complex Stanza Poem',
        '',
        'First stanza line 1',
        'First stanza line 2',
        '',
        'Second stanza line 1',
        'Second stanza line 2',
        'Second stanza line 3',
        '',
        'Third stanza - single line'
      ];
  
      const result = parsePoemStructure(metastring, lines);
  
      expect(result).toEqual({
        id: '505',
        anchor: '',
        title: 'Complex Stanza Poem',
        subtitle: '',
        epigraph: [],
        parts: [
          {
            title: '',
            content: [
              'First stanza line 1',
              'First stanza line 2',
              '',
              'Second stanza line 1',
              'Second stanza line 2',
              'Second stanza line 3',
              '',
              'Third stanza - single line'
            ],
            metadata: {}
          }
        ],
        metadata: {},
        notes: {}
      });
    });

  // Test for poems with inline formatting (PMF Spec 3.5)
  test('preserves inline formatting', () => {
    const metastring = 'Formatted Poem';
    const lines = [
      '[606]',
      '# Poem with Formatting',
      '',
      'This line has *italics* and **bold**',
      'This line has ***bold italics***'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '606',
      anchor: '',
      title: 'Poem with Formatting',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: [
            'This line has *italics* and **bold**',
            'This line has ***bold italics***'
          ],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    });
  });

  // Test for poems with footnotes (PMF Spec 3.6)
  test('handles footnotes correctly', () => {
    const metastring = 'Poem with Footnotes';
    const lines = [
      '[707]',
      '# Footnoted Poem',
      '',
      'This line has a footnote[1]',
      'This line has another footnote[2]',
      '[!note 1]',
      'This is the first footnote',
      '[!note 2]',
      'This is the second footnote'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '707',
      anchor: '',
      title: 'Footnoted Poem',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: [
            'This line has a footnote[1]',
            'This line has another footnote[2]'
          ],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {
        '1': ['This is the first footnote'],
        '2': ['This is the second footnote']
      }
    });
  });

  // Test for poems with custom metadata fields (PMF Spec 4.4)
  test('handles custom metadata fields', () => {
    const metastring = 'Custom Metadata Poem';
    const lines = [
      '[808]',
      '# Poem with Custom Metadata',
      '',
      'Poem content here',
      '---',
      'mood: melancholic',
      'inspiration: midnight walk',
      'written_in: Paris'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '808',
      anchor: '',
      title: 'Poem with Custom Metadata',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['Poem content here'],
          metadata: {
            mood: 'melancholic',
            inspiration: 'midnight walk',
            written_in: 'Paris'
          }
        }
      ],
      metadata: {},
      notes: {}
    });
  });
  
  test('handles empty lines correctly in various contexts', () => {
    const metastring = 'Empty Lines Handling Poem';
    const lines = [
      '',
      '[909]',
      '',
      '# Poem with Empty Lines',
      '',
      '## Subtitle with empty lines',
      '',
      '',
      '> Epigraph with empty lines',
      '> -- Author',
      '',
      '',
      '@ Dedication with empty lines',
      '',
      '',
      '### Part 1',
      '',
      'First stanza line 1',
      'First stanza line 2',
      '',
      '',
      'Second stanza line 1',
      'Second stanza line 2',
      '',
      '',
      '### Part 2',
      '',
      'Part 2 content',
      '',
      '---',
      '',
      'custom_field: value with empty lines',
      '',
      '---',
      '',
      '[!note 1]',
      '',
      'This is a footnote with empty lines',
      '',
      '',
      '',
      ''
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '909',
      anchor: '',
      title: 'Poem with Empty Lines',
      subtitle: 'Subtitle with empty lines',
      epigraph: ['Epigraph with empty lines', '-- Author'],
      parts: [
        {
          title: '',
          content: [],
          metadata: {},
          dedication: 'Dedication with empty lines'
        },
        {
          title: 'Part 1',
          content: [
            'First stanza line 1',
            'First stanza line 2',
            '',
            'Second stanza line 1',
            'Second stanza line 2'
          ],
          metadata: {}
        },
        {
          title: 'Part 2',
          content: ['Part 2 content'],
          metadata: {
            custom_field: 'value with empty lines'
          }
        }
      ],
      metadata: {},
      notes: {
        '1': ['This is a footnote with empty lines']
      }
    });
  });

  // Test for handling of empty lines in footnotes (PMF Spec 3.6)
  test('handles empty lines in content and footnotes correctly', () => {
    const metastring = 'Poem with Empty Lines';
    const lines = [
      '[1010]',
      '# Poem with Empty Lines',
      '',
      'First stanza line 1',
      'First stanza line 2',
      '',
      'Second stanza line 1',
      'Second stanza line 2',
      '',
      '',
      'Third stanza - single line',
      '',
      '[!note 1]',
      '',
      'This is the first footnote',
      'with multiple lines',
      '',
      'and an empty line in between',
      '',
      '[!note 2]',
      '',
      'This is the second footnote',
      'with no empty lines',
      '',
      '[!note 3]',
      '',
      'This is the third footnote',
      '',
      '',
      'with multiple empty lines',
      '',
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '1010',
      anchor: '',
      title: 'Poem with Empty Lines',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: [
            'First stanza line 1',
            'First stanza line 2',
            '',
            'Second stanza line 1',
            'Second stanza line 2',
            '',
            'Third stanza - single line'
          ],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {
        '1': [
          'This is the first footnote',
          'with multiple lines',
          '',
          'and an empty line in between'
        ],
        '2': [
          'This is the second footnote',
          'with no empty lines'
        ],
        '3': [
          'This is the third footnote',
          '',
          'with multiple empty lines'
        ]
      }
    });
  });

  test('handles metadata date with missing title', () => {
    const metastring = 'date=1985';
    const lines = [
      '[2020]',
      'First line of the poem',
      'Second line of the poem'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '2020',
      anchor: '',
      title: '',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: [
            'First line of the poem',
            'Second line of the poem'
          ],
          metadata: {}
        }
      ],
      metadata: { date: '1985' },
      notes: {}
    });
  });
  test('handles metadata date with title', () => {
    const metastring = 'Poem Title date=1985';
    const lines = [
      '[2021]',
      'First line of the poem',
      'Second line of the poem'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '2021',
      anchor: '',
      title: 'Poem Title',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: [
            'First line of the poem',
            'Second line of the poem'
          ],
          metadata: {}
        }
      ],
      metadata: { date: '1985' },
      notes: {}
    });
  });
  test('handles title without date', () => {
    const metastring = 'Just a Title';
    const lines = ['[2023]', 'First line of the poem', 'Second line of the poem'];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '2023',
      anchor: '',
      title: 'Just a Title',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['First line of the poem', 'Second line of the poem'],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    });
  });
  test('handles title with date without space', () => {
    const metastring = 'No Space Titledate=2000';
    const lines = ['[2024]', 'First line of the poem', 'Second line of the poem'];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '2024',
      anchor: '',
      title: 'No Space Titledate=2000',
      subtitle: '',
      epigraph: [],
      parts: [
        {
          title: '',
          content: ['First line of the poem', 'Second line of the poem'],
          metadata: {}
        }
      ],
      metadata: {},
      notes: {}
    });
  });
  

  test('handles anchor metadata correctly', () => {
    const metastring = 'Poem with Anchor';
    const lines = [
      '[123]',
      '# Test Poem',
      '---',
      'anchor: my-poem-anchor',
      '---',
      'First line',
      'Second line'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '123',
      anchor: '',
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
    });
  });

  test('handles id metadata correctly', () => {
    const metastring = 'Poem with ID';
    const lines = [
      '# Test Poem',
      '---',
      'id: custom-poem-id',
      '---',
      'First line',
      'Second line'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: 'custom-poem-id',
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
    });
  });

  test('handles basic epigraph correctly', () => {
    const metastring = 'Basic Epigraph Test';
    const lines = [
      '[123]',
      '# Poem Title',
      '> This is an epigraph',
      '> -- Author Name',
      '',
      'First line of poem',
      'Second line of poem'
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '123',
      anchor: '',
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
    });
  });

  test('parses poem with epigraph after metadata correctly', () => {
    const metastring = 'General Poem Title\n---\ndate=2023-10-01';
    const lines = [
      '# General Poem Title',
      '---',
      'id: 16',
      'anchor: general-poem-title',
      '---',
      '> "This is an epigraph line that provides insight."',
      '> -- Author of the Epigraph',
      '',
      'This is the first line of the poem,',
      'Continuing with the second line,',
      'And here is the third line of the poem.',
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '16', // Adjust this based on your expected ID
      anchor: 'general-poem-title', // Adjust this based on your expected anchor
      title: 'General Poem Title',
      subtitle: '',
      epigraph: [
        '"This is an epigraph line that provides insight."',
        '-- Author of the Epigraph',
      ],
      parts: [
        {
          title: '',
          content: [
            'This is the first line of the poem,',
            'Continuing with the second line,',
            'And here is the third line of the poem.',
          ],
          metadata: {},
        },
      ],
      metadata: {
      },
      notes: {},
    });
  });

  test('parses poem with epigraph without space after > correctly', () => {
    const metastring = 'Another General Poem Title\n---\ndate=2023-10-01';
    const lines = [
      '# Another General Poem Title',
      '---',
      'id: 1',
      '---',
      '>“This is an epigraph line without a space.”',
      '>-- Author of the Epigraph',
      '',
      'This is the first line of the poem,',
      'Continuing with the second line,',
      'And here is the third line of the poem.',
    ];

    const result = parsePoemStructure(metastring, lines);

    expect(result).toEqual({
      id: '1', // Adjust this based on your expected ID
      anchor: '', // Adjust this based on your expected anchor
      title: 'Another General Poem Title',
      subtitle: '',
      epigraph: [
        '“This is an epigraph line without a space.”',
        '-- Author of the Epigraph',
      ],
      parts: [
        {
          title: '',
          content: [
            'This is the first line of the poem,',
            'Continuing with the second line,',
            'And here is the third line of the poem.',
          ],
          metadata: {},
        },
      ],
      metadata: {
      },
      notes: {},
    });
  });

});