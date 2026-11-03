export type Skill = { code: string; label: string; labelRu: string; items: { name: string; note: string }[] };
export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  role: string;
  summary: string;
  detail: string[];
  link: string;
  accent: "red" | "ink" | "ochre";
};
export type Honor = { id: string; year: string; title: string; org: string; level: string; kind: string };
export type School = { id: string; period: string; school: string; degree: string; major: string; status: string; note: string };

export const profile = {
  name: "COOKIE",
  nameRu: "КУКИ",
  handle: "@binggan23",
  fileNo: "023",
  tagline: "全栈工程 / Agent 工程 / 系统运维",
  taglineRu: "ИНЖЕНЕР ПОЛНОГО ЦИКЛА",
  manifesto:
    "我把模糊的需求编译成确定性的系统：理解交给 Agent，门禁交给 CLI，拍板留给人。其余时间，我在 Linux 里打磨机器，用 Docker 把它们推上生产。",
  manifestoShort: "用代码建造机器，用纪律驯服它。",
  status: "OPEN FOR WORK",
  location: "CN · 山东 · 泰安",
  coordinates: "36.20°N / 117.09°E",
  timezone: "UTC+8",
  email: "1764586591@qq.com",
  links: {
    github: "https://github.com/binggan23",
    bilibili: "https://space.bilibili.com/453547515",
    bilibiliHandle: "space.bilibili.com/453547515",
    qq: "1764586591@qq.com",
    dshBrowser: "https://github.com/omdsh-dev/dsh-browser",
  },
  stats: [
    { value: 8, suffix: "", label: "奖项 / 认证", labelRu: "НАГРАДЫ" },
    { value: 6, suffix: "", label: "开源项目", labelRu: "ПРОЕКТЫ" },
    { value: 3, suffix: "+", label: "主干语言", labelRu: "ЯЗЫКИ" },
    { value: 2, suffix: "", label: "在读学历", labelRu: "ОБРАЗОВАНИЕ" },
  ],
  roles: ["FULL-STACK", "AGENT ENGINEER", "SYSADMIN", "OPEN SOURCE"],
  sections: ["00 ПРОЛОГ", "01 ДОСЬЕ", "02 АРСЕНАЛ", "03 АРХИВ", "04 ЗАСЛУГИ", "05 ПУТЬ", "06 КОНТАКТ"],
};

export const skills: Skill[] = [
  {
    code: "Я-01",
    label: "语言",
    labelRu: "ЯЗЫКИ",
    items: [
      { name: "C++", note: "系统底层 · 性能 · 内存模型" },
      { name: "Python", note: "Agent 工具链 · 数据 · 自动化" },
      { name: "Java", note: "后端服务 · 工程化" },
      { name: "TypeScript", note: "全栈交付 · 界面与扩展" },
    ],
  },
  {
    code: "А-02",
    label: "Agent 工程",
    labelRu: "АГЕНТЫ",
    items: [
      { name: "Agentic", note: "任务编排 · 工具调用 · 自主执行" },
      { name: "Loop", note: "闭环控制 · 状态收敛 · 失败重入" },
      { name: "MCP", note: "Model Context Protocol · 能力注入" },
      { name: "Harness", note: "DeepSeek Harness · 运行时与插件" },
      { name: "Skills", note: "可复用技能包 · 人机共驾" },
    ],
  },
  {
    code: "С-03",
    label: "系统",
    labelRu: "СИСТЕМЫ",
    items: [
      { name: "Linux", note: "日常主力系统 · Shell · 服务编排" },
      { name: "Shell", note: "脚本化 · 批量运维" },
      { name: "Git", note: "分支治理 · 开源协作" },
    ],
  },
  {
    code: "О-04",
    label: "运维",
    labelRu: "ЭКСПЛУАТАЦИЯ",
    items: [
      { name: "Docker", note: "镜像构建 · Compose 编排" },
      { name: "1Panel", note: "服务器面板 · 应用托管" },
      { name: "宝塔", note: "站点部署 · 证书 · 备份" },
      { name: "CI / CD", note: "GitHub Actions · 自动发布" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "dsh-browser",
    index: "01",
    title: "DSH BROWSER",
    subtitle: "Chrome 侧边栏 · 让 Agent 直接操控浏览器",
    year: "2026.06 — 至今",
    tags: ["TypeScript", "Chrome Extension", "DeepSeek Harness"],
    role: "部署 / 代码贡献",
    summary: "一款 Chrome 侧边栏扩展程序，可让 DeepSeek Harness 直接操控您的浏览器，无需视觉能力。",
    detail: [
      "把浏览器变成 Agent 的确定性工具层：DOM 即接口，动作即协议。",
      "参与部署链路与运行环境适配，保证扩展在真实机器上开箱可用。",
      "视觉模型不是必需品——能读懂结构，就不必猜像素。",
    ],
    link: "https://github.com/omdsh-dev/dsh-browser",
    accent: "red",
  },
  {
    id: "mimo-tts-studio",
    index: "02",
    title: "MIMO TTS STUDIO",
    subtitle: "AI 语音合成工作室 · 3 模型 / 13 预设",
    year: "2026.03 — 2026.05",
    tags: ["TypeScript", "Next.js", "MiMo-V2.5-TTS"],
    role: "全栈",
    summary: "由小米 MiMo-V2.5-TTS 驱动的 AI 语音合成工作室——3 种模型，13 种预设设置，能够进行语音设计和克隆。",
    detail: [
      "统一多家模型参数的抽象层，让切换模型不改变工作流。",
      "13 组预设覆盖旁白、对话、情绪与克隆场景。",
      "从提示词到音频产物的完整闭环，包含试听、导出与版本对比。",
    ],
    link: "https://github.com/binggan23/mimo-tts-studio",
    accent: "ink",
  },
  {
    id: "neo-skill",
    index: "03",
    title: "NEO-SKILL",
    subtitle: "把人机共驾研发流程编译成确定性状态机",
    year: "2026 — 至今",
    tags: ["Python", "CLI", "State Machine", "Zero Dependency"],
    role: "全栈",
    summary: "一个把人机共驾研发流程编译成确定性状态机、零依赖的开源闭环：Skill 负责理解与起草，CLI 负责编号、门禁、锁与审计，人只拍板排期、PRD 和验收。",
    detail: [
      "Skill 负责理解与起草；CLI 负责编号、门禁、锁与审计。",
      "人只做三件事：拍板排期、PRD、验收。",
      "零依赖、可审计、可回放——流程本身成为可执行文件。",
    ],
    link: "https://github.com/binggan23/neo-skill",
    accent: "ochre",
  },
  {
    id: "dsh-market",
    index: "04",
    title: "DSH MARKET",
    subtitle: "DeepSeek Harness 内的插件市场",
    year: "2026",
    tags: ["TypeScript", "Plugin Registry", "UI"],
    role: "全栈",
    summary: "The plugin market inside DeepSeek Harness — browse, search, one-click install · DSH 可视化插件市场。",
    detail: [
      "浏览、搜索、一键安装：把插件生态做成可逛的目录。",
      "为 Harness 生态提供统一的分发入口。",
    ],
    link: "https://github.com/binggan23/dsh-market",
    accent: "ink",
  },
  {
    id: "boss-skills",
    index: "05",
    title: "BOSS SKILLS",
    subtitle: "把你的老板蒸馏成 skills",
    year: "2026",
    tags: ["Python", "Skills", "Prompt Engineering"],
    role: "作者",
    summary: "把你的老板蒸馏成 skills。Distilling your boss into skills.（同事 skill）",
    detail: [
      "把组织里最难对齐的部分——决策偏好——变成可复用的技能包。",
      "让 Agent 学会像你的老板一样提问、砍需求、要数据。",
    ],
    link: "https://github.com/binggan23/boss-skills",
    accent: "red",
  },
  {
    id: "diagram-tools",
    index: "06",
    title: "DIAGRAM TOOLS",
    subtitle: "在线图表绘制工具集",
    year: "2025",
    tags: ["Vue 3", "Mermaid", "ER / UML"],
    role: "作者",
    summary: "基于 Vue 3 的开源在线图表绘制工具集，支持 SQL 转 ER 图、三线表生成、UML 用例图、系统模块图、流程图及 Mermaid 图表的编辑与导出。",
    detail: [
      "SQL 转 ER、三线表、UML、模块图、流程图一站完成。",
      "为论文写作与软件开发场景优化导出格式。",
    ],
    link: "https://github.com/binggan23/diagram-tools",
    accent: "ochre",
  },
];

export const honors: Honor[] = [
  { id: "h1", year: "17TH", title: "蓝桥杯 全国软件和信息技术专业人才大赛", org: "工业和信息化部人才交流中心", level: "国赛 · 三等奖", kind: "COMPETITION" },
  { id: "h2", year: "2026", title: "马蹄杯", org: "马蹄杯组委会", level: "银奖", kind: "COMPETITION" },
  { id: "h3", year: "2026", title: "阿里 ApsaraClouder 技能专项认证", org: "Alibaba Cloud", level: "专项认证", kind: "CERTIFICATION" },
  { id: "h4", year: "2026", title: "华为云 Autotuner 自动调优认证", org: "Huawei Cloud", level: "认证", kind: "CERTIFICATION" },
  { id: "h5", year: "2026", title: "山东省技能大赛 · 人工智能赛项", org: "山东省人力资源和社会保障厅", level: "银奖", kind: "COMPETITION" },
  { id: "h6", year: "2026", title: "山东省「技能兴鲁」职业技能大赛", org: "山东省", level: "学生组 · 一等奖", kind: "COMPETITION" },
  { id: "h7", year: "2025", title: "泰安市技能大赛 · 电子商务", org: "泰安市", level: "二等奖", kind: "COMPETITION" },
  { id: "h8", year: "2025", title: "大学生创业就业协会 · 就业实践部", org: "山东工程职业技术大学", level: "副部长", kind: "LEADERSHIP" },
];

export const schools: School[] = [
  {
    id: "s1",
    period: "2025 — 2029",
    school: "山东工程职业技术大学",
    degree: "本科",
    major: "大数据工程技术",
    status: "在读",
    note: "数据工程、分布式系统与工程化实践的主战场。",
  },
  {
    id: "s2",
    period: "2025 — 2029",
    school: "泰安市科技中等专业学校",
    degree: "中专 / 中技",
    major: "计算机及应用",
    status: "在读",
    note: "从计算机及应用出发，把兴趣变成可以被验收的技能。",
  },
];

export const navItems = [
  { id: "hero", index: "00", label: "序", labelRu: "ПРОЛОГ" },
  { id: "dossier", index: "01", label: "档案", labelRu: "ДОСЬЕ" },
  { id: "arsenal", index: "02", label: "能力", labelRu: "АРСЕНАЛ" },
  { id: "archive", index: "03", label: "项目", labelRu: "АРХИВ" },
  { id: "honors", index: "04", label: "荣誉", labelRu: "ЗАСЛУГИ" },
  { id: "path", index: "05", label: "学历", labelRu: "ПУТЬ" },
  { id: "contact", index: "06", label: "联系", labelRu: "КОНТАКТ" },
];

export const marqueeWords = [
  "AGENTIC", "LOOP", "MCP", "HARNESS", "SKILLS", "C++", "PYTHON", "JAVA", "LINUX", "DOCKER", "1PANEL", "宝塔", "OPEN SOURCE",
];

export const marqueeWordsRu = ["ТРУД", "ДИСЦИПЛИНА", "МАШИНА", "СИСТЕМА", "РАЗУМ", "ПОРЯДОК", "ИНЖЕНЕР", "БУДУЩЕЕ"];
