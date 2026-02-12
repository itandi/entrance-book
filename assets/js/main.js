document.addEventListener('DOMContentLoaded', () => {
    // Fetch Blog Posts from multiple RSS feeds
    const fetchBlogPosts = (rssUrl, containerId) => {
        const blogContainer = document.getElementById(containerId);
        if (!blogContainer) return;

        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    const posts = data.items.slice(0, 3);
                    blogContainer.innerHTML = posts.map(post => {
                        const imageUrl = post.image || post.enclosure?.link || post.thumbnail;
                        const imageHtml = imageUrl ? `
                            <div class="blog-post-image" style="width: 100%; height: 180px; overflow: hidden; border-radius: 8px;">
                                <img src="${imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        ` : '';
                        
                        return `
                            <a href="${post.link}" target="_blank" class="blog-post-link">
                                <div class="notion-card blog-post-card">
                                    ${imageHtml}
                                    <div class="blog-post-date">
                                        ${post.pubDate.split(' ')[0].replace(/-/g, '.')}
                                    </div>
                                    <div class="notion-card-title blog-post-title">
                                        ${post.title}
                                    </div>
                                </div>
                            </a>
                        `;
                    }).join('');
                } else {
                    throw new Error(`RSS status: ${data.status || 'unknown'}`);
                }
            })
            .catch(error => {
                blogContainer.innerHTML = '<p style="font-size: 0.875rem; color: var(--notion-red);">最新記事の取得に失敗しました。</p>';
            });
    };

    // Fetch both RSS feeds
    fetchBlogPosts('https://tech.itandi.co.jp/rss', 'blog-posts');
    fetchBlogPosts('https://shanaiho.itandi.co.jp/m/m7e4e938c8e73/rss', 'pr-blog-posts');
});
