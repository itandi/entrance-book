document.addEventListener('DOMContentLoaded', () => {
    // Fetch Blog Posts from multiple RSS feeds using CORS proxy
    const fetchBlogPosts = (rssUrl, containerId) => {
        const blogContainer = document.getElementById(containerId);
        if (!blogContainer) return;

        const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

        fetch(corsProxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, 'application/xml');
                
                if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                    throw new Error('XML parse error');
                }
                
                const items = xmlDoc.getElementsByTagName('item');
                const posts = [];
                
                for (let i = 0; i < Math.min(3, items.length); i++) {
                    const item = items[i];
                    
                    const title = item.getElementsByTagName('title')[0]?.textContent || '';
                    const link = item.getElementsByTagName('link')[0]?.textContent || '';
                    const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
                    
                    // Try to get media:thumbnail from media namespace
                    let imageUrl = '';
                    const mediaThumbnail = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
                    if (mediaThumbnail) {
                        imageUrl = mediaThumbnail.getAttribute('url') || mediaThumbnail.textContent;
                    }
                    
                    // Fallback: try to extract from description
                    if (!imageUrl) {
                        const description = item.getElementsByTagName('description')[0]?.textContent || '';
                        const imgMatch = description.match(/<img[^>]*src=["']([^"']+)["']/);
                        if (imgMatch) {
                            imageUrl = imgMatch[1];
                        }
                    }
                    
                    posts.push({
                        title,
                        link,
                        pubDate,
                        imageUrl
                    });
                }
                
                if (posts.length === 0) {
                    throw new Error('No items found in RSS feed');
                }
                
                renderPosts(posts, blogContainer);
            })
            .catch(error => {
                console.error('Error fetching RSS:', error);
                blogContainer.innerHTML = '<p style="font-size: 0.875rem; color: var(--notion-red);">最新記事の取得に失敗しました。</p>';
            });
    };
    
    const renderPosts = (posts, container) => {
        container.innerHTML = posts.map(post => {
            const imageHtml = post.imageUrl ? `
                <div class="blog-post-image" style="width: 100%; height: 180px; overflow: hidden; border-radius: 8px;">
                    <img src="${post.imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            ` : '';
            
            const dateFormatted = post.pubDate.split(' ')[0].replace(/-/g, '.');
            
            return `
                <a href="${post.link}" target="_blank" class="blog-post-link">
                    <div class="notion-card blog-post-card">
                        ${imageHtml}
                        <div class="blog-post-date">
                            ${dateFormatted}
                        </div>
                        <div class="notion-card-title blog-post-title">
                            ${post.title}
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    };

    // Fetch both RSS feeds
    fetchBlogPosts('https://tech.itandi.co.jp/rss', 'blog-posts');
    fetchBlogPosts('https://shanaiho.itandi.co.jp/m/m7e4e938c8e73/rss', 'pr-blog-posts');
});

