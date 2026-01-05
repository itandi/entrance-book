---
layout: default
---

{% for section in site.sections %}
{% include {{ section.component }} %}
{% endfor %}
