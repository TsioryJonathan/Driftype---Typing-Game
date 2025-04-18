import { 
  badgeConfig, 
  badgeManager, 
  badgeNotifier,
  getBadgeById 
} from '../badges.js';

export const displayUserBadges = (userId, language = 'en') => {
  const container = document.getElementById('badges-container');
  if (!container) return;

  injectBadgeStyles();
  container.innerHTML = '';

  try {
    const userBadges = badgeManager.getUserBadges(userId);
    const unlockedIds = userBadges?.badges || [];
    const allCategories = Object.entries(badgeConfig.categories);
    const hasSpecialBadges = badgeConfig.specialBadges.length > 0;

    // Create category sections
    allCategories.forEach(([categoryId, category]) => {
      const categoryBadges = category.levels.map(level => ({
        ...level,
        unlocked: unlockedIds.includes(level.id),
        progress: calculateProgress(level)
      }));
      
      if (categoryBadges.length > 0) {
        container.appendChild(createCategorySection(category, categoryBadges, language));
      }
    });

    // Create special badges section
    if (hasSpecialBadges) {
      const specialBadges = badgeConfig.specialBadges.map(badge => ({
        ...badge,
        unlocked: unlockedIds.includes(badge.id)
      }));
      
      container.appendChild(
        createCategorySection(
          {
            name: { [language]: 'Achievements' },
            icon: 'fa-solid fa-trophy',
            color: 'rainbow'
          },
          specialBadges,
          language
        )
      );
    }

    setupBadgeInteractions(container, language);
  } catch (error) {
    console.error('Error displaying badges:', error);
    container.innerHTML = `
      <div style="
        text-align: center;
        padding: 2rem;
        color: var(--color-error);
      ">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
        <p>Failed to load badges</p>
      </div>
    `;
  }
};

const createCategorySection = (category, badges, language) => {
  const section = document.createElement('div');
  section.className = 'badge-category';
  section.innerHTML = `
    <div class="category-header" style="
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 16px 0;
      padding: 8px 0;
      border-bottom: 2px solid ${getCategoryColor(category)};
    ">
      <i class="${category.icon}" style="
        color: ${getCategoryColor(category)};
        font-size: 1.25rem;
      "></i>
      <h3 style="
        margin: 0;
        font-size: 1.25rem;
        color: var(--color-text);
      ">${category.name[language]}</h3>
    </div>
    <div class="badge-grid" style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      padding: 16px;
    "></div>
  `;

  const grid = section.querySelector('.badge-grid');
  badges.forEach(badge => {
    grid.appendChild(createBadgeCard(badge, language));
  });

  return section;
}

const createBadgeCard = (badge, language) => {
  const card = document.createElement('div');
  card.className = `badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`;
  card.style.cssText = `
    background: var(--color-bg-secondary);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    ${badge.unlocked ? `border: 1px solid ${getBadgeColor(badge)}` : ''};
    ${!badge.unlocked ? 'opacity: 0.7; filter: grayscale(60%)' : ''};
    cursor: pointer;
  `;

  card.innerHTML = `
    <div class="badge-icon" style="
      position: relative;
      width: 64px;
      height: 64px;
      margin: 0 auto 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${badge.unlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
      ">
        <i class="${badge.icon} ${badge.animated ? 'fa-beat-fade' : ''}" style="
          font-size: 2rem;
          color: ${getBadgeColor(badge)};
          position: relative;
          z-index: 2;
        "></i>
      </div>
      ${badge.unlocked ? shineEffect() : ''}
    </div>
    <div class="badge-info" style="
      text-align: center;
      min-height: 80px;
    ">
      <h4 style="
        margin: 8px 0;
        font-size: 1rem;
        color: var(--color-text);
        font-weight: 600;
      ">${badge.name[language]}</h4>
      <p style="
        margin: 4px 0;
        font-size: 0.8rem;
        color: var(--color-text-secondary);
      ">${badge.description[language]}</p>
      ${badge.unlocked ? unlockedBadgeUI(badge) : lockedBadgeUI(badge)}
    </div>
  `;

  return card;
}

const shineEffect = () => {
  return `
    <div class="shine-effect" style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to right,
        transparent 0%,
        rgba(255,255,255,0.4) 50%,
        transparent 100%
      );
      animation: shine 3s infinite;
      opacity: 0.5;
      pointer-events: none;
    "></div>
  `;
}

const unlockedBadgeUI = (badge) => {
  return `
    <div style="
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
    ">
      <span style="
        color: ${getBadgeColor(badge)};
        font-size: 0.75rem;
        font-weight: bold;
      ">
        ✓ ${badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Unlocked'}
      </span>
      <button class="share-btn" style="
        background: none;
        border: none;
        color: ${getBadgeColor(badge)};
        cursor: pointer;
        font-size: 0.75rem;
        transition: transform 0.2s;
      " aria-label="Share badge">
        <i class="fa-solid fa-share-nodes"></i>
      </button>
    </div>
  `;
}

const lockedBadgeUI = (badge) => {
  const progress = badge.progress || 0;
  return `
    <div style="margin-top: 12px;">
      <div style="
        width: 100%;
        height: 4px;
        background: rgba(0,0,0,0.1);
        border-radius: 2px;
        overflow: hidden;
      ">
        <div style="
          width: ${progress}%;
          height: 100%;
          background: ${getBadgeColor(badge)};
          transition: width 0.5s ease;
        "></div>
      </div>
      <p style="
        margin: 4px 0 0;
        font-size: 0.7rem;
        color: var(--color-text-secondary);
        text-align: center;
      ">${progress}% complete</p>
    </div>
  `;
}

const setupBadgeInteractions = (container, language) => {
  container.addEventListener('click', async (e) => {
    const shareBtn = e.target.closest('.share-btn');
    const badgeCard = e.target.closest('.badge-card.unlocked');
    
    if (shareBtn) {
      e.stopPropagation();
      const card = shareBtn.closest('.badge-card');
      const badgeName = card.querySelector('h4')?.textContent;
      const badgeDesc = card.querySelector('p')?.textContent;
      await badgeNotifier.shareBadge({
        name: badgeName,
        description: badgeDesc
      });
    } else if (badgeCard) {
      badgeNotifier.playSound('unlock');
      // Implement detailed view if needed
    }
  });
}

const injectBadgeStyles = () => {
  if (!document.getElementById('badge-styles')) {
    const style = document.createElement('style');
    style.id = 'badge-styles';
    style.textContent = `
      @keyframes shine {
        100% { transform: translateX(100%); }
      }
      .badge-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      }
      .share-btn:hover {
        transform: scale(1.2);
      }
      .fa-beat-fade {
        animation: fa-beat-fade 2s infinite linear;
      }
      @keyframes fa-beat-fade {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
}

const getBadgeColor = (badge) => {
  const colors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
    rainbow: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
    red: '#ff0000'
  };
  return colors[badge.color] || 'var(--color-primary)';
}

const getCategoryColor = (category) => {
  return category.color ? getBadgeColor(category) : 'var(--color-primary)';
}

const calculateProgress = (badge) => {
  // Implement your progress logic here
  return 0;
}