document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 150;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Simulated/Fetch Blog Posts
    const blogContainer = document.getElementById('blog-posts');
    if (blogContainer) {
        // In a real scenario, we'd use rss2json or a backend proxy.
        // For this demo, we'll provide simulated posts that look real.
        const posts = [
            {
                title: "イタンジの技術的負債へのスタンス：Rails 7.1へのアップグレードを終えて",
                date: "2025.12.15",
                url: "https://tech.itandi.co.jp/"
            },
            {
                title: "Vertical SaaSにおける大規模データモデリングの極意",
                date: "2025.11.20",
                url: "https://tech.itandi.co.jp/"
            },
            {
                title: "新卒1年目が挑む、AkkaとOpenSearchによるリアルタイム同期基盤",
                date: "2025.10.05",
                url: "https://tech.itandi.co.jp/"
            }
        ];

        blogContainer.innerHTML = posts.map(post => `
            <div class="blog-card">
                <p class="date">${post.date}</p>
                <h4><a href="${post.url}" target="_blank" style="color: white; text-decoration: none;">${post.title}</a></h4>
                <p>Read more on ITANDI Tech Blog...</p>
            </div>
        `).join('');
    }
});
