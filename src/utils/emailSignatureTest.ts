/**
 * Email Signature Test Utility
 * 
 * This file demonstrates how to use the enhanced email signature functionality
 * and provides examples for testing different signature configurations.
 */

import { 
  getSignaturePreview, 
  createSignatureConfig, 
  validateSignatureConfig,
  defaultSignatureConfig,
  type SignatureConfig 
} from '@/services/emailService';

// Example: Custom signature configuration
const customSignatureConfig: SignatureConfig = createSignatureConfig({
  tagline: 'Passionate about creating innovative web solutions',
  phone: '+91 9479733955',
  imageUrl: 'https://greenhacker.tech/logo.jpg', // Custom image URL
  socialLinks: {
    github: 'https://github.com/GreenHacker420',
    linkedin: 'https://www.linkedin.com/in/harsh-hirawat-b657061b7/',
    instagram: 'https://www.instagram.com/harsh_hirawat_/',
    twitter: 'https://twitter.com/greenhacker420'
  }
});

// Function to test signature generation
export function testSignatureGeneration(): void {
  console.log('=== Email Signature Test ===\n');

  // Test default signature
  console.log('1. Default Signature Configuration:');
  console.log(JSON.stringify(defaultSignatureConfig, null, 2));
  console.log('\n');

  // Test signature validation
  console.log('2. Signature Validation:');
  console.log('Default config valid:', validateSignatureConfig(defaultSignatureConfig));
  console.log('Custom config valid:', validateSignatureConfig(customSignatureConfig));
  console.log('\n');

  // Test signature preview
  console.log('3. Signature Preview (HTML):');
  const preview = getSignaturePreview(customSignatureConfig);
  console.log('HTML signature generated successfully:', preview.html.length > 0);
  console.log('Text signature generated successfully:', preview.text.length > 0);
  console.log('\n');

  // Test image URL generation
  console.log('4. Image URL Testing:');
  const defaultPreview = getSignaturePreview(defaultSignatureConfig);
  const customPreview = getSignaturePreview(customSignatureConfig);
  console.log('Default image URL (should use /image.png):', defaultPreview.html.includes('/image.png'));
  console.log('Custom image URL (should use custom URL):', customPreview.html.includes('https://greenhacker.tech/image.png'));
  console.log('\n');

  // Test plain text signature
  console.log('5. Plain Text Signature Preview:');
  console.log(preview.text);
  console.log('\n');

  console.log('=== Test Complete ===');
}

// Function to generate signature for different scenarios
export function generateSignatureForScenario(scenario: 'professional' | 'casual' | 'minimal'): SignatureConfig {
  switch (scenario) {
    case 'professional':
      return createSignatureConfig({
        tagline: 'Delivering enterprise-grade solutions with modern technology',
        phone: '+91 9479733955',
        socialLinks: {
          linkedin: 'https://www.linkedin.com/in/harsh-hirawat-b657061b7/',
          github: 'https://github.com/GreenHacker420'
        }
      });

    case 'casual':
      return createSignatureConfig({
        tagline: 'Code enthusiast & problem solver 🚀',
        socialLinks: {
          github: 'https://github.com/GreenHacker420',
          linkedin: 'https://www.linkedin.com/in/harsh-hirawat-b657061b7/',
          instagram: 'https://www.instagram.com/harsh_hirawat/',
          twitter: 'https://twitter.com/greenhacker420'
        }
      });

    case 'minimal':
      return createSignatureConfig({
        socialLinks: {
          github: 'https://github.com/GreenHacker420',
          linkedin: 'https://www.linkedin.com/in/harsh-hirawat-b657061b7/'
        }
      });

    default:
      return defaultSignatureConfig;
  }
}

// Function to test image integration specifically
export function testImageIntegration(): void {
  console.log('=== Image Integration Test ===\n');

  // Test with default image (should use /image.png)
  const defaultConfig = defaultSignatureConfig;
  const defaultPreview = getSignaturePreview(defaultConfig);

  console.log('1. Default Image Configuration:');
  console.log('Uses default image.png:', !defaultConfig.imageUrl);
  console.log('HTML contains image reference:', defaultPreview.html.includes('src='));
  console.log('HTML contains fallback avatar:', defaultPreview.html.includes(defaultConfig.alias.charAt(0)));
  console.log('\n');

  // Test with custom image URL
  const customImageConfig = createSignatureConfig({
    imageUrl: 'https://example.com/custom-avatar.jpg'
  });
  const customPreview = getSignaturePreview(customImageConfig);

  console.log('2. Custom Image Configuration:');
  console.log('Uses custom image URL:', !!customImageConfig.imageUrl);
  console.log('HTML contains custom URL:', customPreview.html.includes('https://example.com/custom-avatar.jpg'));
  console.log('HTML still has fallback:', customPreview.html.includes(customImageConfig.alias.charAt(0)));
  console.log('\n');

  // Test image accessibility
  console.log('3. Image Accessibility:');
  console.log('HTML includes alt text:', defaultPreview.html.includes('alt='));
  console.log('Alt text includes name and alias:', defaultPreview.html.includes(defaultConfig.name) && defaultPreview.html.includes(defaultConfig.alias));
  console.log('\n');

  console.log('=== Image Test Complete ===');
}

// Export for use in other parts of the application
export { customSignatureConfig };
