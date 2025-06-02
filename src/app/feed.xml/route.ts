import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NETLIFY_URL
    ? process.env.NETLIFY_URL
    : process.env.NODE_ENV === 'production'
    ? 'https://greenhacker.tech'
    : 'http://localhost:3000';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GreenHacker Portfolio</title>
    <description>Full-stack developer portfolio showcasing modern web technologies, AI integration, and innovative projects.</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>harsh@greenhacker.tech (GreenHacker)</managingEditor>
    <webMaster>harsh@greenhacker.tech (GreenHacker)</webMaster>
    <category>Technology</category>
    <category>Web Development</category>
    <category>Software Engineering</category>
    <category>Artificial Intelligence</category>

    <item>
      <title>Portfolio Launch - Full-Stack Developer Showcase</title>
      <description>Explore my comprehensive portfolio featuring modern web technologies, AI integrations, and innovative projects. Built with Next.js, React, TypeScript, and cutting-edge tools.</description>
      <link>${baseUrl}</link>
      <guid isPermaLink="true">${baseUrl}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>Portfolio</category>
      <category>Web Development</category>
    </item>

    <item>
      <title>Resume - Professional Experience and Skills</title>
      <description>Download my comprehensive resume showcasing experience in full-stack development, AI/ML projects, and modern web technologies.</description>
      <link>${baseUrl}/resume.pdf</link>
      <guid isPermaLink="true">${baseUrl}/resume.pdf</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>Resume</category>
      <category>Professional</category>
    </item>

    <item>
      <title>GitHub Statistics - Open Source Contributions</title>
      <description>Real-time GitHub statistics and contributions showcasing active development and open source participation.</description>
      <link>${baseUrl}/#github-stats</link>
      <guid isPermaLink="true">${baseUrl}/#github-stats</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>GitHub</category>
      <category>Open Source</category>
    </item>

  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}
