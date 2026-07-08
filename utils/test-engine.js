/**
 * test-engine.js — 测试引擎核心
 * 支持多套测试配置、计分、模板结果获取
 */
class TestEngine {
  constructor(testConfig) {
    this.config = testConfig;
    this.answers = {};
  }

  addAnswer(questionId, optionIdx) {
    this.answers[questionId] = optionIdx;
  }

  /** 计算分数并返回类型编码 */
  calculate() {
    const scores = {};
    this.config.questions.forEach(q => {
      const ans = this.answers[q.id];
      if (ans === undefined || ans === null) return;
      const opt = q.options[ans];
      if (opt && opt.score) {
        Object.keys(opt.score).forEach(k => {
          scores[k] = (scores[k] || 0) + opt.score[k];
        });
      }
    });
    this._scores = scores;
    return this.config.scoring.getType ? this.config.scoring.getType(scores) : 'default';
  }

  /** 获取最近一次计算的分数字典 */
  getScores() {
    return this._scores || {};
  }

  /** 获取模板结果 */
  getTemplateResult(typeCode) {
    const cfg = this.config.results[typeCode];
    if (!cfg) return this.config.results.default || { title: '未知', summary: '', brief: '' };
    return cfg;
  }

  /** 深度分析 — 基于配置数据本地生成 */
  getInsightAnalysis(typeCode, qaArr) {
    const cfg = this.config.results[typeCode] || this.config.results['default'] || {};
    const testName = this.config.name || '未知测试';
    const typeTitle = cfg.title || '未知类型';
    const strengths = cfg.strengths || '';
    const weaknesses = cfg.weaknesses || '';
    const brief = cfg.brief || '';
    const tagline = cfg.tagline || '';

    // 基于题目回答生成个性化分析
    let answerInsight = '';
    if (qaArr && qaArr.length > 0) {
      const total = qaArr.length;
      const firstQ = qaArr[0];
      if (firstQ && firstQ.question) {
        answerInsight = `在"${firstQ.question.substring(0, 20)}..."这一题中，你的选择反映出你是一个${firstQ.optionText || '有主见'}的人。`;
      }
    }

    const parts = [];
    parts.push(`🔮 【${testName}】深度解读`);
    parts.push('');
    parts.push(`你测出的结果是：「${typeTitle}」`);
    if (brief) parts.push(`\n${typeof brief === 'string' ? brief : (Array.isArray(brief) ? brief[0] : '')}`);
    parts.push('');
    if (strengths) parts.push(`✨ 你的优势：${typeof strengths === 'string' ? strengths : (Array.isArray(strengths) ? strengths.slice(0, 2).join(' / ') : '')}`);
    if (weaknesses) parts.push(`🌱 成长空间：${typeof weaknesses === 'string' ? weaknesses : (Array.isArray(weaknesses) ? weaknesses.slice(0, 2).join(' / ') : '')}`);
    if (answerInsight) parts.push(`\n${answerInsight}`);
    if (tagline) {
      const tl = typeof tagline === 'string' ? tagline : (Array.isArray(tagline) ? tagline[0] : '');
      if (tl) parts.push(`\n💬 "${tl}"`);
    }
    parts.push('\n—— 基于茅山趣测数据引擎生成，仅供参考娱乐 ✨');

    return parts.join('\n');
  }

  reset() {
    this.answers = {};
  }
}

module.exports = TestEngine;
