// ===== STATE (localStorage) =====
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem('li_' + k); return v === null ? def : JSON.parse(v); } catch { return def; } },
  set: (k, v) => localStorage.setItem('li_' + k, JSON.stringify(v))
};

// ===== TRACKING =====
function track(event, props = {}) {
  try { if (window.pendo) window.pendo.track(event, props); } catch (e) {}
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== CONFETTI =====
function launchConfetti() {
  if (typeof confetti !== 'undefined') {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#2AA46A', '#F9A61B', '#34d399', '#fff'] });
    setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, angle: 60 }), 400);
    setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, angle: 120 }), 600);
  }
}

// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS = {
  first_lesson: { icon: '📚', title: 'First Step!', desc: 'Completed your first lesson' },
  first_quiz: { icon: '🎯', title: 'Quiz Ace!', desc: 'Completed your first quiz' },
  first_stock: { icon: '📈', title: 'Baby Buffett!', desc: 'Bought your first stock' },
  perfect_quiz: { icon: '🏆', title: 'Perfect Score!', desc: 'Got all answers right in a quiz' },
  level_up: { icon: '⭐', title: 'Level Up!', desc: 'Reached a new level' },
  saver: { icon: '🐷', title: 'Super Saver!', desc: 'Saved 500+ coins' },
  streak_7: { icon: '🔥', title: 'On Fire!', desc: 'Maintained a 7-day streak' },
};

function unlockAchievement(id) {
  const earned = LS.get('achievements', []);
  if (earned.includes(id)) return;
  earned.push(id);
  LS.set('achievements', earned);
  const a = ACHIEVEMENTS[id];
  if (!a) return;
  showAchievementPopup(a);
  track('achievement_unlocked', { achievement: id });
}

function showAchievementPopup(a) {
  const existing = document.getElementById('achievePopup');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'achievePopup';
  el.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-120px);background:#1a2332;color:#fff;border-radius:20px;padding:16px 24px;display:flex;align-items:center;gap:14px;z-index:9999;box-shadow:0 20px 60px rgba(0,0,0,.4);border:1px solid rgba(42,164,106,.3);transition:transform .4s cubic-bezier(.34,1.56,.64,1);min-width:280px`;
  el.innerHTML = `<div style="font-size:36px">${a.icon}</div><div><div style="font-size:11px;color:#2AA46A;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Achievement Unlocked!</div><div style="font-size:15px;font-weight:700;margin-top:2px">${a.title}</div><div style="font-size:12px;color:#94a3b8;margin-top:2px">${a.desc}</div></div>`;
  document.body.appendChild(el);
  setTimeout(() => el.style.transform = 'translateX(-50%) translateY(0)', 50);
  setTimeout(() => { el.style.transform = 'translateX(-50%) translateY(-120px)'; setTimeout(() => el.remove(), 400); }, 3500);
}

// ===== HEADER =====
function initHeader() {
  const coins = LS.get('coins', 800);
  const xp = LS.get('xp', 0);
  const level = Math.floor(xp / 200);
  const progressPct = (xp % 200) / 200 * 100;

  const coinEl = document.getElementById('coinAmount');
  if (coinEl) coinEl.textContent = Math.round(coins);
  const levelEl = document.getElementById('levelNum');
  if (levelEl) levelEl.textContent = level;
  const progressEl = document.getElementById('progress');
  if (progressEl) progressEl.style.width = progressPct + '%';

  // Animate balance
  const balNum = document.getElementById('balanceNum');
  if (balNum) {
    const target = Math.round(coins);
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      balNum.textContent = n.toLocaleString();
      if (n >= target) clearInterval(timer);
    }, 20);
  }

  const streakEl = document.getElementById('streakCount');
  if (streakEl) streakEl.textContent = LS.get('streak', 30);

  if (coins >= 500) unlockAchievement('saver');
}

// ===== NOTIFICATIONS =====
function loadNotifications() {
  const wrap = document.getElementById('notifWrap');
  if (!wrap) return;
  let notifs = LS.get('notifications', []);
  if (notifs.length === 0) {
    notifs = [{ id: 'notif_welcome', icon: '👋', title: 'Welcome to LittleInvestors!', sub: 'Start a lesson to earn your first coins 🪙', time: 'Just now' }];
    LS.set('notifications', notifs);
  }
  wrap.innerHTML = '';
  notifs.slice(-3).forEach(n => {
    const el = document.createElement('div');
    el.className = 'notification';
    el.id = n.id;
    el.innerHTML = `<div class="notif-icon">${n.icon}</div><div class="notif-body"><div class="notif-title">${n.title}</div><div class="notif-sub">${n.sub}</div></div><span class="notif-close" onclick="dismissNotification('${n.id}')">×</span>`;
    wrap.appendChild(el);
  });
}

function dismissNotification(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = 'all .3s ease';
  el.style.opacity = '0';
  el.style.transform = 'translateX(20px)';
  setTimeout(() => {
    el.remove();
    const notifs = LS.get('notifications', []).filter(n => n.id !== id);
    LS.set('notifications', notifs);
  }, 300);
  track('notification_dismissed', { id });
}

// ===== TODAY'S LEARNING CARD =====
function loadTodayLearnCard() {
  const wrap = document.getElementById('todayLearnWrap');
  if (!wrap) return;
  const completed = JSON.parse(localStorage.getItem('li_completed_lessons') || '[]');
  const nextLesson = [1,2,3,4,5].find(id => !completed.includes(id));
  if (!nextLesson) return;
  const icons = {1:'🪙',2:'🐷',3:'🛒',4:'⚡',5:'🌱'};
  const titles = {1:'What is Money?',2:'Saving Basics',3:'Spending Wisely',4:'Understanding Risk',5:'Investing Basics'};
  wrap.innerHTML = `<a href="/course?lesson=${nextLesson}" style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,#0f2027,#2c5364);border-radius:16px;text-decoration:none;margin-bottom:12px;transition:all .2s ease" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
    <div style="width:44px;height:44px;background:linear-gradient(135deg,#2AA46A,#1b7a4e);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${icons[nextLesson]}</div>
    <div style="flex:1"><div style="font-size:11px;color:#34d399;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Continue Learning</div><div style="font-size:14px;font-weight:600;color:#fff;margin-top:2px">${titles[nextLesson]}</div></div>
    <div style="font-size:20px;color:#64748b">›</div>
  </a>`;
}

// ===== SAVINGS GOAL =====
function loadGoalCard() {
  const wrap = document.getElementById('goalCardWrap');
  if (!wrap) return;
  const goal = LS.get('savings_goal', null);
  if (!goal) return;
  const coins = LS.get('coins', 800);
  const pct = Math.min(100, Math.round((coins / goal.amount) * 100));
  wrap.innerHTML = `<div class="goal-card">
    <div class="goal-header">
      <div class="goal-title">🎯 ${goal.name}</div>
      <div class="goal-pct">${pct}%</div>
    </div>
    <div class="goal-bar"><div class="goal-fill" style="width:${pct}%"></div></div>
    <div class="goal-meta"><span>🪙 ${Math.round(coins).toLocaleString()} saved</span><span>Goal: ${goal.amount.toLocaleString()}</span></div>
  </div>`;
}

function showGoalModal() {
  const modal = document.getElementById('goalModal');
  if (modal) modal.style.display = 'flex';
}

function saveGoal() {
  const name = document.getElementById('goalName')?.value.trim();
  const amount = parseInt(document.getElementById('goalAmount')?.value);
  if (!name || !amount || amount <= 0) { showToast('Please fill in both fields! 🎯'); return; }
  LS.set('savings_goal', { name, amount });
  document.getElementById('goalModal').style.display = 'none';
  loadGoalCard();
  showToast('🎯 Goal set: Save up to ' + amount + ' coins!');
  track('goal_set', { name, amount });
}

// ===== STOCK TOGGLE =====
function toggleStock(ticker) {
  const el = document.getElementById('detail-' + ticker);
  if (!el) return;
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.stock-detail').forEach(d => d.classList.remove('open'));
  if (!isOpen) { el.classList.add('open'); loadShareInfo(ticker); }
  track('stock_viewed', { ticker });
}

// ===== LIVE STOCKS =====
let PRICES = { wmt: 80.94, aapl: 226.80, amzn: 186.51, googl: 175.40, tsla: 180.20, msft: 420.10 };

async function loadLiveStocks() {
  try {
    const res = await fetch('/api/stocks');
    const data = await res.json();
    if (data.success && data.stocks) {
      Object.keys(data.stocks).forEach(ticker => {
        const stock = data.stocks[ticker];
        PRICES[ticker] = stock.price;
        const priceEl = document.getElementById(`${ticker}-display-price`);
        const changeEl = document.getElementById(`${ticker}-display-change`);
        const detailPriceEl = document.getElementById(`${ticker}-detail-price`);
        if (priceEl) priceEl.textContent = `$${stock.price.toFixed(2)}`;
        if (detailPriceEl) detailPriceEl.textContent = `$${stock.price.toFixed(2)}`;
        if (changeEl) {
          const sign = stock.change >= 0 ? '+' : '';
          changeEl.textContent = `${sign}$${stock.change.toFixed(2)} (${sign}${stock.changePercent.toFixed(2)}%)`;
          changeEl.className = `stock-change ${stock.direction === 'up' ? 'green' : 'red'}`;
        }
        // Update ticker
        const tk = document.getElementById(`tk-${ticker}`);
        const tk2 = document.getElementById(`tk-${ticker}2`);
        const sign = stock.change >= 0 ? '+' : '';
        const cls = stock.direction === 'up' ? 't-up' : 't-dn';
        const txt = `${sign}${stock.changePercent.toFixed(2)}%`;
        if (tk) { tk.textContent = txt; tk.className = cls; }
        if (tk2) { tk2.textContent = txt; tk2.className = cls; }

        // Draw sparkline dynamically
        if (stock.sparkline && stock.sparkline.length > 0) {
          const pathEl = document.getElementById(`sparkline-path-${ticker}`);
          if (pathEl) {
            const min = Math.min(...stock.sparkline);
            const max = Math.max(...stock.sparkline);
            const range = max - min || 1;
            const points = stock.sparkline.map((price, index) => {
              const x = (index / (stock.sparkline.length - 1)) * 50;
              const y = 18 - ((price - min) / range) * 16;
              return `${x},${y}`;
            });
            pathEl.setAttribute('d', `M ${points.join(' L ')}`);
            pathEl.setAttribute('stroke', stock.direction === 'up' ? '#2AA46A' : '#EF4444');
          }
        }
      });
      calculatePortfolioValue();
    }
  } catch (e) {
    console.log('Using cached/fallback stock prices');
  }
}

async function loadMarketNews() {
  const wrap = document.getElementById('marketNewsWrap');
  if (!wrap) return;
  try {
    const res = await fetch('/api/market-news');
    const data = await res.json();
    if (data.success && data.news) {
      wrap.innerHTML = '';
      data.news.forEach(item => {
        const el = document.createElement('div');
        el.style.background = '#fff';
        el.style.border = '1px solid #e2e8f0';
        el.style.borderRadius = '12px';
        el.style.padding = '10px 12px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '10px';
        el.style.fontSize = '12px';
        el.style.fontWeight = '500';
        el.style.color = '#1e293b';
        el.innerHTML = `<span style="font-size:16px">${item.emoji}</span><span>${item.text}</span>`;
        wrap.appendChild(el);
      });
    }
  } catch (e) {
    console.log('Error loading news');
  }
}

function calculatePortfolioValue() {
  let totalValue = 0;
  let holdingsCount = 0;
  Object.keys(PRICES).forEach(ticker => {
    const shares = LS.get('shares_' + ticker, 0);
    if (shares > 0) holdingsCount++;
    totalValue += shares * PRICES[ticker];
  });
  const gainEl = document.getElementById('portfolioGain');
  if (gainEl) gainEl.textContent = totalValue > 0 ? `📈 Portfolio: $${totalValue.toFixed(2)}` : '📈 Start investing below!';
  const portSummary = document.getElementById('portSummary');
  const portVal = document.getElementById('portVal');
  const portHoldings = document.getElementById('portHoldings');
  if (totalValue > 0 && portSummary) {
    portSummary.style.display = 'flex';
    if (portVal) portVal.textContent = `$${totalValue.toFixed(2)}`;
    if (portHoldings) portHoldings.textContent = holdingsCount + ' stock' + (holdingsCount !== 1 ? 's' : '');
  }
}

function loadShareInfo(ticker) {
  const shares = LS.get('shares_' + ticker, 0);
  const el = document.getElementById(ticker + '-shares');
  const vel = document.getElementById(ticker + '-value');
  if (el) el.textContent = shares + ' share' + (shares !== 1 ? 's' : '');
  if (vel) vel.textContent = '$' + (shares * PRICES[ticker]).toFixed(2);
}

function buySell(ticker, action) {
  const coins = LS.get('coins', 800);
  const price = PRICES[ticker];
  const shares = LS.get('shares_' + ticker, 0);
  const prevShares = LS.get('total_shares', 0);
  if (action === 'buy') {
    if (coins < price) { showToast('Not enough coins! 💸 Complete lessons to earn more.'); return; }
    LS.set('coins', Math.round((coins - price) * 100) / 100);
    LS.set('shares_' + ticker, shares + 1);
    LS.set('total_shares', prevShares + 1);
    showToast(`✅ Bought 1 ${ticker.toUpperCase()} for $${price.toFixed(2)}!`);
    track('stock_purchased', { ticker, price });
    if (prevShares === 0) { unlockAchievement('first_stock'); launchConfetti(); }
  } else {
    if (shares < 1) { showToast("You don't own any shares to sell! 📉"); return; }
    LS.set('coins', Math.round((coins + price) * 100) / 100);
    LS.set('shares_' + ticker, shares - 1);
    showToast(`💰 Sold 1 ${ticker.toUpperCase()} for $${price.toFixed(2)}!`);
    track('stock_sold', { ticker, price });
  }
  loadShareInfo(ticker);
  calculatePortfolioValue();
  initHeader();
}

// ===== PREMIUM STOCKS =====
function checkPremiumStocksLock() {
  const isUnlocked = LS.get('stocks_unlocked', false);
  const premiumWrap = document.getElementById('premiumStocks');
  const lockCard = document.getElementById('lockCard');
  if (isUnlocked) {
    if (premiumWrap) premiumWrap.style.display = 'block';
    if (lockCard) lockCard.style.display = 'none';
  } else {
    if (premiumWrap) premiumWrap.style.display = 'none';
    if (lockCard) lockCard.style.display = 'flex';
  }
}

function unlockPremiumStocks() {
  const coins = LS.get('coins', 800);
  if (coins < 150) { showToast('Need 150 coins to unlock! 🪙 Keep learning.'); return; }
  LS.set('coins', Math.round((coins - 150) * 100) / 100);
  LS.set('stocks_unlocked', true);
  const card = document.getElementById('lockCard');
  if (card) { card.style.opacity = '0'; setTimeout(() => card.remove(), 400); }
  const premium = document.getElementById('premiumStocks');
  if (premium) {
    premium.style.display = 'block';
    premium.style.opacity = '0';
    premium.style.transition = 'opacity .5s ease';
    setTimeout(() => { premium.style.opacity = '1'; }, 50);
  }
  launchConfetti();
  showToast('🎉 Unlocked: Tesla, Google & Microsoft!');
  initHeader();
  track('premium_stocks_unlocked', { cost: 150 });
}

// ===== LESSON COMPLETE =====
function completeLesson(xp) {
  const prevXP = LS.get('xp', 0);
  const prevLevel = Math.floor(prevXP / 200);
  const newXP = prevXP + xp;
  const newLevel = Math.floor(newXP / 200);
  LS.set('xp', newXP);
  LS.set('level', newLevel);
  LS.set('coins', LS.get('coins', 800) + Math.floor(xp / 10));
  if (newLevel > prevLevel) { unlockAchievement('level_up'); launchConfetti(); }
  const lc = LS.get('lessons_completed', 0) + 1;
  LS.set('lessons_completed', lc);
  if (lc === 1) unlockAchievement('first_lesson');
  track('lesson_completed', { xp, total_lessons: lc });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  loadNotifications();
  loadLiveStocks();
  loadMarketNews();
  checkPremiumStocksLock();
  loadGoalCard();
  loadTodayLearnCard();
  track('page_view', { page: window.location.pathname });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.stock') && !e.target.closest('.stock-detail') && !e.target.closest('.buy-sell-btns')) {
      document.querySelectorAll('.stock-detail').forEach(d => d.classList.remove('open'));
    }
    const modal = document.getElementById('goalModal');
    if (modal && e.target === modal) modal.style.display = 'none';
  });
});

// Global exports
window.dismissNotification = dismissNotification;
window.toggleStock = toggleStock;
window.buySell = buySell;
window.completeLesson = completeLesson;
window.showToast = showToast;
window.unlockAchievement = unlockAchievement;
window.launchConfetti = launchConfetti;
window.unlockPremiumStocks = unlockPremiumStocks;
window.showGoalModal = showGoalModal;
window.saveGoal = saveGoal;