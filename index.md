---
layout: lp
title: イタンジ株式会社 エンジニア採用情報
---

{% include components/hero.html %}

{% for section in site.sections %}
  <div class="section-content">
    {% include {{ section.component }} %}
  </div>
{% endfor %}
