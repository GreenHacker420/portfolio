export default function sitemap() {
    const baseUrl = 'https://greenhacker.in';

    // Define static routes
    const routes = [
        '',
        '#about',
        '#projects',
        '#experience',
        '#contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
