document.addEventListener('DOMContentLoaded', () => {
    // Fetch Blog Posts from multiple RSS feeds
    const fetchBlogPosts = (rssUrl, containerId, limit = 3) => {
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
                    const posts = data.items.slice(0, limit);
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

    const fetchPodcastPosts = (rssUrl, containerId, limit = 3) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    const feedImage = data.feed?.image;
                    const posts = data.items.slice(0, limit);
                    container.innerHTML = posts.map(post => {
                        const imageUrl = (post.thumbnail && !post.thumbnail.match(/\.(mp3|m4a|ogg|wav|aac)$/i))
                            ? post.thumbnail
                            : feedImage || null;
                        const imageHtml = imageUrl ? `
                            <div class="podcast-card-image">
                                <img src="${imageUrl}" alt="${post.title}">
                            </div>
                        ` : '<div class="podcast-icon-placeholder">🎙️</div>';

                        const audioUrl = post.enclosure?.link || post.enclosure?.url || null;
                        const audioHtml = audioUrl ? `
                            <audio class="podcast-player" controls preload="none">
                                <source src="${audioUrl}" type="audio/mpeg">
                            </audio>
                        ` : '';

                        return `
                            <div class="notion-card podcast-card">
                                <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="podcast-card-header">
                                    ${imageHtml}
                                    <div class="podcast-card-meta">
                                        <div class="blog-post-date">${post.pubDate.split(' ')[0].replace(/-/g, '.')}</div>
                                        <div class="notion-card-title blog-post-title">${post.title}</div>
                                    </div>
                                </a>
                                ${audioHtml}
                            </div>
                        `;
                    }).join('');
                } else {
                    throw new Error(`RSS status: ${data.status || 'unknown'}`);
                }
            })
            .catch(() => {
                container.innerHTML = '<p style="font-size: 0.875rem; color: var(--notion-red);">最新エピソードの取得に失敗しました。</p>';
            });
    };

    // Fetch RSS feeds
    fetchBlogPosts('https://tech.itandi.co.jp/rss', 'blog-posts', 6);
    fetchBlogPosts('https://shanaiho.itandi.co.jp/m/m7e4e938c8e73/rss', 'pr-blog-posts');
    fetchPodcastPosts('https://anchor.fm/s/e7d2d894/podcast/rss', 'podcast-posts', 3);

    // RubyKaigi modal
    const rubykaigiOverlay = document.getElementById('rubykaigi-modal-overlay');
    if (rubykaigiOverlay) {
        const ref = new URLSearchParams(window.location.search).get('ref');
        if (ref === 'rubykaigi') {
            rubykaigiOverlay.classList.add('is-open');
        }
        const closeBtn = rubykaigiOverlay.querySelector('.rubykaigi-modal__close');
        const closeModal = () => rubykaigiOverlay.classList.remove('is-open');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        rubykaigiOverlay.addEventListener('click', (e) => {
            if (e.target === rubykaigiOverlay) closeModal();
        });
    }

    // Corp header mobile menu toggle
    const menuBtn = document.querySelector('.corp-header__menu-btn');
    const nav = document.querySelector('.corp-header__nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('is-open');
        });
    }
});
