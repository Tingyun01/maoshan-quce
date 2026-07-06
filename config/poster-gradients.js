// ============================================================
// 海报背景降级配色 — 当云存储图片不存在时，用精美渐变代替
// 每类结果一个主题色，让每张分享卡都有独特视觉感
// ============================================================
module.exports = {
  // 🔥 守护神兽
  guardian_beast: {
    dragon:   { colors: ['#2D1B2E', '#5C1A1A', '#8B0000', '#1A0A0A'], icon: '🐉', glow: '#FF4444' },
    phoenix:  { colors: ['#1A0A0A', '#5C1A1A', '#FF4500', '#1A0000'], icon: '🔥', glow: '#FF6347' },
    qilin:    { colors: ['#1B1B3A', '#2E1B3D', '#6B3FA0', '#1A0A2E'], icon: '🦄', glow: '#9B59B6' },
    tiger:    { colors: ['#1A1A2E', '#2D2D1A', '#B8860B', '#1A1A0A'], icon: '🐅', glow: '#FFD700' }
  },
  // 👻 前世今生
  past_life: {
    maoying:  { colors: ['#1A0A0A', '#4A1A1A', '#8B4513', '#0A0000'], icon: '☯️', glow: '#D2691E' },
    gehong:   { colors: ['#1A1A2E', '#2D1B3D', '#7B68EE', '#0A0A1A'], icon: '🔥', glow: '#9370DB' },
    hongjing: { colors: ['#1A2E1A', '#2D3D1B', '#DAA520', '#0A1A0A'], icon: '📖', glow: '#FFD700' },
    wangyuan: { colors: ['#1A2E2E', '#1B3D3D', '#4682B4', '#0A1A1A'], icon: '🏛️', glow: '#5F9EA0' }
  },
  // ⚔️ 古代身份
  ancient_id: {
    general:  { colors: ['#1A1A2E', '#2D1B1B', '#CD853F', '#0A0A1A'], icon: '⚔️', glow: '#DAA520' },
    merchant: { colors: ['#2E2E1A', '#3D3D1B', '#DAA520', '#1A1A0A'], icon: '💰', glow: '#FFD700' },
    scholar:  { colors: ['#1A2E1A', '#1B3D1B', '#8FBC8F', '#0A1A0A'], icon: '📜', glow: '#98FB98' },
    hero:     { colors: ['#1A1A1A', '#2D2D2D', '#696969', '#0A0A0A'], icon: '🗡️', glow: '#A9A9A9' }
  },
  // 🌟 群仙谱
  immortal_cluster: {
    sword_immortal:  { colors: ['#1A1A2E', '#2D2D3D', '#B0C4DE', '#0A0A1A'], icon: '⚡', glow: '#87CEEB' },
    talisman_master: { colors: ['#2E1A2E', '#3D1B3D', '#DDA0DD', '#1A0A1A'], icon: '🔮', glow: '#DA70D6' },
    free_immortal:   { colors: ['#1A2E2E', '#1B3D3D', '#87CEEB', '#0A1A1A'], icon: '☁️', glow: '#00CED1' },
    spirit_tamer:    { colors: ['#1A2E1A', '#1B3D1B', '#98FB98', '#0A1A0A'], icon: '🌿', glow: '#32CD32' }
  },
  // 📿 灵根测试
  spiritual_root: {
    tianling:   { colors: ['#1A1A3A', '#2D2D5C', '#6495ED', '#0A0A2E'], icon: '🌟', glow: '#4169E1' },
    dipin:      { colors: ['#2E1A1A', '#3D2D1B', '#CD853F', '#1A0A0A'], icon: '🏔️', glow: '#DEB887' },
    bianyiling: { colors: ['#1A2E2E', '#1B3D3D', '#20B2AA', '#0A1A1A'], icon: '🌊', glow: '#48D1CC' },
    wuling:     { colors: ['#2E2E1A', '#3D3D1B', '#DAA520', '#1A1A0A'], icon: '🌾', glow: '#F0E68C' }
  },
  // 🔮 隐藏天赋
  hidden_talent: {
    fly:      { colors: ['#1A1A3A', '#2D2D5C', '#87CEEB', '#0A0A2E'], icon: '🕊️', glow: '#00BFFF' },
    foresee:  { colors: ['#1A1A2E', '#2D1B3D', '#9370DB', '#0A0A1A'], icon: '👁️', glow: '#8A2BE2' },
    heal:     { colors: ['#1A2E1A', '#1B3D1B', '#90EE90', '#0A1A0A'], icon: '💚', glow: '#3CB371' },
    strength: { colors: ['#2E1A1A', '#3D1B1B', '#FF6347', '#1A0A0A'], icon: '💪', glow: '#FF4500' }
  },
  // 💕 桃花缘
  love_portrait: {
    rationalist: { colors: ['#1A1A2E', '#2D2D3D', '#6495ED', '#0A0A1A'], icon: '💙', glow: '#4169E1' },
    romantic:    { colors: ['#2E1A2E', '#3D1B3D', '#FF69B4', '#1A0A1A'], icon: '💗', glow: '#FF1493' },
    guardian:    { colors: ['#2E2E1A', '#3D3D1B', '#FFD700', '#1A1A0A'], icon: '🛡️', glow: '#FFA500' },
    gentle:      { colors: ['#1A2E1A', '#1B3D1B', '#98FB98', '#0A1A0A'], icon: '🌸', glow: '#FFB6C1' }
  },
  // ☯️ 五行人格
  wu_xing: {
    jin:  { colors: ['#1A1A2E', '#2D2D1B', '#FFD700', '#0A0A2E'], icon: '⚜️', glow: '#FFD700' },
    mu:   { colors: ['#1A2E1A', '#1B3D1B', '#228B22', '#0A1A0A'], icon: '🌳', glow: '#32CD32' },
    shui: { colors: ['#1A1A3A', '#1B2D5C', '#1E90FF', '#0A0A2E'], icon: '💧', glow: '#00BFFF' },
    huo:  { colors: ['#2E1A1A', '#3D1B1B', '#FF4500', '#1A0A0A'], icon: '🔥', glow: '#FF6347' },
    tu:   { colors: ['#2E2E1A', '#3D2D1B', '#CD853F', '#1A1A0A'], icon: '⛰️', glow: '#DEB887' }
  },
  // 🦅 动物人格
  animal_personality: {
    lion:    { colors: ['#2E2E1A', '#3D2D1B', '#DAA520', '#1A1A0A'], icon: '🦁', glow: '#FFD700' },
    wolf:    { colors: ['#1A1A2E', '#2D2D3D', '#708090', '#0A0A1A'], icon: '🐺', glow: '#A9A9A9' },
    dolphin: { colors: ['#1A1A3A', '#2D2D5C', '#00CED1', '#0A0A2E'], icon: '🐬', glow: '#48D1CC' },
    cat:     { colors: ['#1A1A1A', '#2D2D2D', '#800080', '#0A0A0A'], icon: '🐱', glow: '#9370DB' },
    bear:    { colors: ['#2E1A1A', '#3D2D1B', '#8B4513', '#1A0A0A'], icon: '🐻', glow: '#CD853F' },
    deer:    { colors: ['#1A2E1A', '#1B3D1B', '#8FBC8F', '#0A1A0A'], icon: '🦌', glow: '#98FB98' }
  },
  // 🧙 神仙转世
  immortal: {
    caishen:   { colors: ['#2E2E1A', '#3D1B1B', '#FF4500', '#1A1A0A'], icon: '🧧', glow: '#FF6347' },
    taibai:    { colors: ['#1A1A2E', '#2D2D3D', '#F0E68C', '#0A0A1A'], icon: '⭐', glow: '#FFD700' },
    tudi:      { colors: ['#2E2E1A', '#3D2D1B', '#8B4513', '#1A1A0A'], icon: '🏡', glow: '#CD853F' },
    zhongkui:  { colors: ['#1A1A1A', '#2D1B1B', '#8B0000', '#0A0A0A'], icon: '👹', glow: '#DC143C' },
    nezha:     { colors: ['#2E1A2E', '#3D1B3D', '#FF6347', '#1A0A1A'], icon: '🔥', glow: '#FF4500' },
    yueLao:    { colors: ['#2E1A2E', '#3D1B3D', '#FF69B4', '#1A0A1A'], icon: '💝', glow: '#FF1493' }
  },
  // 🌌 修仙资质
  xiuxian: {
    tian: { colors: ['#1A1A3A', '#2D2D5C', '#7B68EE', '#0A0A2E'], icon: '☀️', glow: '#9370DB' },
    di:   { colors: ['#1A2E1A', '#1B3D1B', '#3CB371', '#0A1A0A'], icon: '🌍', glow: '#2E8B57' },
    fan:  { colors: ['#2E2E1A', '#3D3D1B', '#CD853F', '#1A1A0A'], icon: '👤', glow: '#DAA520' },
    za:   { colors: ['#1A1A1A', '#2D2D2D', '#808080', '#0A0A0A'], icon: '💫', glow: '#A9A9A9' }
  },
  // 🧠 MBTI
  mbti_simple: {
    INTJ: { colors: ['#1A1A2E', '#2D2D3D', '#4169E1', '#0A0A1A'], icon: '🧠', glow: '#6495ED' },
    INTP: { colors: ['#1A2E2E', '#1B3D3D', '#20B2AA', '#0A1A1A'], icon: '💡', glow: '#48D1CC' },
    ENTJ: { colors: ['#2E1A1A', '#3D1B1B', '#FF6347', '#1A0A0A'], icon: '👑', glow: '#FF4500' },
    ENTP: { colors: ['#2E2E1A', '#3D2D1B', '#DAA520', '#1A1A0A'], icon: '🎯', glow: '#FFD700' },
    INFJ: { colors: ['#1A2E1A', '#1B3D1B', '#228B22', '#0A1A0A'], icon: '🌙', glow: '#32CD32' },
    INFP: { colors: ['#2E1A2E', '#3D1B3D', '#DA70D6', '#1A0A1A'], icon: '🦋', glow: '#FF69B4' },
    ENFJ: { colors: ['#2E2E1A', '#3D1B1B', '#FF8C00', '#1A0A0A'], icon: '☀️', glow: '#FFA500' },
    ENFP: { colors: ['#2E1A2E', '#3D1B2D', '#FF69B4', '#1A0A1A'], icon: '🌈', glow: '#FF1493' },
    ISTJ: { colors: ['#1A1A2E', '#2D2D3D', '#708090', '#0A0A1A'], icon: '📋', glow: '#A9A9A9' },
    ISFJ: { colors: ['#1A2E1A', '#1B3D1B', '#8FBC8F', '#0A1A0A'], icon: '🛡️', glow: '#98FB98' },
    ESTJ: { colors: ['#2E1A1A', '#3D2D1B', '#B8860B', '#1A0A0A'], icon: '⚡', glow: '#DAA520' },
    ESFJ: { colors: ['#2E2E2E', '#3D1B1B', '#FF69B4', '#0A0A0A'], icon: '🤗', glow: '#FFB6C1' },
    ISTP: { colors: ['#1A1A1A', '#2D2D2D', '#696969', '#0A0A0A'], icon: '🔧', glow: '#808080' },
    ISFP: { colors: ['#1A2E1A', '#1B3D2D', '#66CDAA', '#0A1A0A'], icon: '🎨', glow: '#3CB371' },
    ESTP: { colors: ['#2E2E2E', '#3D1B1B', '#FF4500', '#0A0A0A'], icon: '🏃', glow: '#FF6347' },
    ESFP: { colors: ['#1A2E2E', '#2D1B3D', '#FF69B4', '#0A1A1A'], icon: '🎉', glow: '#FF1493' }
  },
  // 🌿 压力测试
  stress_test: {
    good:     { colors: ['#1A2E1A', '#1B3D1B', '#32CD32', '#0A1A0A'], icon: '🌞', glow: '#7CFC00' },
    mild:     { colors: ['#2E2E1A', '#3D3D1B', '#DAA520', '#1A1A0A'], icon: '⛅', glow: '#FFD700' },
    moderate: { colors: ['#2E1A2E', '#3D1B3D', '#9370DB', '#1A0A1A'], icon: '🌧️', glow: '#8A2BE2' },
    high:     { colors: ['#2E1A1A', '#3D1B1B', '#DC143C', '#1A0A0A'], icon: '⛈️', glow: '#FF4444' }
  }
};
