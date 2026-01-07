---
layout: notion
title: イタンジ株式会社 採用情報
---

{% for section in site.sections %}
  <div class="section-content">
    {% include {{ section.component }} %}
  </div>
{% endfor %}
