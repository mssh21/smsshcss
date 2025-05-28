import { smsshcss } from './dist/index.js';
import { generateCSSSync } from '../../smsshcss/dist/index.js';

async function debug() {
  console.log('Testing smsshcss directly...');
  try {
    const directCSS = generateCSSSync({
      content: [],
      includeResetCSS: true,
      includeBaseCSS: true,
    });
    console.log('Direct CSS generation works, length:', directCSS.length);
    console.log('Contains Reset CSS:', directCSS.includes('/* Reset CSS */'));
    console.log('Contains margin classes:', directCSS.includes('.m-md'));
  } catch (error) {
    console.error('Direct CSS generation failed:', error);
  }

  console.log('\nTesting Vite plugin...');
  console.log('Creating plugin...');
  const plugin = smsshcss();

  console.log('Plugin created:', plugin.name);
  console.log('Transform function type:', typeof plugin.transform);

  try {
    console.log('Calling transform...');
    const result = await plugin.transform('', 'test.css');

    console.log('Transform result:', result);
    if (result) {
      console.log('Code length:', result.code.length);
      console.log('First 500 chars:');
      console.log(result.code.substring(0, 500));
      console.log('Contains Reset CSS:', result.code.includes('/* Reset CSS */'));
      console.log('Contains Base CSS:', result.code.includes('/* Base CSS */'));
      console.log('Contains margin classes:', result.code.includes('.m-md'));
    }
  } catch (error) {
    console.error('Error during transform:', error);
  }
}

debug();
