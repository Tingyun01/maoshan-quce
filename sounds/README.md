# 🎵 茅山趣测 · 音源下载指南

## 一句话说明

BGM 需要的是**真实 MP3 文件**（不是代码合成），来源必须是**CC0 免费可商用**（不能盗用有版权的音乐）。

---

## 📋 我们需要多少首？

建议分三档，最少 3 首，理想 8 首：

| 场景 | 最少 | 推荐 | 曲风 |
|------|------|------|------|
| 测试答题过程 | 1 首 | 3 首 | 仙侠/古风/冥思（古筝古琴+电子pad） |
| 首页/结果页 | 1 首 | 2 首 | 轻量平和中国风（音量更低、不压人声） |
| 特殊场景（图鉴/导览）| 0 首 | 2 首 | 偏庄重/有仪式感 |
| UI 点击音效 | 0 个 | 5 个 | 水滴、风铃、法器、钟磬（短音效 1-3 秒） |

---

## 🌐 下载网站（按推荐优先级）

### 🥇 **Pixabay**（最省心，无需注册）

网站：https://pixabay.com/music/

**优势**：CC0、无需注册、无需署名、直接下载 MP3
**缺点**：国外网站速度可能慢，有时打不开

**搜索关键词（直接复制粘贴进搜索框）**：

```
# 曲风场景
chinese meditation			← 最多优质结果，首选
traditional chinese			← 偏传统器乐
chinese guqin				← 古琴琵琶
peaceful chinese			← 平和安静
guzheng					← 古筝
ancient chinese				← 古风韵味
eastern ambient				← 东方氛围
taoist zen					← 道家禅意
fantasy asian				← 仙侠幻想风
medieval asian				← 古代宫廷感
```

### 🥈 **爱给网 aigei.com**（国内，中文搜索）

网站：https://www.aigei.com/

**进入后**：点「配乐」→ 左侧勾选「CC0 可商用」→ 搜索

**优势**：国内速度快，中文搜索好
**缺点**：CC0 曲目不多，需仔细筛选协议

**搜索关键词**：
```
古筝 古风
古琴 冥想
道家 中国风
仙侠 背景音乐
江南 诗意 古筝
太极 音乐
禅意 轻音乐
```

### 🥉 **Chosic**（CC0 免费）

网站：https://www.chosic.com/free-music/chinese/

**优势**：专门的中国器乐分类，18 首
**缺点**：曲目固定不更新

### 4️⃣ **Free-stock-music**

网站：https://www.free-stock-music.com/  → 左侧点 World Music → Chinese

**优势**：明确标注 Attribution not required，即署名都不需要

### 5️⃣ **SoundDino**

网站：https://sounddino.com/en/effects/chinese-music/

**优势**：风格明确，直链下载

### 6️⃣ **FesliyanStudios**

网站：https://www.fesliyanstudios.com/royalty-free-music/downloads-c/chinese-music/61

**优势**：专门的中国风集合，质量不错

### 7️⃣ **FreePD（中文镜像）**

网站：https://freepd.cn/music → 右侧点「World」分类

**优势**：公共领域完全免费，中文界面

---

## 🎯 按曲风推荐搜索

### 测试答题用（需要沉浸感/"仙袂飘飘"的感觉）

| 曲风 | 英文搜索 | 中文搜索 |
|------|----------|----------|
| 古筝+冥想电子 | chinese meditation ambient | 古筝 冥想 |
| 仙侠幻想 | fantasy asian music | 仙侠 背景音乐 |
| 古琴琵琶漫步 | guqin pipa peaceful | 古琴 琵琶 |
| 道家禅意 | taoist zen | 道家 禅意 |
| 笛箫+背景pad | dizi bamboo flute ambient | 笛子 箫 |

### 首页用（轻量不打扰）

| 曲风 | 英文搜索 | 中文搜索 |
|------|----------|----------|
| 平和中国风 | peaceful chinese | 古风 轻音乐 |
| 江南水乡 | calm oriental | 江南 诗意 |
| 太极晨练 | tai chi music | 太极 音乐 |

### UI 点击音效（短音效 1-3 秒，单独搜）

用 Web Audio API 合成的已经够好，不需要专门下载。但如果你想要**真实录音的点击音效**，搜这些：

| 音效类型 | 搜索词 |
|----------|--------|
| 水滴 | water drop sound effect |
| 风铃 | wind chime sound effect |
| 法器敲击 | temple bell sound effect |
| 钟磬 | chime bowl sound effect |
| 笔墨落纸 | brush stroke paper effect |

推荐在 https://pixabay.com/sound-effects/ 上搜（Pixabay 有专门音效区）

---

## ☁️ 云存储方案

你下载的曲子多了（>5 首），直接放小程序包里会超 2MB 限制。方案：

### 方案A：微信云开发存储（推荐）

1. 打开微信开发者工具 → 云开发控制台 → 存储
2. 新建文件夹 `sounds/`
3. 上传所有 MP3 文件
4. 复制每个文件的 `fileID`（格式：`cloud://xxx.xxx/sounds/bgm_main.mp3`）
5. 我会改 `bgm-manager.js` 支持 cloud:// 路径自动播放

### 方案B：本地包内（≤5首）

直接放项目 `sounds/` 目录，路径是 `/sounds/xxx.mp3`。

### 方案C：混合（推荐）

- 本地放 2 首默认的（`bgm_main.mp3` + `bgm_calm.mp3`，保底）
- 云存储放 6-8 首扩展曲目
- 小程序启动时从云存储下载到本地缓存

---

## 📁 建议的命名规范

下载后统一重命名，方便管理：

```
bgm_quiz_01.mp3     测试答题-仙侠风
bgm_quiz_02.mp3     测试答题-古琴冥想
bgm_quiz_03.mp3     测试答题-道家禅意
bgm_home_01.mp3     首页-平和中国风
bgm_home_02.mp3     首页-江南轻音乐
bgm_album_01.mp3    图鉴-庄重仪式
bgm_guide_01.mp3    导览-神秘氛围

sfx_click.mp3       选项点击音效
sfx_result.mp3      结果揭晓音效
sfx_unlock.mp3      解锁图鉴音效
```

---

## ⚠️ 避坑指南

1. **Pixabay 下载不了？** 换浏览器、挂代理、或直接用爱给网/Chosic
2. **爱给网注意协议！** 一定要勾选「CC0」或「CCE0」标签，CC-BY 需要署名也可用但麻烦
3. **不要用熊猫办公/千库网的**——那些是付费素材站，所谓免费只是个人非商用
4. **文件大小**：每首控制在 500KB-1MB（128kbps 码率）
5. **时长**：30-90 秒即可，设了 `loop=true` 会自动循环
6. **格式**：必须是 MP3 格式，小程序 InnerAudioContext 对 MP3 支持最好
