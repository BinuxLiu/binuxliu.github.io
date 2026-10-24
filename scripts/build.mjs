import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const { publications } = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const external = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
const outbound = (url, text, cls = '') => `<a class="${cls}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${text}${external}</a>`;
const scholar = 'https://scholar.google.com/citations?user=T2_7muEAAAAJ&hl=en';
const github = 'https://github.com/BinuxLiu';
const code = { NPR:'NPR', NocPlace:'NocPlace', SuperPlace:'SuperPlace', FeatSR:'FeatSR' };

const arm = `<svg class="project-art arm-art" viewBox="0 0 600 280" fill="none" aria-hidden="true">
 <defs><linearGradient id="arm-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#e4e7ed"/><stop offset="1" stop-color="#a9b2c2"/></linearGradient><linearGradient id="arm-blue"><stop stop-color="#76a7ed"/><stop offset="1" stop-color="#285e9f"/></linearGradient><filter id="arm-shadow"><feGaussianBlur stdDeviation="10"/></filter></defs>
 <ellipse cx="310" cy="245" rx="145" ry="13" fill="#c4cbd5" filter="url(#arm-shadow)"/>
 <g stroke="#d7dde6" stroke-width=".8"><path d="m95 242 205-94 205 94-205 44zM146 219l205 94m-103-141 205 94M146 265l205-94M197 288l205-94"/></g>
 <path d="M255 215v21l50 23 55-24v-22" fill="#b2bbc9"/><path d="m255 215 51-23 54 21-55 25z" fill="url(#arm-metal)" stroke="#c3cbd7"/>
 <path d="M293 212v-69l28-4 5 72" fill="url(#arm-metal)" stroke="#a6b2c5"/><circle cx="309" cy="146" r="22" fill="#ccd4e0" stroke="#9baac0"/><circle cx="309" cy="146" r="11" fill="url(#arm-blue)"/>
 <path d="m297 133 46-72 24 17-47 75z" fill="url(#arm-metal)" stroke="#a6b2c5"/><circle cx="355" cy="72" r="21" fill="#cbd5e3" stroke="#a6b2c5"/><circle cx="355" cy="72" r="10" fill="url(#arm-blue)"/>
 <path d="m348 52-105 38 9 27 111-28" fill="url(#arm-metal)" stroke="#a6b2c5"/><circle cx="249" cy="103" r="16" fill="#cdd7e5" stroke="#a6b2c5"/><circle cx="249" cy="103" r="7" fill="url(#arm-blue)"/>
 <path d="m236 108-21 24 13 11 22-25" fill="#aab9cc"/><path d="m219 134-18 7-6 18m30-22 4 16-14 14" stroke="#50637d" stroke-width="7" stroke-linecap="round"/>
 <path d="m197 184 18-9 19 9v24l-19 9-18-9z" fill="#b8ceee" stroke="#7e9fc9"/><path d="m197 184 18 10 19-10m-19 10v23" stroke="#7e9fc9"/>
 <path d="M192 146c-54-35-16-88 38-94" stroke="#5d8fcf" stroke-width="1.5" stroke-dasharray="4 6"/><circle cx="230" cy="52" r="4" fill="#5d8fcf"/>
</svg>`;
const scene = `<svg class="project-art scene-art" viewBox="0 0 600 280" fill="none" aria-hidden="true">
 <defs><radialGradient id="scene-glow"><stop stop-color="#5281bd" stop-opacity=".36"/><stop offset="1" stop-color="#5281bd" stop-opacity="0"/></radialGradient></defs>
 <ellipse cx="307" cy="152" rx="245" ry="150" fill="url(#scene-glow)"/>
 <g stroke="#7894b6" stroke-width=".9" opacity=".72"><path d="m112 218 194-94 187 94-188 62zM161 195l193 69m-146-92 192 77m-142-101 192 85M161 235l194-88M209 252l193-82M258 269l190-74"/><path d="M194 207V95l80-38 89 42v114m-169-118 88 43 81-39m-81 39v111M215 216v-72l43 21v69m51-35v-51l33-16v51"/><path d="m335 210 51-25v-48l44-21 46 20v88m-90-87 44 23 46-24m-46 24v83"/></g>
 <path d="M121 195c-21-90 117-140 250-112 98 20 147 83 92 138" stroke="#9fcaff" stroke-width="2" stroke-dasharray="3 7"/>
 <g transform="translate(135 152) rotate(-18)"><rect x="-17" y="-12" width="34" height="24" rx="5" fill="#b9d7ff"/><path d="m17-5 13-8v26L17 5" fill="#85b3ed"/><circle cx="-2" cy="0" r="6" fill="#243f63"/></g>
 <g fill="#c4ddff"><circle cx="194" cy="95" r="3"/><circle cx="274" cy="57" r="3"/><circle cx="363" cy="99" r="3"/><circle cx="282" cy="138" r="3"/><circle cx="430" cy="116" r="3"/><circle cx="121" cy="195" r="3"/><circle cx="463" cy="221" r="4"/></g>
</svg>`;

for (const lang of ['zh', 'en']) {
 const zh = lang === 'zh';
 const t = (a,b) => zh ? a : b;
 const title = t('刘秉熙 · 视觉感知与具身智能', 'Bingxi Liu · Vision & Embodied Intelligence');
 const description = t('刘秉熙，南方科技大学博士生。研究视觉定位、三维感知与具身智能，探索从场景理解到机器人行动的完整链路。', 'Bingxi Liu is a Ph.D. student at SUSTech researching visual localization, 3D perception, and embodied intelligence.');
 const education = [
  ['2022.09 — 2027.02',t('南方科技大学','SUSTech'),t('工学博士 · 智能制造与机器人','Ph.D. · Intelligent Manufacturing and Robotics'),t('预计 2027 年 2 月毕业 · 导师：张宏教授','Expected February 2027 · Advisor: Prof. Hong Zhang')],
  ['2019.09 — 2022.06',t('中国科学院大学','University of Chinese Academy of Sciences'),t('工程硕士 · 计算机科学与技术','M.Eng. · Computer Science and Technology'),t('自动化研究所 · 模式识别国家重点实验室<br>导师：吴毅红教授','Institute of Automation · National Laboratory of Pattern Recognition<br>Advisor: Prof. Yihong Wu')],
  [t('2019.06 毕业','Graduated 2019.06'),t('中国矿业大学','China University of Mining and Technology'),t('工学学士 · 电气工程及其自动化','B.Eng. · Electrical Engineering and Automation'),'']
 ];
 const experiences = [
  [t('2026.06 — 至今','2026.06 — Present'),t('众擎机器人','EngineAI'),t('具身算法工程师 · 实习','Embodied AI Algorithm Engineering Intern'),t('自我中心数据采集与标注、LeRobot 数据管线，以及面向具身智能的视觉基础模型。','Egocentric data collection and annotation, LeRobot data pipelines, and visual foundation models for embodied AI.')],
  ['2022.09 — 2026.05',t('鹏城实验室','Peng Cheng Laboratory'),t('研究助理 · 实习','Research Assistant Intern'),t('基于视觉基础模型的定位、Mamba 位姿估计与跟踪，以及多模态全球定位。','Foundation-model-based localization, Mamba-based pose estimation and tracking, and multimodal global localization.')],
  ['2021.04 — 2021.11',t('华为','Huawei'),t('3D 算法工程师 · 实习','3D Algorithm Engineering Intern'),t('RGB-D 三维重建、多深度传感器适配、CUDA 加速深度滤波与视觉定位。','RGB-D reconstruction, depth-sensor integration, CUDA-accelerated depth filtering, and visual localization.')]
 ];
 const timeline = rows => rows.map(([date,name,role,detail]) => `<li><span class="timeline-date">${date}</span><div><h4>${name}</h4><p class="timeline-role">${role}</p>${detail ? `<p class="timeline-detail">${detail}</p>` : ''}</div></li>`).join('');
 const papers = publications.map((p, i) => {
  const key = Object.keys(code).find(k => p.title.startsWith(k + ':'));
  const links = key ? outbound(`${github}/${code[key]}`, t('代码','Code')) : '';
  const preprint = key === 'NocPlace' ? outbound('https://arxiv.org/abs/2402.17159', t('预印本','Preprint')) : '';
  return `<article class="publication" data-status="${p.status}"><span class="pub-index">${String(i+1).padStart(2,'0')}</span><div class="pub-main"><div class="pub-meta"><span class="venue">${escape(p.venue)}${p.year ? ` ${escape(p.year)}` : ''}</span><span class="status ${p.status}">${escape(t(p.statusZh,p.statusEn))}</span>${p.highlightZh ? `<span class="award-badge">${escape(t(p.highlightZh,p.highlightEn))}</span>` : ''}</div><h3>${escape(p.title.replace(/\.$/,''))}</h3><div class="pub-bottom"><span>${escape(t(p.roleZh,p.roleEn))}</span><div class="pub-links">${links}${preprint}</div></div></div></article>`;
 }).join('\n');
 const awards = [
  ['2026','CVM Best Paper Award',t('MT-PCR · 第一作者 · Oral','MT-PCR · First author · Oral')],
  ['2025',t('智能语义 SLAM 挑战赛 · 一等奖','Intelligent Semantic SLAM Challenge · First Prize'),t('全国计算机辅助设计与图形学会议 · 第三作者','National CAD & Graphics Conference · Third author')],
  ['2024',t('Meta 视觉位置识别排行榜 · 第一','Meta Visual Place Recognition Leaderboard · 1st'),t('2024 年 7 月 · 单人参赛','July 2024 · Sole team member')],
  ['2024',t('中国科协青年人才托举计划','CAST Young Elite Scientists Sponsorship Program'),t('中国图象图形学会','China Society of Image and Graphics')],
  ['2023',t('机器人大模型与具身智能挑战赛 · 二等奖','Robotics Foundation Models & Embodied AI Challenge · Second Prize'),t('中国软件大会 · 项目唯一开发者','China Software Conference · Sole project developer')],
  ['2022',t('教育部–华为智能基座奖学金','Ministry of Education–Huawei Scholarship'),t('教育部–华为','Ministry of Education–Huawei')]
 ];
 const html = `<!DOCTYPE html>
<html lang="${zh?'zh-CN':'en'}">
<head>
 <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
 <meta name="description" content="${description}"><meta name="theme-color" content="#f5f5f7">
 <title>${title}</title><link rel="canonical" href="https://binuxliu.github.io/${lang}/">
 <link rel="alternate" hreflang="zh-CN" href="https://binuxliu.github.io/zh/"><link rel="alternate" hreflang="en" href="https://binuxliu.github.io/en/"><link rel="alternate" hreflang="x-default" href="https://binuxliu.github.io/">
 <meta property="og:type" content="profile"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="https://binuxliu.github.io/${lang}/"><meta property="og:image" content="https://binuxliu.github.io/assets/images/photo.jpg"><meta name="twitter:card" content="summary">
 <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/css/style.css">
 <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Person',name:'Bingxi Liu',alternateName:['刘秉熙','Binux Liu'],url:'https://binuxliu.github.io/',image:'https://binuxliu.github.io/assets/images/photo.jpg',jobTitle:'Ph.D. Student',affiliation:{'@type':'Organization',name:'Southern University of Science and Technology'},sameAs:[github,scholar]})}</script>
 <script src="../assets/js/main.js" defer></script>
</head>
<body>
 <a class="skip-link" href="#main">${t('跳转到主要内容','Skip to content')}</a>
 <header class="site-header"><nav class="nav container" aria-label="${t('主导航','Main navigation')}">
  <a class="brand" href="#top" aria-label="${t('刘秉熙，回到顶部','Bingxi Liu, back to top')}"><span class="brand-icon" aria-hidden="true">b.</span><span>Bingxi Liu<span class="brand-dot">.</span></span></a>
  <div id="nav-links" class="nav-links"><a href="#research">${t('研究','Research')}</a><a href="#projects">${t('项目','Projects')}</a><a href="#publications">${t('论文','Publications')}</a><a href="#journey">${t('经历','Journey')}</a></div>
  <div class="nav-actions"><a class="language-link" href="../${zh?'en':'zh'}/" lang="${zh?'en':'zh-CN'}" aria-label="${t('Switch to English','切换到中文')}">${zh?'EN':'中文'}<span aria-hidden="true"> ↗</span></a><a class="nav-contact" href="#contact">${t('联系我','Let’s talk')}${arrow}</a><button type="button" class="menu-toggle" data-menu-toggle aria-controls="nav-links" aria-expanded="false" aria-label="${t('切换导航菜单','Toggle navigation menu')}"><span></span><span></span></button></div>
 </nav></header>
 <main id="main">
  <section id="top" class="hero container" aria-labelledby="hero-title">
   <div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span>${t('刘秉熙 · 视觉与机器人研究','BINGXI LIU · VISION & ROBOTICS')}</div>
    <h1 id="hero-title">${t('看见世界。<br><span>理解空间。</span>','Seeing the world.<br><span>Understanding<br class="en-break"> space.</span>')}</h1>
    <p class="hero-description">${t('让视觉成为理解，让智能走向行动。','From visual understanding to intelligent action.')}<br>${t('南方科技大学博士生，探索视觉感知与具身智能。','Ph.D. student at SUSTech, exploring visual perception and embodied intelligence.')}</p>
    <div class="hero-actions"><a class="button button-primary" href="#publications">${t('探索我的研究','Explore my research')}${arrow}</a><a class="text-link" href="#about">${t('关于我','About me')}${arrow}</a></div>
    <div class="hero-affiliation"><span>SUSTech</span><i></i><span>${t('智能制造与机器人','Intelligent Manufacturing & Robotics')}</span></div>
   </div>
   <div class="hero-object"><div class="spatial-visual"><canvas id="spatial-canvas" aria-hidden="true"></canvas><div class="orb-fallback" aria-hidden="true"></div></div><div class="object-caption"><span class="object-cross" aria-hidden="true">+</span><span>PERCEPTION <span class="caption-arrow">→</span> SPATIAL INTELLIGENCE</span></div><button class="motion-toggle" type="button" data-motion-toggle data-pause="${t('暂停动效','Pause animation')}" data-play="${t('播放动效','Play animation')}" aria-label="${t('暂停动效','Pause animation')}" aria-pressed="false" data-reduced="${t('已启用减少动态效果','Reduced motion enabled')}"><span data-motion-label></span></button></div>
   <a class="scroll-hint" href="#research">${t('向下探索','SCROLL TO EXPLORE')}<span aria-hidden="true">↓</span></a>
  </section>
  <div class="highlights"><div class="container highlight-grid"><a href="#publications"><span class="mini-label">SELECTED PUBLICATION</span><strong>CVPR <span>2026</span></strong><small>${t('视觉重定位 · 共同第一作者','Visual relocalization · Co-first author')}${external}</small></a><a href="#publications"><span class="mini-label">RESEARCH RECOGNITION</span><strong>CVM <span>Best Paper</span></strong><small>${t('2026 · MT-PCR · 第一作者','2026 · MT-PCR · First author')}${external}</small></a><a href="#projects"><span class="mini-label">FROM RESEARCH TO REALITY</span><strong>${t('感知','Perception')} <span>→ ${t('行动','Action')}</span></strong><small>${t('视觉定位 · 三维感知 · 具身智能','Localization · 3D vision · Embodied AI')}${external}</small></a></div></div>
  <section id="research" class="section container" aria-labelledby="research-title">
   <div class="section-heading" data-reveal><div><span class="eyebrow">01 / RESEARCH</span><h2 id="research-title">${t('从看见，到行动。','From seeing to doing.')}</h2></div><p>${t('连接视觉、空间与机器人，<br>探索真实世界中的智能。','Connecting vision, space, and robotics<br>to explore intelligence in the real world.')}</p></div>
   <div class="research-grid">
    <article class="research-card" data-reveal><span class="research-number">01</span><svg class="research-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="28"/><circle cx="40" cy="40" r="15"/><circle cx="40" cy="40" r="3" fill="currentColor"/><path d="M40 6v14m0 40v14M6 40h14m40 0h14"/></svg><h3>${t('视觉定位','Visual localization')}</h3><p>${t('跨越昼夜、视角与场景变化，让机器人知道自己身在何处。','Helping robots know where they are, across changes in illumination, viewpoint, and environment.')}</p><div class="card-topics">VPR <span>·</span> Geo-localization <span>·</span> SLAM</div></article>
    <article class="research-card" data-reveal><span class="research-number">02</span><svg class="research-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="m40 9 27 15v32L40 71 13 56V24zM13 24l27 16 27-16M40 40v31M27 16l27 16v31M13 40l27 16 27-16"/></svg><h3>${t('三维感知','3D perception')}</h3><p>${t('从点云配准到场景重建，为空间理解建立几何基础。','Building geometric foundations for spatial understanding, from point cloud registration to scene reconstruction.')}</p><div class="card-topics">Point Clouds <span>·</span> 3DGS <span>·</span> RGB-D</div></article>
    <article class="research-card" data-reveal><span class="research-number">03</span><svg class="research-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="18" y="24" width="44" height="36" rx="13"/><path d="M40 13v11M10 38v11m60-11v11M30 68v-8m20 8v-8M30 48q10 8 20 0"/><circle cx="30" cy="38" r="2" fill="currentColor"/><circle cx="50" cy="38" r="2" fill="currentColor"/><circle cx="40" cy="10" r="3"/></svg><h3>${t('具身智能','Embodied intelligence')}</h3><p>${t('连接视觉、语言与动作，将模型能力带入可交互的物理世界。','Connecting vision, language, and action to bring learned capabilities into the physical world.')}</p><div class="card-topics">VLA <span>·</span> LeRobot <span>·</span> Foundation Models</div></article>
   </div>
   <div id="about" class="about-strip" data-reveal><div class="about-person"><img src="../assets/images/photo.jpg" alt="${t('刘秉熙的照片','Portrait of Bingxi Liu')}" width="80" height="96" loading="lazy"><div><strong>${t('刘秉熙','Bingxi Liu')}</strong><span>${t('博士生 · 深圳','Ph.D. student · Shenzhen')}</span></div></div><p>${t('我在南方科技大学攻读智能制造与机器人方向博士，师从张宏教授。此前于中国科学院大学获得硕士学位，师从吴毅红教授。目前在众擎机器人参与具身智能研发，关注如何把视觉研究转化为可靠的机器人系统。','I am a Ph.D. student at SUSTech advised by Prof. Hong Zhang. I received my master’s degree from UCAS under Prof. Yihong Wu. Currently an embodied AI intern at EngineAI, I work on turning visual research into reliable robotic systems.')}</p></div>
  </section>
  <section id="projects" class="section projects-section" aria-labelledby="projects-title"><div class="container">
   <div class="section-heading" data-reveal><div><span class="eyebrow">02 / SELECTED PROJECTS</span><h2 id="projects-title">${t('让想法，走进现实。','Ideas, made tangible.')}</h2></div><p>${t('从算法设计到系统实现，<br>把研究连上真实场景。','From algorithms to working systems,<br>grounded in real scenarios.')}</p></div>
   <div class="projects-grid">
    <article class="project-card project-robot" data-reveal><div class="project-header"><span class="mini-label">ROBOT LEARNING</span><span class="project-date">2026.08 — 09</span></div>${arm}<div class="project-copy"><span class="project-partner">Seeed Studio</span><h3>${t('从示教，到自主操作。','From demonstration<br>to manipulation.')}</h3><p>${t('基于 LeRobot 与 SO-ARM101，搭建从主从遥操作、多模态数据采集到 ACT 策略训练及真机评估的完整管线。','An end-to-end LeRobot and SO-ARM101 pipeline: leader–follower teleoperation, multimodal data collection, ACT training, and real-robot evaluation.')}</p><div class="project-tags"><span>LeRobot</span><span>ACT</span><span>SO-ARM101</span></div><details><summary>${t('查看项目细节','Project details')}<span>+</span></summary><p>${t('完成舵机 ID、波特率及全臂零位校准，接入 Orbbec 相机采集 manipulation episode 数据；训练、回放并评估 ACT 策略，同时探索 SmolVLA、Pi0 与 GR00T 部署。','Calibrated servos and arm zero positions, integrated an Orbbec camera for manipulation episodes, and trained and evaluated ACT policies. Also explored deployment options for SmolVLA, Pi0, and GR00T.')}</p></details></div></article>
    <article class="project-card project-scene" data-reveal><div class="project-header"><span class="mini-label">SPATIAL INTELLIGENCE</span><span class="project-date">2026.02 — 04</span></div>${scene}<div class="project-copy"><span class="project-partner">${t('赛尔智控 · 深圳','赛尔智控 · Shenzhen')}</span><h3>${t('用语言，导演三维世界。','Direct a 3D world.<br>With language.')}</h3><p>${t('融合 VLM 场景理解、SAM2 实例定位与 3D Gaussian Splatting，以自然语言驱动分镜规划和电影级相机轨迹生成。','Combining VLM scene understanding, SAM2 instance localization, and 3D Gaussian Splatting for language-driven storyboards and cinematic camera paths.')}</p><div class="project-tags"><span>3DGS</span><span>VLM</span><span>SAM2</span></div><details><summary>${t('查看技术路径','Technical approach')}<span>+</span></summary><p>${t('多视角语义理解与深度反投影定位场景实体；由语言模型规划符合构图规则的分镜，再通过轨迹平滑与场景约束减少穿墙和渲染伪影。','Multi-view semantics and depth back-projection locate scene entities. A language model plans composed shots; trajectory smoothing and scene constraints reduce collisions and rendering artifacts.')}</p></details></div></article>
   </div>
   <article class="edge-project" data-reveal><span class="edge-icon" aria-hidden="true">⌘</span><div><span class="mini-label">EDGE ↔ CLOUD · 2024.04 — 2026.03</span><h3>${t('无人系统的端云协同感知','Edge–cloud perception for unmanned systems')}</h3><p>${t('鹏城实验室 / 中国联通 · 连接 Jetson 端侧视觉模型与云侧多模态大模型，实现开放世界目标检测与跟踪。','Peng Cheng Laboratory / China Unicom · Connecting Jetson edge vision models with cloud multimodal models for open-world detection and tracking.')}</p></div><span class="edge-tools">EfficientViT<br>Qwen3 · Jetson</span></article>
   <p class="visual-note">${t('项目配图为技术概念示意。','Project illustrations are conceptual diagrams.')}</p>
  </div></section>
  <section id="publications" class="section container" aria-labelledby="publications-title">
   <div class="section-heading" data-reveal><div><span class="eyebrow">03 / PUBLICATIONS</span><h2 id="publications-title">${t('研究，持续向前。','Research in progress.')}</h2></div>${outbound(scholar, 'Google Scholar', 'text-link')}</div>
   <div class="publication-toolbar"><div class="filter-group" role="group" aria-label="${t('筛选论文','Filter publications')}"><button type="button" data-filter="all" aria-pressed="true">${t('全部','All work')}</button><button type="button" data-filter="published" aria-pressed="false">${t('已发表','Published')}</button><button type="button" data-filter="review" aria-pressed="false">${t('在审 / 投稿','Under review / Submitted')}</button></div><span id="publication-count" data-count-template="${t('{count} 项研究','{count} works')}" aria-live="polite">${t('22 项研究','22 works')}</span></div>
   <p class="publication-note">${t('按简历记录列示；在审与投稿条目不代表已接收。','Listed as recorded in my CV. Review and submission venues do not imply acceptance.')}</p>
   <div class="publication-list">${papers}</div>
   <div class="open-source"><span class="mini-label">OPEN SOURCE</span><div>${['NPR','NocPlace','SuperPlace','FeatSR','CA-Place','Deep-VLCD-Benchmark'].map(name=>outbound(`${github}/${name}`,name)).join('')}</div></div>
  </section>
  <section id="journey" class="section journey-section" aria-labelledby="journey-title"><div class="container">
   <div class="section-heading" data-reveal><div><span class="eyebrow">04 / THE JOURNEY</span><h2 id="journey-title">${t('积累，连接，探索。','Learning. Building. Exploring.')}</h2></div><p>${t('在学术与产业之间，<br>不断拓展研究的边界。','Growing through research<br>and hands-on engineering.')}</p></div>
   <div class="journey-grid"><div data-reveal><h3 class="timeline-heading">${t('教育背景','Education')}<span>01</span></h3><ol class="timeline">${timeline(education)}</ol></div><div data-reveal><h3 class="timeline-heading">${t('研究与实习','Research & experience')}<span>02</span></h3><ol class="timeline">${timeline(experiences)}</ol></div></div>
  </div></section>
  <section class="section container awards-section" aria-labelledby="awards-title"><div class="section-heading" data-reveal><div><span class="eyebrow">05 / RECOGNITION</span><h2 id="awards-title">${t('探索路上的回响。','Milestones along the way.')}</h2></div></div><div class="awards-list">${awards.map(([year,name,detail])=>`<article class="award-row" data-reveal><span>${year}</span><div><h3>${name}</h3><p>${detail}</p></div><span class="award-mark" aria-hidden="true">↗</span></article>`).join('')}</div></section>
  <section id="contact" class="contact-section" aria-labelledby="contact-title"><div class="container"><span class="eyebrow">LET’S CONNECT</span><h2 id="contact-title">${t('下一个想法，<br><span>一起探索。</span>','The next idea.<br><span>Let’s explore it together.</span>')}</h2><p>${t('欢迎交流视觉定位、三维感知与具身智能。','Let’s talk about visual localization, 3D perception, and embodied intelligence.')}</p><div class="contact-actions"><a class="button button-primary" href="mailto:binuxliu@gmail.com">binuxliu@gmail.com${arrow}</a><button class="copy-email" type="button" data-copy-email="binuxliu@gmail.com" data-copied="${t('已复制邮箱','Email copied')}" data-failed="${t('请使用邮箱链接','Use the email link')}" aria-label="${t('复制邮箱地址','Copy email address')}">${t('复制邮箱','Copy email')}</button></div><div class="contact-social">${outbound(github,'GitHub')}${outbound(scholar,'Google Scholar')}</div></div></section>
 </main>
 <footer class="site-footer container"><a class="footer-brand" href="#top">Bingxi Liu<span>.</span></a><span>© 2026 ${t('刘秉熙','Bingxi Liu')} · Shenzhen</span><a href="#top">${t('回到顶部','Back to top')} ↑</a></footer>
</body></html>`;
 await mkdir(path.join(root,lang),{recursive:true});
 await writeFile(path.join(root,lang,'index.html'),html);
}
console.log('Built Chinese and English pages from data/profile.json.');
