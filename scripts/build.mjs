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
 const awards = [
  ['2026','CVM Best Paper Award',t('MT-PCR · 共同第一作者 · Oral','MT-PCR · Co-first author · Oral')],
  ['2025',t('智能语义 SLAM 挑战赛 · 一等奖','Intelligent Semantic SLAM Challenge · First Prize'),t('全国计算机辅助设计与图形学会议 · 第三作者','National CAD & Graphics Conference · Third author')],
  ['2024',t('Meta 视觉位置识别排行榜 · 第一','Meta Visual Place Recognition Leaderboard · 1st'),t('2024 年 7 月 · 单人参赛','July 2024 · Sole team member')],
  ['2024',t('中国科协青年人才托举计划','CAST Young Elite Scientists Sponsorship Program'),t('中国图象图形学会','China Society of Image and Graphics')],
  ['2023',t('机器人大模型与具身智能挑战赛 · 二等奖','Robotics Foundation Models & Embodied AI Challenge · Second Prize'),t('中国软件大会 · 项目唯一开发者','China Software Conference · Sole project developer')],
  ['2022',t('教育部–华为智能基座奖学金','Ministry of Education–Huawei Scholarship'),t('教育部–华为','Ministry of Education–Huawei')]
 ];
 const papers = [...publications].sort((a,b) => Number(!!b.selected)-Number(!!a.selected)).map((p,i) => {
  const authors = p.authors?.map(name => name.startsWith('Bingxi Liu') ? `<strong>${escape(name)}</strong>` : escape(name)).join(', ');
  const links = (p.resources || []).map(r=>outbound(r.url,escape(r.label))).join('');
  const image = p.image ? `<a class="pub-image" href="${escape(p.resources[0].url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(p.title)}"><img src="../${escape(p.image)}" alt="${escape(t(p.imageAltZh,p.imageAltEn))}" loading="lazy" width="440" height="290"></a>` : `<div class="pub-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</div>`;
  return `<article class="publication" data-status="${p.status}" data-selected="${Boolean(p.selected)}">${image}<div class="pub-main"><div class="pub-meta"><span class="venue">${escape(p.venue)}${p.year ? ` ${escape(p.year)}` : ''}</span>${p.status!=='published' ? `<span class="status review">${escape(t(p.statusZh,p.statusEn))}</span>` : ''}</div><h3>${escape(p.title.replace(/\.$/,''))}</h3>${authors ? `<p class="pub-authors">${authors}</p>` : ''}<p class="pub-role">${escape(t(p.roleZh,p.roleEn))}${p.highlightZh ? `<span class="award-badge">${escape(t(p.highlightZh,p.highlightEn))}</span>` : ''}</p>${links ? `<div class="pub-links">${links}</div>` : ''}</div></article>`;
 }).join('\n');
 const news = [
  ['2026.09',t('完成基于 <strong>LeRobot / SO-ARM101</strong> 的示教、训练与真机评估管线。','Built a <strong>LeRobot / SO-ARM101</strong> pipeline for demonstration, policy training, and real-robot evaluation.')],
  ['2026.06',t('加入<strong>众擎机器人</strong>，担任具身算法工程师实习生。','Joined <strong>EngineAI</strong> as an embodied AI algorithm engineering intern.')],
  ['2026.04',t('<strong>MT-PCR</strong> 荣获 <span class="news-award">CVM 2026 最佳论文奖</span>，并作口头报告。','<strong>MT-PCR</strong> received the <span class="news-award">CVM 2026 Best Paper Award</span> and an oral presentation.')],
  ['2025.08',t('团队获智能语义 <strong>SLAM 挑战赛一等奖</strong>。','Our team won <strong>First Prize in the Intelligent Semantic SLAM Challenge</strong>.')]
 ];
 const olderNews = [
  ['2024.07',t('单人参赛，获 <strong>Meta 视觉位置识别排行榜第一</strong>。','Ranked <strong>1st on the Meta Visual Place Recognition leaderboard</strong> as a sole team member.')],
  ['2023.11',t('作为项目唯一开发者，获机器人大模型与具身智能挑战赛二等奖。','Won Second Prize in the Robotics Foundation Models & Embodied AI Challenge as the sole project developer.')]
 ];
 const newsRows = rows => rows.map(([date,text])=>`<li><time datetime="${date.replace('.','-')}">${date}</time><p>${text}</p></li>`).join('');
 const html = `<!DOCTYPE html>
<html lang="${zh?'zh-CN':'en'}">
<head>
 <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
 <meta name="description" content="${description}"><meta name="theme-color" content="#fafafa">
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
  <a class="brand" href="#top"><span class="brand-icon" aria-hidden="true">b.</span><span>Bingxi Liu</span></a>
  <div id="nav-links" class="nav-links"><a href="#about">${t('关于','About')}</a><a href="#news">${t('动态','News')}</a><a href="#publications">${t('论文','Publications')}</a><a href="#projects">${t('项目','Projects')}</a><a href="#journey">${t('经历','Experience')}</a></div>
  <div class="nav-actions"><a class="language-link" href="../${zh?'en':'zh'}/" lang="${zh?'en':'zh-CN'}" aria-label="${t('Switch to English','切换到中文')}">${zh?'EN':'中文'}<span aria-hidden="true"> ↗</span></a><button type="button" class="menu-toggle" data-menu-toggle aria-controls="nav-links" aria-expanded="false" aria-label="${t('切换导航菜单','Toggle navigation menu')}"><span></span><span></span></button></div>
 </nav></header>
 <main id="main" class="container">
  <section id="top" class="profile-section" aria-labelledby="profile-title">
   <div class="profile-grid" id="about">
    <div class="profile-copy"><p class="eyebrow">VISION · ROBOTICS · INTELLIGENCE</p><h1 id="profile-title">${t('刘秉熙','Bingxi Liu')}<span>${t('Bingxi Liu','刘秉熙')}</span></h1>
     <p class="profile-role">${t('南方科技大学 · 智能制造与机器人博士生','Ph.D. student in Intelligent Manufacturing & Robotics · SUSTech')}</p>
     <div class="biography"><p>${t('我在南方科技大学攻读博士学位，师从<strong>张宏教授</strong>，预计于 2027 年 2 月毕业。此前，我在中国科学院大学获得硕士学位，师从<strong>吴毅红教授</strong>。','I am a Ph.D. student at SUSTech, advised by <strong>Prof. Hong Zhang</strong>, and expect to graduate in February 2027. I received my master’s degree from UCAS, advised by <strong>Prof. Yihong Wu</strong>.')}</p>
     <p>${t('我的研究聚焦<strong>视觉定位、三维感知与具身智能</strong>，希望让机器人在真实世界中理解空间、可靠行动。目前在<strong>众擎机器人</strong>实习，参与具身数据管线与视觉基础模型研发。','My research focuses on <strong>visual localization, 3D perception, and embodied intelligence</strong>, with the goal of helping robots understand space and act reliably. I am currently an intern at <strong>EngineAI</strong>, working on embodied data pipelines and visual foundation models.')}</p></div>
     <div class="profile-links"><a href="mailto:binuxliu@gmail.com">Email${external}</a>${outbound(scholar,'Google Scholar')}${outbound(github,'GitHub')}<a href="#journey">${t('个人经历','Background')}${arrow}</a></div>
    </div>
    <figure class="portrait"><div class="portrait-frame"><img src="../assets/images/photo.jpg" alt="${t('刘秉熙的照片','Portrait of Bingxi Liu')}" width="230" height="280" fetchpriority="high"></div><figcaption><span class="location-dot"></span>Shenzhen, China</figcaption><a class="portrait-note" href="#publications">CVPR 2026 <span>·</span> CVM Best Paper${external}</a></figure>
   </div>
   <div class="research-topics" id="research"><span class="topic-heading">${t('研究方向','Research interests')}</span><a href="#publications">${t('视觉定位','Visual localization')}<span>↗</span></a><a href="#publications">${t('三维感知','3D perception')}<span>↗</span></a><a href="#projects">${t('具身智能','Embodied intelligence')}<span>↗</span></a></div>
  </section>
  <section id="news" class="news-section" aria-labelledby="news-title"><div class="news-heading"><span class="eyebrow">LATEST UPDATES</span><h2 id="news-title">${t('最新动态','News')}<span class="heading-dot">.</span></h2></div><div class="news-content"><ol class="news-list">${newsRows(news)}</ol><details class="older-news"><summary><span class="show-more">${t('更早的动态','Earlier updates')}</span><span class="show-less">${t('收起动态','Fewer updates')}</span><span class="summary-plus" aria-hidden="true">+</span></summary><ol class="news-list">${newsRows(olderNews)}</ol></details></div></section>
  <section id="publications" class="section" aria-labelledby="publications-title">
   <div class="section-heading"><div><span class="eyebrow">RESEARCH</span><h2 id="publications-title">${t('研究论文','Publications')}<span class="heading-dot">.</span></h2></div>${outbound(scholar,t('完整学术档案','Google Scholar'),'section-link')}</div>
   <div class="publication-toolbar"><div class="filter-group" role="group" aria-label="${t('筛选论文','Filter publications')}">${[['selected',t('精选','Selected')],['all',t('全部','All')],['published',t('已发表','Published')],['review',t('在审 / 投稿','Under review')]].map(([key,label])=>`<button type="button" data-filter="${key}" data-label="${label}" aria-pressed="${key==='selected'}">${label}</button>`).join('')}</div><span id="publication-count" data-count-template="${t('{count} 项研究','{count} works')}" aria-live="polite">${t('22 项研究','22 works')}</span></div>
   <p class="publication-note">${t('* 共同第一作者 · † 通讯作者。在审及投稿条目不代表已接收。','* Equal contribution · † Corresponding author. Review and submission venues do not imply acceptance.')}</p>
   <div class="publication-list">${papers}</div>
   <div class="open-source"><span>${t('更多开源工作','More open-source work')}</span><div>${['NPR','NocPlace','SuperPlace','FeatSR','CA-Place','Deep-VLCD-Benchmark'].map(name=>outbound(`${github}/${name}`,name)).join('')}</div></div>
  </section>
  <section id="projects" class="section" aria-labelledby="projects-title">
   <div class="section-heading"><div><span class="eyebrow">RESEARCH INTO PRACTICE</span><h2 id="projects-title">${t('项目实践','Selected projects')}<span class="heading-dot">.</span></h2></div><p>${t('把视觉研究，带入真实系统。','Bringing visual research into working systems.')}</p></div>
   <div class="projects-grid">
    <article class="project-card project-robot" data-reveal><div class="project-top"><span class="project-symbol" aria-hidden="true">01</span><span>2026.08 — 09</span></div><span class="project-partner">Seeed Studio</span><h3>${t('机器人示教与策略学习','Robot demonstration & policy learning')}</h3><p>${t('基于 LeRobot 与 SO-ARM101，连接主从遥操作、多模态数据采集、ACT 策略训练与真机评估。','A LeRobot and SO-ARM101 pipeline connecting leader–follower teleoperation, multimodal data collection, ACT training, and real-robot evaluation.')}</p><div class="project-tags"><span>LeRobot</span><span>ACT</span><span>SO-ARM101</span></div><details><summary>${t('项目细节','Project details')}<span class="summary-plus" aria-hidden="true">+</span></summary><p>${t('完成舵机与全臂零位校准，接入 Orbbec 相机采集操作数据；训练、回放并评估 ACT 策略，同时探索 SmolVLA、Pi0 与 GR00T 部署。','Calibrated servos and arm zero positions, integrated an Orbbec camera for manipulation episodes, and trained and evaluated ACT policies. Also explored deployment options for SmolVLA, Pi0, and GR00T.')}</p></details></article>
    <article class="project-card" data-reveal><div class="project-top"><span class="project-symbol" aria-hidden="true">02</span><span>2026.02 — 04</span></div><span class="project-partner">${t('赛尔智控 · 深圳','赛尔智控 · Shenzhen')}</span><h3>${t('语言驱动的三维运镜','Language-driven 3D cinematography')}</h3><p>${t('融合 VLM 场景理解、SAM2 实例定位与 3D Gaussian Splatting，以自然语言规划分镜和相机轨迹。','Combining VLM scene understanding, SAM2 instance localization, and 3D Gaussian Splatting for language-driven storyboards and camera paths.')}</p><div class="project-tags"><span>3DGS</span><span>VLM</span><span>SAM2</span></div><details><summary>${t('技术路径','Technical approach')}<span class="summary-plus" aria-hidden="true">+</span></summary><p>${t('通过多视角语义理解与深度反投影定位实体，由语言模型规划分镜，再结合轨迹平滑与场景约束减少穿墙和渲染伪影。','Multi-view semantics and depth back-projection locate scene entities. A language model plans shots; trajectory smoothing and scene constraints reduce collisions and rendering artifacts.')}</p></details></article>
   </div>
   <article class="edge-project"><span class="project-symbol" aria-hidden="true">03</span><div><div class="edge-meta">${t('鹏城实验室 / 中国联通','Peng Cheng Laboratory / China Unicom')}<span>2024.04 — 2026.03</span></div><h3>${t('无人系统的端云协同感知','Edge–cloud perception for unmanned systems')}</h3><p>${t('连接 Jetson 端侧视觉模型与云侧多模态大模型，实现开放世界目标检测与跟踪。','Connecting Jetson edge vision models with cloud multimodal models for open-world detection and tracking.')}</p></div></article>
  </section>
  <section id="journey" class="section" aria-labelledby="journey-title"><div class="section-heading"><div><span class="eyebrow">BACKGROUND</span><h2 id="journey-title">${t('教育与经历','Education & experience')}<span class="heading-dot">.</span></h2></div></div><div class="journey-grid"><div><h3 class="timeline-heading">${t('教育背景','Education')}</h3><ol class="timeline">${timeline(education)}</ol></div><div><h3 class="timeline-heading">${t('研究与实习','Research & internships')}</h3><ol class="timeline">${timeline(experiences)}</ol></div></div></section>
  <section class="section awards-section" aria-labelledby="awards-title"><div class="section-heading"><div><span class="eyebrow">RECOGNITION</span><h2 id="awards-title">${t('荣誉与奖励','Honors & awards')}<span class="heading-dot">.</span></h2></div></div><div class="awards-list">${awards.map(([year,name,detail])=>`<article class="award-row"><span>${year}</span><div><h3>${name}</h3><p>${detail}</p></div></article>`).join('')}</div></section>
  <section id="contact" class="contact-section" aria-labelledby="contact-title"><div><span class="eyebrow">LET’S CONNECT</span><h2 id="contact-title">${t('让研究，产生连接。','Good research starts with a conversation.')}</h2><p>${t('欢迎交流视觉定位、三维感知与具身智能。','Let’s talk about visual localization, 3D perception, and embodied intelligence.')}</p></div><div class="contact-actions"><a href="mailto:binuxliu@gmail.com">binuxliu@gmail.com${external}</a><button class="copy-email" type="button" data-copy-email="binuxliu@gmail.com" data-copied="${t('已复制邮箱','Email copied')}" data-failed="${t('请使用邮箱链接','Use the email link')}" aria-label="${t('复制邮箱地址','Copy email address')}">${t('复制邮箱','Copy email')}</button></div></section>
 </main>
 <footer class="site-footer container"><span>© 2026 ${t('刘秉熙','Bingxi Liu')}</span><span>Vision into action.</span><a href="#top">${t('回到顶部','Back to top')} ↑</a></footer>
</body></html>`;
 await mkdir(path.join(root,lang),{recursive:true});
 await writeFile(path.join(root,lang,'index.html'),html);
}
console.log('Built Chinese and English academic homepages.');
