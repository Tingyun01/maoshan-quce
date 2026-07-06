// ============================================================
// music-float 组件 — 场景自适应BGM悬浮按钮
// 检测当前页面 → 自动切换场景音乐
// 场景映射：主页→main 图鉴→album 结果页→result 导览→guide 答题→随机 其他→calm
// 23首音轨循环播放，可拖拽，点击静音
// ============================================================
const bgm = require('../../utils/bgm-manager');

// 页面路径 → 场景映射
const PAGE_SCENE_MAP = {
  'pages/index/index': 'main',
  'pages/album/album': 'album',
  'pages/result/result': 'result',
  'pages/guide/guide': 'guide',
  'pages/journey/journey': 'journey',
  'pages/about/about': 'calm',
  'pages/adventure/adventure': 'adventure',
  'pages/dungeon/dungeon': 'dungeon',
  'pages/quiz/quiz': 'quiz',
  'pages/privacy/privacy': 'calm',
  'pages/terms/terms': 'calm',
  'pages/admin-images/admin-images': 'calm',
};

Component({
  properties: {},
  data: {
    isMuted: false,
    currentScene: '',
    x: 0,
    y: 0,
  },
  lifetimes: {
    attached() {
      this._isDragging = false;
      
      // 检测页面场景并自动切换
      this._switchScene();
      
      // 定时刷新静音状态
      this._timer = setInterval(() => this._updateState(), 500);
    },
    detached() {
      if (this._timer) clearInterval(this._timer);
    }
  },
  methods: {
    /** 根据当前页面路径切换场景音乐 */
    _switchScene() {
      try {
        const pages = getCurrentPages();
        if (pages.length === 0) return;
        const route = pages[pages.length - 1].route || '';
        const scene = PAGE_SCENE_MAP[route] || 'calm';
        
        if (scene === this.data.currentScene) return; // 同场景不重复切换
        this.data.currentScene = scene;
        
        if (bgm.isMuted()) return; // 静音状态不播放
        
        if (scene === 'quiz' || scene === 'adventure' || scene === 'dungeon') {
          bgm.playRandomQuiz(); // 答题类场景随机播放
        } else {
          bgm.switchTrack(scene); // 其他场景切换对应音轨
        }
      } catch (e) {}
    },

    _updateState() {
      this.setData({ isMuted: bgm.isMuted() });
    },

    touchStart(e) {
      const touch = e.touches[0];
      this._startX = touch.clientX;
      this._startY = touch.clientY;
      this._isDragging = false;
    },

    touchMove(e) {
      const touch = e.touches[0];
      const dx = touch.clientX - this._startX;
      const dy = touch.clientY - this._startY;
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        this._isDragging = true;
        this.setData({ x: this.data.x + dx, y: this.data.y + dy });
        this._startX = touch.clientX;
        this._startY = touch.clientY;
      }
    },

    touchEnd() {
      this._endDrag = this._isDragging;
    },

    onTap() {
      if (this._endDrag) { this._endDrag = false; return; }
      bgm.toggleMute();
      this.setData({ isMuted: bgm.isMuted() });
    }
  }
});
