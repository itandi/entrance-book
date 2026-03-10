document.addEventListener('DOMContentLoaded', () => {
    const escapeHtml = (value) => {
        if (!value) return '';
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const getText = (parent, selectors) => {
        for (const selector of selectors) {
            const el = parent.querySelector(selector);
            if (el && el.textContent) return el.textContent.trim();
        }
        return '';
    };

    const getLink = (entry) => {
        const direct = getText(entry, ['link']);
        if (direct) return direct;

        const linkEl = entry.querySelector('link[href]');
        if (linkEl) return linkEl.getAttribute('href') || '';

        return '';
    };

    const extractImageFromHtml = (htmlText) => {
        if (!htmlText) return '';

        const htmlDoc = new DOMParser().parseFromString(htmlText, 'text/html');
        const img = htmlDoc.querySelector('img[src]');
        return img ? (img.getAttribute('src') || '') : '';
    };

    const getImageUrl = (entry) => {
        const mediaThumb = entry.querySelector('media\\:thumbnail, thumbnail');
        if (mediaThumb && mediaThumb.getAttribute('url')) {
            return mediaThumb.getAttribute('url');
        }

        const mediaContent = entry.querySelector('media\\:content, content[url]');
        if (mediaContent && mediaContent.getAttribute('url')) {
            return mediaContent.getAttribute('url');
        }

        const enclosure = entry.querySelector('enclosure[url]');
        if (enclosure) {
            const type = enclosure.getAttribute('type') || '';
            if (type.startsWith('image/')) {
                return enclosure.getAttribute('url') || '';
            }
        }

        const htmlBody = getText(entry, ['content\\:encoded', 'description', 'summary', 'content']);
        return extractImageFromHtml(htmlBody);
    };

    const formatDate = (rawDate) => {
        if (!rawDate) return '';

        const parsed = new Date(rawDate);
        if (!Number.isNaN(parsed.getTime())) {
            const year = parsed.getFullYear();
            const month = String(parsed.getMonth() + 1).padStart(2, '0');
            const day = String(parsed.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        }

        return rawDate.split(' ')[0].replace(/-/g, '.');
    };

    const parseFeedItems = (xmlText) => {
        const xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');
        if (xmlDoc.querySelector('parsererror')) {
            throw new Error('Failed to parse RSS feed XML');
        }

        let entries = Array.from(xmlDoc.querySelectorAll('item'));
        if (entries.length === 0) {
            entries = Array.from(xmlDoc.querySelectorAll('entry'));
        }

        return entries.map((entry) => ({
            title: getText(entry, ['title']) || 'Untitled',
            link: getLink(entry),
            pubDate: getText(entry, ['pubDate', 'updated', 'published', 'dc\\:date']),
            image: getImageUrl(entry)
        })).filter((post) => post.link);
    };

    const fetchFeedText = async (rssUrl) => {
        const urls = [
            rssUrl,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
            `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`
        ];

        let lastError;
        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                if (!text || !text.trim()) {
                    throw new Error('Empty feed response');
                }
                return text;
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('Failed to fetch RSS feed');
    };

    // Fetch Blog Posts from multiple RSS feeds
    const fetchBlogPosts = async (rssUrl, containerId) => {
        const blogContainer = document.getElementById(containerId);
        if (!blogContainer) return;

        try {
            const xmlText = await fetchFeedText(rssUrl);
            const items = parseFeedItems(xmlText);

            if (items.length === 0) {
                throw new Error('No blog posts found in feed');
            }

            const posts = items.slice(0, 3);
            blogContainer.innerHTML = posts.map(post => {
                const imageHtml = post.image ? `
                            <div class="blog-post-image" style="width: 100%; height: 180px; overflow: hidden; border-radius: 8px;">
                                <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        ` : '';

                return `
                            <a href="${post.link}" target="_blank" class="blog-post-link">
                                <div class="notion-card blog-post-card">
                                    ${imageHtml}
                                    <div class="blog-post-date">
                                        ${formatDate(post.pubDate)}
                                    </div>
                                    <div class="notion-card-title blog-post-title">
                                        ${escapeHtml(post.title)}
                                    </div>
                                </div>
                            </a>
                        `;
            }).join('');
        } catch (error) {
            console.error('Error fetching RSS:', error);
            blogContainer.innerHTML = '<p style="font-size: 0.875rem; color: var(--notion-red);">最新記事の取得に失敗しました。</p>';
        }
    };

    fetchBlogPosts('https://tech.itandi.co.jp/rss', 'blog-posts');
    fetchBlogPosts('https://shanaiho.itandi.co.jp/m/m7e4e938c8e73/rss', 'pr-blog-posts');
});