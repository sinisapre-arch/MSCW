/**
 * portfolio.js — MSCW Bureau modern portfolio
 * Grouped project layout with before/after sliders and lightbox
 */

// Organize projects with their images grouped
const PROJECTS = [
  {
    id: 'djursholm',
    label: 'Djursholm',
    sub: 'Stockholm County — Luxury Residential',
    images: [
      { type: 'ba', before: '/portfolio/images/djursholm/photo_24_2024-03-28_14-44-34.jpg', after:  '/portfolio/images/djursholm/photo_30_2024-03-28_14-44-34.jpg' },
      { src: '/portfolio/images/djursholm/photo_21_2024-03-28_14-44-34.jpg' },
      { src: '/portfolio/images/djursholm/photo_22_2024-03-28_14-44-34.jpg' },
      { src: '/portfolio/images/djursholm/photo_23_2024-03-28_14-44-34.jpg' },
      { src: '/portfolio/images/djursholm/photo_25_2024-03-28_14-44-34.jpg' },
      { src: '/portfolio/images/djursholm/photo_26_2024-03-28_14-44-34.jpg' },
      { src: '/portfolio/images/djursholm/photo_6_2024-03-28_14-44-34.jpg' },
      { src: '/portfolio/images/djursholm/photo_8_2024-03-28_14-44-34.jpg' },
    ]
  },
  {
    id: 'dalaro',
    label: 'Dalarö',
    sub: 'Stockholm Archipelago — Coastal Transformation',
    images: [
      { type: 'ba', before: '/portfolio/images/dalaro/DJI_0728.JPG', after:  '/portfolio/images/dalaro/photo_2_2024-03-28_14-50-12.jpg' },
      { src: '/portfolio/images/dalaro/DJI_0747.JPG' },
      { src: '/portfolio/images/dalaro/photo_4_2024-03-28_14-50-12.jpg' },
      { src: '/portfolio/images/dalaro/photo_5_2024-03-28_14-50-12.jpg' },
      { src: '/portfolio/images/dalaro/photo_6_2024-03-28_14-50-12.jpg' },
    ]
  },
  {
    id: 'varmdo',
    label: 'Värmdö',
    sub: 'Waterfront Terraced Gardens & Outdoor Living',
    images: [
      { type: 'ba', before: '/portfolio/images/varmdo/varmdo2_before.png', after:  '/portfolio/images/varmdo/varmdo1_After.jpg' },
      { src: '/portfolio/images/varmdo/varmdo3.png' },
      { src: '/portfolio/images/varmdo/varmdo4.jpg' },
      { src: '/portfolio/images/varmdo/varmdo5.jpg' },
      { src: '/portfolio/images/varmdo/varmdo6.jpg' },
      { src: '/portfolio/images/varmdo/varmdo7.jpg' },
      { src: '/portfolio/images/varmdo/varmdo8.jpg' },
      { src: '/portfolio/images/varmdo/varmdo9.jpg' },
      { src: '/portfolio/images/varmdo/varmdo10.jpg' },
      { src: '/portfolio/images/varmdo/varmdo11.png' },
      { src: '/portfolio/images/varmdo/varmdo12.png' },
      { src: '/portfolio/images/varmdo/varmdo13.png' },
    ]
  },
  {
    id: 'ruza',
    label: 'Ruza',
    sub: 'Moscow Oblast — Private Estate Landscape',
    images: [
      { type: 'ba', before: '/portfolio/images/ruza/ruza1_Before.jpg', after:  '/portfolio/images/ruza/ruza0_after.png' },
      { src: '/portfolio/images/ruza/ruza2.jpg' },
      { src: '/portfolio/images/ruza/ruza3.png' },
      { src: '/portfolio/images/ruza/ruza4.png' },
    ]
  },
  {
    id: 'stallarholmen',
    label: 'Stallarholmen',
    sub: 'Södermanland — Residential Garden',
    images: [
      { type: 'ba', before: '/portfolio/images/stallarholmen/stallar1_Before.jpg', after:  '/portfolio/images/stallarholmen/stallar1_After.jpg' },
      { src: '/portfolio/images/stallarholmen/stallar3.jpg' },
      { src: '/portfolio/images/stallarholmen/stallar4.jpg' },
      { src: '/portfolio/images/stallarholmen/stallar5.jpg' },
      { src: '/portfolio/images/stallarholmen/stallar6.jpg' },
      { src: '/portfolio/images/stallarholmen/stallar7.jpg' },
      { src: '/portfolio/images/stallarholmen/stallar8.jpg' },
      { src: '/portfolio/images/stallarholmen/stallar9.jpg' },
    ]
  },
  {
    id: 'eco-hotel',
    label: 'Eco Hotel',
    sub: 'AI Concept Rendering — Hospitality',
    images: [
      { type: 'ba', before: '/portfolio/images/eco-hotel/eco1_before.jpg', after:  '/portfolio/images/eco-hotel/eco2_after.jpg' },
      { src: '/portfolio/images/eco-hotel/eco3.jpg' },
      { src: '/portfolio/images/eco-hotel/eco4.jpg' },
      { src: '/portfolio/images/eco-hotel/eco5.jpg' },
      { src: '/portfolio/images/eco-hotel/eco6.jpg' },
      { src: '/portfolio/images/eco-hotel/eco7.jpg' },
      { src: '/portfolio/images/eco-hotel/eco8.jpg' },
    ]
  },
  {
    id: 'crimea',
    label: 'Crimea',
    sub: 'AI Archviz — Coastal Estate',
    images: [
      { type: 'ba', before: '/portfolio/images/crimea/krim1_before.png', after:  '/portfolio/images/crimea/krim2_after.png' },
      { src: '/portfolio/images/crimea/ph01_archviz_fluxtools_HQ_0001.png' },
      { src: '/portfolio/images/crimea/krim3.png' },
      { src: '/portfolio/images/crimea/krim4.png' },
      { src: '/portfolio/images/crimea/krim5.jpg' },
      { src: '/portfolio/images/crimea/krim6.jpg' },
      { src: '/portfolio/images/crimea/krim8.png' },
      { src: '/portfolio/images/crimea/krim9.jpg' },
      { src: '/portfolio/images/crimea/krim10.png' },
      { src: '/portfolio/images/crimea/krim11.png' },
      { src: '/portfolio/images/crimea/krim12.png' },
      { src: '/portfolio/images/crimea/krim13.png' },
    ]
  },
];

// Flatten all images for lightbox navigation
let lightboxImages = [];
let lightboxIndex  = 0;
let currentFilter  = 'all';

function buildLightboxImages(filter) {
  lightboxImages = [];
  if (filter === 'all') {
    PROJECTS.forEach(project => {
      project.images.forEach(img => {
        lightboxImages.push({
          src: img.type === 'ba' ? img.after : img.src,
          label: project.label,
          sub: project.sub,
        });
      });
    });
  } else {
    const project = PROJECTS.find(p => p.id === filter);
    if (project) {
      project.images.forEach(img => {
        lightboxImages.push({
          src: img.type === 'ba' ? img.after : img.src,
          label: project.label,
          sub: project.sub,
        });
      });
    }
  }
}

function openModal(globalIdx) {
  const modal    = document.getElementById('pf-modal');
  const img      = document.getElementById('pf-modal-img');
  const cap      = document.getElementById('pf-modal-caption');
  const counter  = document.getElementById('pf-modal-counter');
  const category = document.getElementById('pf-modal-category');

  lightboxIndex = globalIdx;
  const item = lightboxImages[lightboxIndex];
  if (!item) return;

  img.src       = item.src;
  cap.textContent = item.sub;
  category.textContent = item.label;
  counter.textContent  = `${lightboxIndex + 1} / ${lightboxImages.length}`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('pf-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function navigateModal(dir) {
  const img     = document.getElementById('pf-modal-img');
  const cap     = document.getElementById('pf-modal-caption');
  const counter = document.getElementById('pf-modal-counter');
  const category = document.getElementById('pf-modal-category');

  img.classList.add('transitioning');
  setTimeout(() => {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    const item = lightboxImages[lightboxIndex];
    img.src = item.src;
    cap.textContent = item.sub;
    category.textContent = item.label;
    counter.textContent  = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    img.classList.remove('transitioning');
  }, 280);
}

function buildImageGrid(project, globalImageIndex, showOnlyFirst = false) {
  const grid = document.createElement('div');
  grid.className = 'pf-project-grid';

  let imgIdx = globalImageIndex;
  const imagesToShow = showOnlyFirst ? project.images.slice(0, 1) : project.images;

  imagesToShow.forEach((imgData, displayIndex) => {
    const card = document.createElement('div');
    card.className = 'pf-image-card';

    // Calculate the actual index of this image in the full project.images array
    const actualImageIndex = displayIndex;

    if (imgData.type === 'ba') {
      card.innerHTML = `
        <div class="pf-ba-wrap">
          <img class="pf-after" src="${imgData.after}" alt="After" loading="lazy" />
          <div class="pf-ba-before-clip" style="width:50%">
            <img src="${imgData.before}" alt="Before" loading="lazy" />
          </div>
          <div class="pf-ba-handle" style="left:50%"></div>
          <input type="range" class="pf-ba-range" min="0" max="100" value="50"
                 aria-label="Before after comparison slider" />
          <span class="pf-ba-badge">Drag to compare</span>
        </div>
      `;

      // Wire up BA slider
      requestAnimationFrame(() => {
        const wrap   = card.querySelector('.pf-ba-wrap');
        const clip   = card.querySelector('.pf-ba-before-clip');
        const handle = card.querySelector('.pf-ba-handle');
        const range  = card.querySelector('.pf-ba-range');
        const inner  = card.querySelector('.pf-ba-before-clip img');

        const update = () => {
          if (!wrap) return;
          const pct = range.value;
          clip.style.width = pct + '%';
          handle.style.left = pct + '%';
          if (inner) inner.style.width = wrap.offsetWidth + 'px';
        };
        
        range.addEventListener('input', update);
        update();
      });

      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('pf-ba-range')) return;
        // Calculate the correct lightbox index based on current filter
        const lightboxIdx = calculateLightboxIndex(project, actualImageIndex);
        openModal(lightboxIdx);
      });
    } else {
      card.innerHTML = `<img src="${imgData.src}" alt="${project.label}" loading="lazy" />`;
      card.addEventListener('click', () => {
        // Calculate the correct lightbox index based on current filter
        const lightboxIdx = calculateLightboxIndex(project, actualImageIndex);
        openModal(lightboxIdx);
      });
    }

    grid.appendChild(card);
    imgIdx++;
  });

  return { element: grid, nextIdx: imgIdx };
}

// Helper function to calculate correct lightbox index
function calculateLightboxIndex(project, imageIndexInProject) {
  let idx = 0;
  for (let p of PROJECTS) {
    if (p.id === project.id) {
      return idx + imageIndexInProject;
    }
    idx += p.images.length;
  }
  return 0;
}

function renderGallery(filter) {
  currentFilter = filter;
  buildLightboxImages(filter);

  const container = document.getElementById('pf-masonry');
  if (!container) return;
  container.innerHTML = '';

  let globalImgIdx = 0;
  const isAllView = filter === 'all';

  // Add/remove all-view class
  if (isAllView) {
    container.classList.add('all-view');
  } else {
    container.classList.remove('all-view');
  }

  const projectsToShow = isAllView 
    ? PROJECTS 
    : PROJECTS.filter(p => p.id === filter);

  projectsToShow.forEach((project) => {
    // Create project section
    const section = document.createElement('div');
    section.className = 'pf-project-section';
    section.dataset.projectId = project.id;

    // Project header
    const header = document.createElement('div');
    header.className = 'pf-project-header';
    header.innerHTML = `
      <h3 class="pf-project-title">${project.label.toUpperCase()}</h3>
      <p class="pf-project-sub">${project.sub}</p>
    `;
    section.appendChild(header);

    // Project images grid (show only first image in ALL view, all images in specific project view)
    const { element: grid, nextIdx } = buildImageGrid(project, globalImgIdx, isAllView);
    section.appendChild(grid);

    container.appendChild(section);
    globalImgIdx = nextIdx;
  });
}

export function initPortfolio() {
  const tabs = document.querySelectorAll('.pf-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGallery(tab.dataset.filter);
    });
  });

  // Modal controls
  document.getElementById('pf-modal-close')?.addEventListener('click', closeModal);
  document.getElementById('pf-modal-prev')?.addEventListener('click', () => navigateModal(-1));
  document.getElementById('pf-modal-next')?.addEventListener('click', () => navigateModal(1));

  // Click outside to close
  document.getElementById('pf-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'pf-modal') closeModal();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('pf-modal');
    if (!modal?.classList.contains('open')) return;
    if (e.key === 'ArrowRight') navigateModal(1);
    if (e.key === 'ArrowLeft')  navigateModal(-1);
    if (e.key === 'Escape')     closeModal();
  });

  // Initial render
  renderGallery('djursholm');
}
