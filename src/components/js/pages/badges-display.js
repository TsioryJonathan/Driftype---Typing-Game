import {
  badgeConfig,
  badgeManager,
  badgeNotifier,
  getBadgeById,
} from "../badges.js";

export const displayUserBadges = (userId, language = "en") => {
  const container = document.getElementById("badges-container");
  if (!container) return;

  injectBadgeStyles();
  container.innerHTML = "";

  try {
    const userBadges = badgeManager.getUserBadges(userId);
    const unlockedIds = userBadges?.badges || [];
    const allCategories = Object.entries(badgeConfig.categories);
    const hasSpecialBadges = badgeConfig.specialBadges.length > 0;

    // Create category sections
    allCategories.forEach(([categoryId, category]) => {
      const categoryBadges = category.levels.map((level) => ({
        ...level,
        unlocked: unlockedIds.includes(level.id),
      }));

      if (categoryBadges.length > 0) {
        container.appendChild(
          createCategorySection(category, categoryBadges, language)
        );
      }
    });

    // Create special badges section
    if (hasSpecialBadges) {
      const specialBadges = badgeConfig.specialBadges.map((badge) => ({
        ...badge,
        unlocked: unlockedIds.includes(badge.id),
      }));

      container.appendChild(
        createCategorySection(
          {
            name: { [language]: "Achievements" },
            icon: "fa-solid fa-trophy",
            color: "rainbow",
          },
          specialBadges,
          language
        )
      );
    }

    setupBadgeInteractions(container, language);
  } catch (error) {
    console.error("Error displaying badges:", error);
    container.innerHTML = `
      <div class="text-center p-8 text-[var(--color-error)]">
        <i class="fas fa-exclamation-triangle  text-8"></i>
        <p>Failed to load badges</p>
      </div>
    `;
  }
};

const createCategorySection = (category, badges, language) => {
  const section = document.createElement("div");
  section.className = "badge-category";
  section.innerHTML = `
    <div class="category-header flex items-center gap-3 mb-4 pb-2 border-b-2" style="border-color: ${getCategoryColor(category)}">
      <i class="${category.icon} text-gray-4xl" style="color: ${getCategoryColor(category)};"></i>
      <h3 class="text-xl text-[var(--color-text)] m-0">${category.name[language]}</h3>
    </div>
    <div class="badge-grid grid gap-4 p-4" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));"></div>
  `;

  const grid = section.querySelector(".badge-grid");
  badges.forEach((badge) => {
    grid.appendChild(createBadgeCard(badge, language));
  });

  return section;
};

const createBadgeCard = (badge, language) => {
  const card = document.createElement("div");
  card.className = `
    badge-card relative overflow-hidden rounded-2xl p-5 shadow-md transition-all duration-200 cursor-pointer 
    ${badge.unlocked ? "border" : "opacity-70 grayscale"}
  `;
  card.style.borderColor = badge.unlocked ? getBadgeColor(badge) : "";

  card.innerHTML = `
    <div class="badge-icon relative w-16 h-16 mx-auto mb-2 flex items-center justify-center">
      <div class="w-full h-full rounded-full flex items-center justify-center" style="background: ${badge.unlocked ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}">
        <i class="${badge.icon} ${badge.animated ? "fa-beat-fade" : ""} z-10 text-4xl" style="color: ${getBadgeColor(badge)};"></i>
      </div>
     
    </div>
    <div class="badge-info text-center min-h-[80px]">
      <h4 class="text-base font-semibold text-[var(--color-text)] my-2">${badge.name[language]}</h4>
      <p class="text-sm text-[var(--color-text-secondary)] mb-1">${badge.description[language]}</p>
      ${badge.unlocked ? unlockedBadgeUI(badge) : lockedBadgeUI(badge)}
    </div>
  `;

  return card;
};

const unlockedBadgeUI = (badge) => {
  return `
    <div class="flex justify-center gap-2 mt-3 text-xs font-bold" style="color: ${getBadgeColor(badge)}">
      <span>✓ ${badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : "Unlocked"}</span>
      <button class="share-btn border-none bg-transparent transition-transform text-xs" style="color: ${getBadgeColor(badge)}" aria-label="Share badge">
        <i class="fa-solid fa-share-nodes"></i>
      </button>
    </div>
  `;
};

const lockedBadgeUI = (badge) => {
  const progress = badge.progress || 0;
  return `
    <div class="mt-3">
      <div class="w-full h-1 bg-black/10 rounded overflow-hidden">
        <div class="h-full transition-all duration-500" style="width: ${progress}%; background: ${getBadgeColor(badge)}"></div>
      </div>
      <p class="text-[0.7rem] text-[var(--color-text-secondary)] text-center mt-1">${progress}% complete</p>
    </div>
  `;
};

const setupBadgeInteractions = (container, language) => {
  container.addEventListener("click", async (e) => {
    const shareBtn = e.target.closest(".share-btn");
    const badgeCard = e.target.closest(".badge-card.unlocked");

    if (shareBtn) {
      e.stopPropagation();
      const card = shareBtn.closest(".badge-card");
      const badgeName = card.querySelector("h4")?.textContent;
      const badgeDesc = card.querySelector("p")?.textContent;
      await badgeNotifier.shareBadge({
        name: badgeName,
        description: badgeDesc,
      });
    } else if (badgeCard) {
      badgeNotifier.playSound("unlock");
    }
  });
};

const injectBadgeStyles = () => {
  if (!document.getElementById("badge-styles")) {
    const style = document.createElement("style");
    style.id = "badge-styles";
    style.textContent = `
      
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
};

const getBadgeColor = (badge) => {
  const colors = {
    bronze: "#cd7f32",
    silver: "#c0c0c0",
    gold: "#ffd700",
    platinum: "#e5e4e2",
    rainbow:
      "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
    red: "#ff0000",
  };
  return colors[badge.color] || "var(--color-primary)";
};

const getCategoryColor = (category) => {
  return category.color ? getBadgeColor(category) : "var(--color-primary)";
};
