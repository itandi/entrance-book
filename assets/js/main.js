document.addEventListener('DOMContentLoaded', () => {
    // Simulated/Fetch Blog Posts
    const blogContainer = document.getElementById('blog-posts');
    if (blogContainer) {
        const rssUrl = 'https://tech.itandi.co.jp/rss';
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    const posts = data.items.slice(0, 3);
                    blogContainer.innerHTML = posts.map(post => `
                        <a href="${post.link}" target="_blank" class="blog-post-link">
                            <div class="notion-card blog-post-card">
                                <div class="blog-post-date">
                                    ${post.pubDate.split(' ')[0].replace(/-/g, '.')}
                                </div>
                                <div class="notion-card-title blog-post-title">
                                    ${post.title}
                                </div>
                            </div>
                        </a>
                    `).join('');
                } else {
                    throw new Error('Failed to fetch RSS');
                }
            })
            .catch(error => {
                console.error('Error fetching blog posts:', error);
                blogContainer.innerHTML = '<p style="font-size: 0.875rem; color: var(--notion-red);">最新記事の取得に失敗しました。</p>';
            });
    }
});
