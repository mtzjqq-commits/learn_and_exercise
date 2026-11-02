document.addEventListener('DOMContentLoaded', () => {
  const updateGreeting = () => {
    const hour = new Date().getHours();
    const cnEl = document.querySelector('.greeting-cn');
    const enEl = document.querySelector('.greeting-en');
    let cn = '';
    let en = '';
    if (hour >= 6 && hour < 12) {
      cn = '早上好';
      en = 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      cn = '下午好';
      en = 'Good Afternoon';
    } else {
      cn = '晚上好';
      en = 'Good Evening';
    }
    if (cnEl) cnEl.textContent = cn;
    if (enEl) enEl.textContent = en;
  };
  updateGreeting();

  const previewLayer = document.createElement('div');
  previewLayer.className = 'preview-layer';
  previewLayer.innerHTML = `
    <div class="preview-card">
      <img class="preview-image" src="" alt="Preview">
      <div class="preview-caption"></div>
    </div>
  `;
  document.body.appendChild(previewLayer);

  const previewImage = previewLayer.querySelector('.preview-image');
  const previewCaption = previewLayer.querySelector('.preview-caption');

  const createPreviewSvg = (title, color) => {
    const safeTitle = String(title || 'Preview')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
      <rect width="320" height="200" fill="${color || '#ffffff'}"/>
      <rect x="24" y="24" width="272" height="152" fill="#ffffff" stroke="#000000" stroke-width="3"/>
      <rect x="44" y="54" width="120" height="18" fill="#111111"/>
      <rect x="44" y="90" width="180" height="12" fill="#111111" opacity="0.8"/>
      <rect x="44" y="112" width="150" height="12" fill="#111111" opacity="0.6"/>
      <rect x="44" y="138" width="100" height="12" fill="#111111" opacity="0.4"/>
      <text x="44" y="176" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#111111">${safeTitle}</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const updatePreview = (event, link) => {
    const x = event.clientX + 16;
    const y = event.clientY + 16;
    previewLayer.style.left = `${x}px`;
    previewLayer.style.top = `${y}px`;
    previewImage.src = createPreviewSvg(link.dataset.previewTitle || link.textContent.trim(), link.dataset.previewColor || '#ffffff');
    previewCaption.textContent = link.dataset.previewTitle || link.textContent.trim();
    previewLayer.classList.add('visible');
  };

  document.querySelectorAll('.social-link').forEach((link) => {
    link.addEventListener('mouseenter', (event) => updatePreview(event, link));
    link.addEventListener('mousemove', (event) => updatePreview(event, link));
    link.addEventListener('mouseleave', () => previewLayer.classList.remove('visible'));
  });

  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  const switchPage = (targetId) => {
    navLinks.forEach((link) => link.classList.remove('active'));
    pages.forEach((page) => {
      page.classList.remove('visible');
      if (page.id !== targetId) {
        setTimeout(() => page.classList.remove('active'), 250);
      }
    });
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
      targetPage.classList.add('active');
      void targetPage.offsetWidth;
      requestAnimationFrame(() => targetPage.classList.add('visible'));
    }
    document.querySelector(`.nav-link[data-target="${targetId}"]`)?.classList.add('active');
  };
  navLinks.forEach((link) => {
    link.addEventListener('click', () => switchPage(link.dataset.target));
  });
  switchPage('home');
  const workData = [
    { company: 'TechNova Inc.', role: 'Senior Frontend Engineer', year: '2021 – Present', desc: '主导设计系统重构，提升团队研发效能 40%。' },
    { company: 'PixelCraft Studio', role: 'UI/UX Developer', year: '2018 – 2021', desc: '负责核心产品交互原型与前端落地。' },
    { company: 'CodeBase Solutions', role: 'Junior Developer', year: '2016 – 2018', desc: '参与企业级后台管理系统的前端开发。' },
    { company: 'Freelance', role: 'Web Designer', year: '2015 – 2016', desc: '为初创公司提供品牌视觉与网站搭建服务。' }
  ];
  const eduData = [
    { school: 'Zhejiang University', major: 'Computer Science (M.S.)', year: '2014 – 2016', desc: '研究方向：人机交互与可视化。' },
    { school: 'Huazhong Univ. of Sci. & Tech.', major: 'Software Engineering (B.S.)', year: '2010 – 2014', desc: 'GPA 3.8/4.0，获国家奖学金。' }
  ];
  function initTimelineDrag(track) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const nodes = Array.from(track.children);
    const setActiveNode = () => {
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      nodes.forEach((node, index) => {
        const nodeRect = node.getBoundingClientRect();
        const nodeCenter = nodeRect.left + nodeRect.width / 2;
        const distance = Math.abs(nodeCenter - centerX);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      nodes.forEach((node, index) => node.classList.toggle('active-node', index === nearestIndex));
    };
    const centerNode = (index) => {
      const targetNode = nodes[index];
      if (!targetNode) return;
      const left = targetNode.offsetLeft - (track.clientWidth / 2 - targetNode.clientWidth / 2);
      track.scrollTo({ left, behavior: 'smooth' });
      setActiveNode();
    };
    track.addEventListener('mousedown', (event) => {
      isDown = true;
      startX = event.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.classList.add('dragging');
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('dragging');
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('dragging');
      setActiveNode();
    });
    track.addEventListener('mousemove', (event) => {
      if (!isDown) return;
      event.preventDefault();
      const x = event.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    });
    track.addEventListener('touchstart', (event) => {
      isDown = true;
      startX = event.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', (event) => {
      if (!isDown) return;
      const x = event.touches[0].pageX - track.offsetLeft;
      const walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    }, { passive: true });
    track.addEventListener('touchend', () => {
      isDown = false;
      setActiveNode();
    });
    track.parentElement?.querySelector('.prev')?.addEventListener('click', () => {
      const activeIndex = nodes.findIndex((node) => node.classList.contains('active-node'));
      centerNode(Math.max(0, activeIndex - 1));
    });
    track.parentElement?.querySelector('.next')?.addEventListener('click', () => {
      const activeIndex = nodes.findIndex((node) => node.classList.contains('active-node'));
      centerNode(Math.min(nodes.length - 1, activeIndex + 1));
    });
    setActiveNode();
  }
  const renderTimeline = (data, trackSelector) => {
    const track = document.querySelector(trackSelector);
    if (!track) return;
    const html = data.map((item, index) => {
      const title = item.company || item.school;
      const year = item.year;
      const role = item.role || item.major;
      const desc = item.desc;
      return `<div class="timeline-node ${index === 0 ? 'active-node' : ''}" data-index="${index}">
        <h4>${title}</h4>
        <div class="year">${year}</div>
        <div style="font-weight:800; margin-bottom:4px;">${role}</div>
        <p>${desc}</p>
      </div>`;
    }).join('');
    track.innerHTML = html;
    initTimelineDrag(track);
  };
  renderTimeline(workData, '[data-timeline="work"]');
  renderTimeline(eduData, '[data-timeline="edu"]');
});
