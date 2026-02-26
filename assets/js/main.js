document.addEventListener('DOMContentLoaded', () => {
    const fetchBlogPosts = async (rssUrl, containerId) => {
        const blogContainer = document.getElementById(containerId);
        if (!blogContainer) return;

        try {
            // 1. まずは rss2json で試みる
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            let posts = [];

            // 2. 画像が取れていない、または rss2json が失敗している場合 (特に note の RSS)
            // item[0].thumbnail が空なら、AllOrigins 経由で生の XML を取りに行く
            if (data.status !== 'ok' || !data.items[0]?.thumbnail) {
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
                const rawRes = await fetch(proxyUrl);
                const rawData = await rawRes.json();
                
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(rawData.contents, "text/xml");
                const items = xmlDoc.querySelectorAll("item");

                posts = Array.from(items).slice(0, 3).map(item => ({
                    title: item.querySelector("title")?.textContent,
                    link: item.querySelector("link")?.textContent,
                    pubDate: item.querySelector("pubDate")?.textContent || "",
                    // media:thumbnail を直接取得
                    thumbnail: item.getElementsByTagName("media:thumbnail")[0]?.textContent || ""
                }));
            } else {
                posts = data.items.slice(0, 3);
            }

            // 3. HTML の生成
            blogContainer.innerHTML = posts.map(post => {
                const imageUrl = post.thumbnail || post.enclosure?.link || "";
                const imageHtml = imageUrl ? `
                    <div class="blog-post-image" style="width: 100%; height: 180px; overflow: hidden; border-radius: 8px;">
                        <img src="${imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                ` : '';
                
                // 日付のフォーマット調整 (rss2json と生XMLで形式が違うため)
                const dateStr = post.pubDate.includes('-') 
                    ? post.pubDate.split(' ')[0].replace(/-/g, '.') 
                    : new Date(post.pubDate).toLocaleDateString('ja-JP').replace(/\//g, '.');

                return `
                    <a href="${post.link}" target="_blank" class="blog-post-link">
                        <div class="notion-card blog-post-card">
                            ${imageHtml}
                            <div class="blog-post-date">${dateStr}</div>
                            <div class="notion-card-title blog-post-title">${post.title}</div>
                        </div>
                    </a>
                `;
            }).join('');

        } catch (error) {
            console.error("Error fetching RSS:", error);
            blogContainer.innerHTML = '<p style="font-size: 0.875rem; color: var(--notion-red);">最新記事の取得に失敗しました。</p>';
        }
    };

    fetchBlogPosts('https://tech.itandi.co.jp/rss', 'blog-posts');
    fetchBlogPosts('https://shanaiho.itandi.co.jp/m/m7e4e938c8e73/rss', 'pr-blog-posts');
});