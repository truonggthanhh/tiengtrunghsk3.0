import { toError } from '../src/lib/errors';
/**
 * Test Gemini API key và list available models
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load .env file
try {
  const envPath = resolve(process.cwd(), '.env');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
  console.log('✅ Loaded .env file\n');
} catch (error) {
  console.log('⚠️  Could not load .env file\n');
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

async function testGemini() {
  console.log('🔍 Testing Gemini API...\n');
  console.log(`API Key: ${GEMINI_API_KEY.substring(0, 10)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 5)}\n`);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Test with gemini-pro (most compatible)
  console.log('📝 Testing gemini-pro model...');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello in Vietnamese');
    const response = await result.response;
    const text = response.text();
    console.log('✅ gemini-pro works!');
    console.log(`   Response: ${text.substring(0, 100)}...\n`);
  } catch (caughtError: unknown) {
      const error = toError(caughtError);
    console.log('❌ gemini-pro failed:');
    console.log(`   ${error.message}\n`);
  }

  // Test list models
  console.log('📋 Attempting to list available models...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available models:');
      data.models?.forEach((model) => {
        const supportsPDF = model.supportedGenerationMethods?.includes('generateContent');
        console.log(`   - ${model.name} ${supportsPDF ? '(supports generateContent)' : ''}`);
      });
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to list models:');
      console.log(`   ${response.status}: ${errorText}`);
    }
  } catch (caughtError: unknown) {
      const error = toError(caughtError);
    console.log('❌ Error listing models:');
    console.log(`   ${error.message}`);
  }
}

testGemini().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
