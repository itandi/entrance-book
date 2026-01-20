---
layout: default
---

{% include components/hero.html %}

{% for section in site.sections %}
  <div class="section-content">
    {% include {{ section.component }} %}
  </div>
{% endfor %}
